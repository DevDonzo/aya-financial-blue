---
title: Edit Automation
description: Update an existing automation's trigger, actions, or active status
icon: Pencil
---

## Edit Automation

Update an existing automation by modifying its trigger, actions, or active status. All fields in the input are optional except `automationId`, allowing you to update only the parts you need. When updating actions, the existing actions are replaced entirely with the new set.

### Basic Example

```graphql
mutation EditAutomation {
  editAutomation(
    input: {
      automationId: "automation_abc123"
      isActive: false
    }
  ) {
    id
    isActive
    updatedAt
  }
}
```

### Advanced Example

```graphql
mutation EditAutomationAdvanced {
  editAutomation(
    input: {
      automationId: "automation_abc123"
      isActive: true
      trigger: {
        type: TODO_LIST_CHANGED
        todoListId: "list_new456"
        tagIds: ["tag_789"]
        conditionMode: ANY
      }
      actions: [
        {
          type: ADD_ASSIGNEE
          assigneeIds: ["user_101"]
        }
        {
          type: CHANGE_DUE_DATE
          duedIn: 14
        }
        {
          type: SEND_EMAIL
          metadata: {
            email: {
              to: ["team@example.com"]
              from: "noreply@example.com"
              subject: "Updated automation triggered"
              content: "<p>An automation has been triggered.</p>"
            }
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
      todoList {
        id
        title
      }
      tags {
        id
        title
      }
      conditionMode
    }
    actions {
      id
      type
      duedIn
      assignees {
        id
        name
      }
      metadata {
        ... on AutomationActionMetadataSendEmail {
          email {
            subject
            to
          }
        }
      }
    }
    createdBy {
      id
      name
    }
    updatedAt
  }
}
```

## Input Parameters

### EditAutomationInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `automationId` | String! | Yes | The ID of the automation to update |
| `trigger` | CreateAutomationTriggerInput | No | Updated trigger configuration (replaces the existing trigger) |
| `actions` | [CreateAutomationActionInput!] | No | Updated list of actions (replaces all existing actions) |
| `isActive` | Boolean | No | Set the automation's active state |

The `trigger` and `actions` inputs use the same types as `createAutomation`. See [Create Automation](/api/automations/create-automation) for the full parameter reference for `CreateAutomationTriggerInput` and `CreateAutomationActionInput`.

## Response Fields

The mutation returns the updated `Automation` object.

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the automation |
| `trigger` | AutomationTrigger! | The updated trigger configuration |
| `actions` | [AutomationAction!]! | The updated actions list |
| `isActive` | Boolean! | Current active status |
| `createdBy` | User! | The user who originally created the automation |
| `project` | Project! | The project this automation belongs to |
| `createdAt` | DateTime! | Original creation timestamp |
| `updatedAt` | DateTime! | Timestamp of this update |

## Required Permissions

| Access Level | Can Edit Automations |
|--------------|---------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |

Only owners and admins of an active project can edit automations.

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

### Automation Not Found
```json
{
  "errors": [{
    "message": "Automation not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```
**When**: The specified `automationId` does not exist or belongs to a different project.

## Important Notes

- **Partial Updates**: You can update just the `isActive` status without changing the trigger or actions
- **Actions Replacement**: When providing `actions`, the entire set of existing actions is replaced -- there is no way to update individual actions
- **Trigger Update**: The trigger is updated in place, preserving its ID
- **Schedule Management**: Changing a trigger to or from `SCHEDULED` type automatically manages the underlying schedule jobs
- **Due Date Triggers**: Changes to `DUE_DATE_EXPIRED` triggers automatically update monitoring jobs
- **Conditional Automations**: Editing a `CONDITIONAL` automation re-populates its evaluation cache; changing away from `CONDITIONAL` type clears the cache
- **Active Toggle**: Deactivating a scheduled automation pauses its schedule; reactivating it resumes the schedule
