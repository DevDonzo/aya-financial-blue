---
title: Delete Automation
description: Permanently delete an automation and clean up all associated resources
icon: Trash2
---

## Delete Automation

Permanently delete an automation from your project. This removes the automation, its trigger, all associated actions, and cleans up any scheduled jobs or caches. This action cannot be undone.

### Basic Example

```graphql
mutation DeleteAutomation {
  deleteAutomation(id: "automation_abc123")
}
```

### Advanced Example

```graphql
mutation DeleteAutomationWithAlias {
  removeWorkflow: deleteAutomation(id: "automation_abc123")
  removeNotifier: deleteAutomation(id: "automation_def456")
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | The ID of the automation to delete |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| (root) | Boolean! | Returns `true` if the automation was successfully deleted |

## Required Permissions

| Access Level | Can Delete Automations |
|--------------|----------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |

Only owners and admins of an active project can delete automations.

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
**When**: The specified `id` does not exist or belongs to a different project.

## Important Notes

- **Permanent Action**: Deletion is irreversible -- the automation and all its configuration are permanently removed
- **Schedule Cleanup**: If the automation has an active schedule, it is automatically unscheduled before deletion
- **Due Date Cleanup**: For `DUE_DATE_EXPIRED` triggers, all associated monitoring jobs are removed for both regular todo due dates and custom field due dates
- **Cache Cleanup**: For `CONDITIONAL` automations, the evaluation cache is invalidated upon deletion
- **Batch Deletion**: You can delete multiple automations in a single request using GraphQL aliases as shown in the advanced example
- **Subscription Notification**: A deletion event is published to subscribers, notifying any connected clients
