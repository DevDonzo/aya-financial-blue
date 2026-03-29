---
title: Create Automation
description: Create a new automation with a trigger and one or more actions
icon: Plus
---

## Create Automation

Create a new automation workflow for your project. An automation consists of a trigger event and one or more actions that execute when the trigger fires. The automation is created in an active state by default.

### Basic Example

```graphql
mutation CreateAutomation {
  createAutomation(
    input: {
      trigger: {
        type: TODO_CREATED
      }
      actions: [
        {
          type: ADD_TAG
          tagIds: ["tag_abc123"]
        }
      ]
    }
  ) {
    id
    isActive
    trigger {
      id
      type
    }
    actions {
      id
      type
    }
    createdAt
  }
}
```

### Advanced Example

```graphql
mutation CreateAutomationAdvanced {
  createAutomation(
    input: {
      trigger: {
        type: TODO_LIST_CHANGED
        todoListId: "list_abc123"
        tagIds: ["tag_456"]
        assigneeIds: ["user_789"]
        color: "#FF5733"
        conditionMode: ALL
      }
      actions: [
        {
          type: CHANGE_DUE_DATE
          duedIn: 7
        }
        {
          type: ADD_ASSIGNEE
          assigneeIds: ["user_101", "user_102"]
        }
        {
          type: SEND_EMAIL
          metadata: {
            email: {
              to: ["team@example.com"]
              from: "notifications@example.com"
              subject: "Record moved to In Progress"
              content: "<p>A record has been moved.</p>"
              cc: ["manager@example.com"]
            }
          }
        }
        {
          type: CREATE_CHECKLIST
          metadata: {
            checklists: [
              {
                title: "Review Checklist"
                position: 1.0
                checklistItems: [
                  {
                    title: "Code review"
                    position: 1.0
                    duedIn: 3
                    assigneeIds: ["user_101"]
                  }
                  {
                    title: "QA testing"
                    position: 2.0
                    duedIn: 5
                  }
                ]
              }
            ]
          }
        }
        {
          type: MAKE_HTTP_REQUEST
          httpOption: {
            url: "https://api.example.com/webhook"
            method: POST
            contentType: APPLICATION_JSON
            body: "{\"event\": \"record_moved\"}"
            headers: [
              { key: "X-Custom-Header", value: "automation" }
            ]
            authorizationType: BEARER_TOKEN
            authorizationBearerToken: "your-token-here"
          }
        }
      ]
    }
  ) {
    id
    isActive
    trigger {
      id
      type
      color
      todoList {
        id
        title
      }
      tags {
        id
        title
      }
      assignees {
        id
        name
      }
      conditionMode
      schedule {
        type
        hour
        minute
        timezone
        nextExecutionAt
      }
    }
    actions {
      id
      type
      duedIn
      assigneeTriggerer
      tags {
        id
        title
      }
      assignees {
        id
        name
      }
      metadata {
        ... on AutomationActionMetadataSendEmail {
          email {
            subject
            to
            from
          }
        }
        ... on AutomationActionMetadataCreateChecklist {
          checklists {
            title
            checklistItems {
              title
              duedIn
            }
          }
        }
      }
      httpOption {
        url
        method
        contentType
      }
    }
    createdBy {
      id
      name
      email
    }
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### CreateAutomationInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `trigger` | CreateAutomationTriggerInput! | Yes | The trigger event configuration |
| `actions` | [CreateAutomationActionInput!]! | Yes | One or more actions to perform when triggered |

### CreateAutomationTriggerInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | AutomationTriggerType! | Yes | The type of event that triggers the automation |
| `metadata` | AutomationTriggerMetadataInput | No | Trigger-specific metadata (e.g., overdue settings) |
| `customFieldId` | String | No | Custom field to monitor for changes |
| `customFieldOptionIds` | [String!] | No | Specific custom field option IDs to match |
| `todoListId` | String | No | Specific todo list to scope the trigger to |
| `todoListIds` | [String!] | No | Multiple todo lists to scope the trigger to |
| `tagIds` | [String!] | No | Tag IDs that must match for the trigger |
| `todoIds` | [String!] | No | Specific todo/record IDs to scope the trigger to |
| `assigneeIds` | [String!] | No | Assignee IDs that must match for the trigger |
| `color` | String | No | Color value to match (hex format) |
| `colors` | [String!] | No | Multiple color values to match |
| `dueStart` | DateTime | No | Due date range start for filtering |
| `dueEnd` | DateTime | No | Due date range end for filtering |
| `showCompleted` | Boolean | No | Whether to include completed records |
| `fields` | JSON | No | Additional field conditions |
| `op` | FilterLogicalOperator | No | Logical operator for combining filter conditions |
| `conditionMode` | ConditionalAutomationMode | No | Mode for conditional automation matching |
| `filterGroups` | JSON | No | Advanced filter group definitions |
| `filterGroupLinks` | JSON | No | Links between filter groups |
| `schedule` | CreateAutomationTriggerScheduleInput | No | Schedule configuration for SCHEDULED triggers |

### CreateAutomationTriggerScheduleInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | AutomationScheduleType! | Yes | Schedule frequency type |
| `hour` | Int! | Yes | Hour of day to execute (0-23) |
| `minute` | Int! | Yes | Minute of hour to execute (0-59) |
| `timezone` | String! | Yes | IANA timezone string (e.g., "America/New_York") |
| `days` | [Int!] | No | Specific days for the schedule |
| `dayOfWeek` | [Int!] | No | Days of week (0=Sunday, 6=Saturday) |
| `dayOfMonth` | Int | No | Day of month (1-31) |
| `month` | Int | No | Month of year (1-12) |
| `cronExpression` | String | No | Custom cron expression |
| `isActive` | Boolean | No | Whether the schedule is active |

### AutomationTriggerMetadataInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `incompleteOnly` | Boolean | No | Only trigger for incomplete records |
| `offset` | Int | No | Offset in minutes before/after the due date |

### CreateAutomationActionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | AutomationActionType! | Yes | The type of action to perform |
| `duedIn` | Int | No | Number of days to set for due date actions |
| `customFieldId` | String | No | Target custom field ID |
| `customFieldOptionIds` | [String!] | No | Custom field option IDs to set |
| `todoListId` | String | No | Target todo list ID |
| `metadata` | AutomationActionMetadataInput | No | Action-specific metadata |
| `tagIds` | [String!] | No | Tag IDs to add or remove |
| `assigneeIds` | [String!] | No | Assignee IDs to add or remove |
| `projectIds` | [String!] | No | Project IDs for cross-project actions |
| `color` | String | No | Color value to apply (hex format) |
| `assigneeTriggerer` | String | No | Special identifier to assign the triggering user |
| `portableDocumentId` | String | No | Portable document ID for PDF generation |
| `httpOption` | AutomationActionHttpOptionInput | No | HTTP request configuration |

### AutomationActionHttpOptionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | String! | Yes | The URL to send the request to |
| `method` | HttpMethod! | Yes | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `headers` | [HttpHeaderInput] | No | Custom HTTP headers |
| `parameters` | [HttpParameterInput] | No | Query parameters |
| `contentType` | HttpContentType | No | Request content type |
| `body` | String | No | Request body content |
| `authorizationType` | HttpAuthorizationType | No | Authentication type |
| `authorizationBasicAuth` | HttpAuthorizationBasicAuthInput | No | Basic auth credentials |
| `authorizationBearerToken` | String | No | Bearer token value |
| `authorizationApiKey` | HttpAuthorizationApiKeyInput | No | API key configuration |
| `oauthConnectionId` | String | No | OAuth connection ID for authenticated requests |

### AutomationActionMetadataInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklists` | [AutomationActionCreateChecklistInput] | No | Checklists to create |
| `copyTodoOptions` | [CopyTodoOption!] | No | Options for copying records |
| `email` | AutomationActionSendEmailInput | No | Email sending configuration |
| `number` | Float | No | Numeric value for custom field actions |
| `text` | String | No | Text value for custom field actions |

