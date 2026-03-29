---
title: Checklist Items
description: Create, edit, and delete checklist items, manage assignees, and set due dates.
icon: ListChecks
---

## Create a Checklist Item

The `createChecklistItem` mutation adds a new item to an existing checklist. Items can later be assigned to users, given due dates, and marked as complete.

### Basic Example

```graphql
mutation CreateChecklistItem {
  createChecklistItem(
    input: {
      checklistId: "clm4n8qwx000008l0checklist1"
      title: "Write unit tests"
      position: 1
    }
  ) {
    id
    title
    position
    done
  }
}
```

### Advanced Example

```graphql
mutation CreateChecklistItemAdvanced {
  createChecklistItem(
    input: {
      checklistId: "clm4n8qwx000008l0checklist1"
      title: "Review deployment configuration"
      position: 3
    }
  ) {
    id
    title
    position
    done
    startedAt
    duedAt
    createdAt
    updatedAt
    createdBy {
      id
      fullName
    }
    checklist {
      id
      title
      todo {
        id
        title
      }
    }
    users {
      id
      fullName
    }
  }
}
```

### CreateChecklistItemInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistId` | String! | Yes | ID of the checklist to add the item to |
| `title` | String! | Yes | Title of the checklist item (HTML is sanitized to plain text) |
| `position` | Float! | Yes | Position of the item within the checklist (used for ordering) |

## Edit a Checklist Item

The `editChecklistItem` mutation allows you to update an item's title, position, completion status, or move it to a different checklist.

### Basic Example

Mark an item as done:

```graphql
mutation MarkItemDone {
  editChecklistItem(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      done: true
    }
  ) {
    id
    title
    done
  }
}
```

### Advanced Example

Update multiple fields and move to a different checklist:

```graphql
mutation EditChecklistItem {
  editChecklistItem(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      checklistId: "clm4n8qwx000008l0checklist2"
      title: "Updated task description"
      position: 2
      done: false
    }
  ) {
    id
    title
    position
    done
    checklist {
      id
      title
    }
    users {
      id
      fullName
    }
  }
}
```

### EditChecklistItemInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistItemId` | String! | Yes | ID of the checklist item to edit |
| `checklistId` | String | No | ID of a different checklist to move this item to |
| `title` | String | No | Updated title (HTML is sanitized to plain text) |
| `position` | Float | No | Updated position within the checklist |
| `done` | Boolean | No | Set to `true` to mark complete, `false` to mark incomplete |

## Delete a Checklist Item

The `deleteChecklistItem` mutation permanently removes a checklist item.

### Basic Example

```graphql
mutation DeleteChecklistItem {
  deleteChecklistItem(id: "clm4n8qwx000008l0item1")
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | ID of the checklist item to delete |

### Response

Returns `Boolean!` -- `true` if the item was successfully deleted.

## Set Checklist Item Assignees

The `setChecklistItemAssignees` mutation sets the full list of users assigned to a checklist item. This replaces any existing assignments -- pass all desired assignee IDs each time.

### Basic Example

```graphql
mutation AssignChecklistItem {
  setChecklistItemAssignees(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      assigneeIds: ["user_123", "user_456"]
    }
  )
}
```

### To Remove All Assignees

```graphql
mutation UnassignAllFromItem {
  setChecklistItemAssignees(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      assigneeIds: []
    }
  )
}
```

### SetChecklistItemAssigneesInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistItemId` | String! | Yes | ID of the checklist item |
| `assigneeIds` | [String!]! | Yes | Array of user IDs to assign. Pass an empty array to remove all assignees |

### Response

Returns `Boolean!` -- `true` if assignees were successfully updated.

## Update Checklist Item Due Date

The `updateChecklistItemDueDate` mutation sets or clears the start and due dates on a checklist item. Setting a due date also schedules an overdue notification.

### Basic Example

Set a due date:

