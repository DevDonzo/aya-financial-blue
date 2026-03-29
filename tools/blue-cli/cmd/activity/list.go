package activity

import (
	"encoding/json"
	"fmt"
	"strings"

	"blue-cli/common"

	"github.com/spf13/cobra"
)

type ActivityUser struct {
	ID        string `json:"id"`
	FullName  string `json:"fullName"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

type ActivityProject struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type ActivityTodo struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

type ActivityComment struct {
	ID   string `json:"id"`
	Text string `json:"text"`
}

type Activity struct {
	ID         string           `json:"id"`
	UID        string           `json:"uid"`
	Category   string           `json:"category"`
	HTML       string           `json:"html"`
	CreatedAt  string           `json:"createdAt"`
	UpdatedAt  string           `json:"updatedAt"`
	CreatedBy  ActivityUser     `json:"createdBy"`
	AffectedBy *ActivityUser    `json:"affectedBy,omitempty"`
	Project    *ActivityProject `json:"project,omitempty"`
	Todo       *ActivityTodo    `json:"todo,omitempty"`
	Comment    *ActivityComment `json:"comment,omitempty"`
}

type ActivityListResponse struct {
	ActivityList struct {
		Activities []Activity `json:"activities"`
		TotalCount int        `json:"totalCount"`
	} `json:"activityList"`
}

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List activity entries",
	Long:  "Show recent activity for a workspace or the company.",
	Example: `  blue activity list --workspace <id> --limit 20
  blue activity list --company aya --limit 50
  blue activity list --workspace <id> --user <user_id> --simple`,
	RunE: runList,
}

var (
	listWorkspace string
	listCompany   string
	listUser      string
	listLimit     int
	listSimple    bool
	listJSON      bool
)

func init() {
	listCmd.Flags().StringVarP(&listWorkspace, "workspace", "w", "", "Workspace ID or slug to filter activity")
	listCmd.Flags().StringVarP(&listCompany, "company", "c", "", "Company ID or slug to filter activity")
	listCmd.Flags().StringVarP(&listUser, "user", "u", "", "User ID to filter activity")
	listCmd.Flags().IntVar(&listLimit, "limit", 20, "Number of activity entries to fetch")
	listCmd.Flags().BoolVarP(&listSimple, "simple", "s", false, "Show compact activity output")
	listCmd.Flags().BoolVar(&listJSON, "json", false, "Output raw JSON")
}

func runList(cmd *cobra.Command, args []string) error {
	if listWorkspace == "" && listCompany == "" {
		return fmt.Errorf("either --workspace or --company is required")
	}

	config, err := common.LoadConfig()
	if err != nil {
		return fmt.Errorf("failed to load configuration: %w", err)
	}

	client := common.NewClient(config)

	variables := map[string]interface{}{
		"first": listLimit,
	}

	if listWorkspace != "" {
		client.SetProject(listWorkspace)
		variables["projectId"] = listWorkspace
	}

	if listWorkspace == "" {
		targetCompany := listCompany
		if targetCompany == "" {
			targetCompany = config.CompanyID
		}
		if targetCompany != "" {
			variables["companyId"] = targetCompany
		}
	}

	if listUser != "" {
		variables["userId"] = listUser
	}

	query := `
		query ActivityList($companyId: String, $projectId: String, $userId: String, $first: Int!) {
			activityList(companyId: $companyId, projectId: $projectId, userId: $userId, first: $first, orderBy: createdAt_DESC) {
				activities {
					id
					uid
					category
					html
					createdAt
					updatedAt
					createdBy {
						id
						fullName
						firstName
						lastName
						email
					}
					affectedBy {
						id
						fullName
						firstName
						lastName
						email
					}
					project {
						id
						name
						slug
					}
					todo {
						id
						title
					}
					comment {
						id
						text
					}
				}
				totalCount
			}
		}
	`

	var response ActivityListResponse
	if err := client.ExecuteQueryWithResult(query, variables, &response); err != nil {
		return fmt.Errorf("failed to fetch activity: %w", err)
	}

	activities := response.ActivityList.Activities
	if len(activities) == 0 {
		fmt.Println("No activity found.")
		return nil
	}

	if listJSON {
		encoded, err := json.MarshalIndent(activities, "", "  ")
		if err != nil {
			return fmt.Errorf("failed to encode JSON: %w", err)
		}
		fmt.Println(string(encoded))
		return nil
	}

	fmt.Printf("Found %d activity item(s)\n\n", len(activities))

	for i, activity := range activities {
		if listSimple {
			fmt.Printf("%d. %s | %s | %s\n", i+1, activity.CreatedAt, formatActor(activity.CreatedBy), activity.Category)
			if details := activitySummary(activity); details != "" {
				fmt.Printf("   %s\n", details)
			}
			fmt.Println()
			continue
		}

		fmt.Printf("%d. %s\n", i+1, activity.Category)
		fmt.Printf("   Created: %s\n", activity.CreatedAt)
		fmt.Printf("   Actor: %s\n", formatActor(activity.CreatedBy))
		if activity.AffectedBy != nil {
			fmt.Printf("   Affected: %s\n", formatMaybeActor(*activity.AffectedBy))
		}
		if activity.Project != nil {
			fmt.Printf("   Workspace: %s (%s)\n", activity.Project.Name, activity.Project.ID)
		}
		if activity.Todo != nil {
			fmt.Printf("   Record: %s (%s)\n", activity.Todo.Title, activity.Todo.ID)
		}
		if activity.Comment != nil {
			fmt.Printf("   Comment: %s\n", common.TruncateString(strings.TrimSpace(activity.Comment.Text), 160))
		}
		if activity.HTML != "" {
			fmt.Printf("   Summary: %s\n", common.TruncateString(strings.TrimSpace(activity.HTML), 220))
		}
		if i < len(activities)-1 {
			fmt.Println()
		}
	}

	return nil
}

func formatActor(user ActivityUser) string {
	name := strings.TrimSpace(user.FullName)
	if name == "" {
		name = strings.TrimSpace(user.FirstName + " " + user.LastName)
	}
	if name == "" {
		name = user.Email
	}
	if name == "" {
		name = user.ID
	}
	return name
}

func formatMaybeActor(user ActivityUser) string {
	name := formatActor(user)
	if name == "" {
		return "unknown"
	}
	return name
}

func activitySummary(activity Activity) string {
	if activity.Todo != nil && activity.Todo.Title != "" {
		return activity.Todo.Title
	}
	if activity.Comment != nil && activity.Comment.Text != "" {
		return common.TruncateString(strings.TrimSpace(activity.Comment.Text), 160)
	}
	if activity.HTML != "" {
		return common.TruncateString(strings.TrimSpace(activity.HTML), 160)
	}
	return ""
}