## Response Fields

The mutation returns an `Automation` object.

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the automation |
| `trigger` | AutomationTrigger! | The configured trigger event |
| `actions` | [AutomationAction!]! | The configured actions |
| `isActive` | Boolean! | Whether the automation is active (defaults to true) |
| `createdBy` | User! | The user who created the automation |
| `project` | Project! | The project this automation belongs to |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |

## Required Permissions

| Access Level | Can Create Automations |
|--------------|----------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |

Only owners and admins of an active project can create automations.

## Error Responses

### Authentication Required
```json
{
  "errors": [{
    "message": "You must be logged in",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```
**When**: No valid authentication token is provided.

### Unauthorized
```json
{
  "errors": [{
    "message": "Unauthorized",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```
**When**: The authenticated user does not have OWNER or ADMIN access to the project, or the project is archived.

### Project Not Found
```json
{
  "errors": [{
    "message": "Project not found",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
**When**: The project context is invalid or the project does not exist.

## Important Notes

- **Active by Default**: New automations are created in an active state and will begin triggering immediately
- **Project Scope**: Automations are created within the current project context
- **Scheduled Triggers**: When using `SCHEDULED` trigger type, the schedule configuration is required and the automation will be scheduled automatically
- **Due Date Triggers**: `DUE_DATE_EXPIRED` triggers will automatically schedule monitoring jobs for existing records
- **Conditional Automations**: `CONDITIONAL` trigger types will pre-populate a cache for efficient evaluation
- **Multiple Actions**: You can attach multiple actions to a single trigger, and they will all execute when the trigger fires
- **HTTP Actions**: Use `MAKE_HTTP_REQUEST` action type with `httpOption` to call external APIs or webhooks
