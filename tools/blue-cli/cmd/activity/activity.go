package activity

import "github.com/spf13/cobra"

// Cmd is the parent command for activity operations.
var Cmd = &cobra.Command{
	Use:   "activity",
	Short: "View workspace and organization activity",
	Long:  "Inspect the Blue activity feed for workspaces or the company.",
}

func init() {
	Cmd.AddCommand(listCmd)
}
