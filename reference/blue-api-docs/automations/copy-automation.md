---
title: Copy Automation
description: Duplicate an existing automation within the same project
icon: Copy
---

## Copy Automation

Create a copy of an existing automation within the same project. The new automation duplicates the trigger configuration and all actions from the original, but is created in an inactive state by default. This is useful for creating variations of existing automations without building them from scratch.

### Basic Example

```graphql
mutation CopyAutomation {
  copyAutomation(
    input: {
      automationId: "automation_abc123"
    }
  ) {
    id
    isActive
    trigger {
      type
    }
    actions {
      type
    }
    createdAt
  }
}
```

### Advanced Example

```graphql
mutation CopyAutomationAdvanced {
  copyAutomation(
    input: {
      automationId: "automation_abc123"
      isActive: false
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
      customField {
        id
        name
        type
      }
      customFieldOptions {
        id
        title
      }
      conditionMode
      filterGroups
      filterGroupLinks
    }
    actions {
      id
      type
      duedIn
      color
      assigneeTriggerer
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
      customField {
        id
        name
      }
      customFieldOptions {
        id
        title
      }
      projects {
        id
        title
      }
      portableDocument {
        id
      }
      httpOption {
        url
        method
        contentType
        authorizationType
      }
      metadata {
        ... on AutomationActionMetadataSendEmail {
          email {
            subject
            to
            from
            cc
            bcc
            content
          }
        }
        ... on AutomationActionMetadataCreateChecklist {
          checklists {
            title
            position
            checklistItems {
              title
              position
              duedIn
            }
          }
        }
        ... on AutomationActionMetadataCopyTodo {
          copyTodoOptions
        }
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

### CopyAutomationInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `automationId` | String! | Yes | The ID of the automation to copy |
| `isActive` | Boolean | No | Set the copied automation's active state (defaults to inactive) |

## Response Fields

The mutation returns the newly created `Automation` object.

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the new automation copy |
| `trigger` | AutomationTrigger! | The duplicated trigger configuration |
| `actions` | [AutomationAction!]! | The duplicated actions |
| `isActive` | Boolean! | Active status (defaults to false) |
| `createdBy` | User! | The user who performed the copy (not the original creator) |
| `project` | Project! | The project this automation belongs to |
| `createdAt` | DateTime! | Timestamp of the copy operation |
| `updatedAt` | DateTime! | Timestamp of the copy operation |

## Required Permissions

| Access Level | Can Copy Automations |
|--------------|---------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |

Only owners and admins of an active project can copy automations.

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
    "message": "Automation or its trigger not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```
**When**: The specified `automationId` does not exist or its trigger data is missing.

## Important Notes

- **Inactive by Default**: Copied automations are created in an inactive state to prevent unintended triggers; use `editAutomation` to activate when ready
- **New Owner**: The `createdBy` field is set to the user performing the copy, not the original automation's creator
- **Full Duplication**: All trigger conditions, action configurations, HTTP options, email settings, checklist templates, and tag/assignee references are copied
- **Assignee Fallback**: For `ASSIGNEE_ADDED` or `ASSIGNEE_REMOVED` trigger types, if the original has no assignees configured, the copying user is added as the default assignee
- **No Schedule Copy**: Scheduled triggers are not automatically rescheduled for the copy -- activate the automation via `editAutomation` to start the schedule
- **Same Project**: The copy is created within the same project as the original automation