```graphql
mutation SetItemDueDate {
  updateChecklistItemDueDate(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      duedAt: "2025-03-15T17:00:00Z"
    }
  ) {
    id
    title
    startedAt
    duedAt
  }
}
```

### Advanced Example

Set both start and due dates:

```graphql
mutation SetItemDateRange {
  updateChecklistItemDueDate(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      startedAt: "2025-03-10T09:00:00Z"
      duedAt: "2025-03-15T17:00:00Z"
    }
  ) {
    id
    title
    startedAt
    duedAt
    users {
      id
      fullName
    }
  }
}
```

### Remove Due Date

Pass `null` for both fields to clear all dates:

```graphql
mutation RemoveItemDueDate {
  updateChecklistItemDueDate(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      startedAt: null
      duedAt: null
    }
  ) {
    id
    startedAt
    duedAt
  }
}
```

### UpdateChecklistItemDueDateInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistItemId` | String! | Yes | ID of the checklist item |
| `startedAt` | DateTime | No | Start date/time. Pass `null` to clear |
| `duedAt` | DateTime | No | Due date/time. Pass `null` to clear |

## Response Fields

All mutations that return a `ChecklistItem` include these fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the checklist item |
| `title` | String! | Item title |
| `position` | Float! | Position within the checklist |
| `done` | Boolean! | Whether the item is marked as complete |
| `startedAt` | DateTime | Start date/time, if set |
| `duedAt` | DateTime | Due date/time, if set |
| `createdAt` | DateTime! | When the item was created |
| `updatedAt` | DateTime! | When the item was last updated |
| `checklist` | Checklist! | The parent checklist |
| `createdBy` | User! | The user who created the item |
| `users` | [User!]! | Users assigned to this item |

## Required Permissions

All checklist item mutations require the same access level:

| Access Level | Can Manage Checklist Items |
|--------------|---------------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | Yes |
| `CLIENT` | Yes |
| `COMMENT_ONLY` | No |
| `VIEW_ONLY` | No |

## Error Responses

### Permission Denied
```json
{
  "errors": [{
    "message": "You do not have permission to perform this action.",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```
**When**: The user has `VIEW_ONLY` or `COMMENT_ONLY` access, or the workspace is archived.

### Checklist Not Found
```json
{
  "errors": [{
    "message": "Checklist was not found.",
    "extensions": {
      "code": "CHECKLIST_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `checklistId` does not exist or the user lacks access.

### Checklist Item Not Found
```json
{
  "errors": [{
    "message": "Checklist item was not found.",
    "extensions": {
      "code": "CHECKLIST_ITEM_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `checklistItemId` does not exist or the user lacks access.

## Important Notes

### Title Sanitization
- Checklist item titles are automatically sanitized. HTML tags are stripped and the plain text content is stored.

### Completion Status
- Toggling the `done` field on a checklist item triggers automation rules (`CHECKLIST_ITEM_MARKED_AS_DONE` / `CHECKLIST_ITEM_MARKED_AS_UNDONE`).
- The parent record tracks aggregate completion via `checklistCount` and `checklistCompletedCount` fields.

### Assignee Behavior
- `setChecklistItemAssignees` is a **replace** operation -- it sets the exact list of assignees each time.
- Only users who are members of the workspace can be assigned.
- Assigning a user sends them an email and push notification.

### Due Date Behavior
- Setting a due date schedules an automatic overdue notification for assigned users.
- Changing or removing the due date triggers appropriate webhook events (`dueDateAdded`, `dueDateUpdated`, or `dueDateRemoved`).

### Side Effects
All checklist item mutations trigger:
- Activity log entries
- Webhook notifications
- Real-time updates pushed to users viewing the record

### Related Endpoints
- **Create Checklist**: Use `createChecklist` to create a checklist before adding items
- **Edit Checklist**: Use `editChecklist` to rename or reorder the parent checklist
- **Query Checklist Items**: Use the `checklistItems` query to search items across all records
