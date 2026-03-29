---
title: Manage Checklists
description: Edit and delete checklists on records in Blue.
icon: Settings
---

## Edit a Checklist

The `editChecklist` mutation allows you to rename a checklist or change its position within a record.

### Basic Example

Rename a checklist:

```graphql
mutation RenameChecklist {
  editChecklist(
    input: {
      checklistId: "clm4n8qwx000008l0checklist1"
      title: "Updated Checklist Name"
    }
  ) {
    id
    title
    position
  }
}
```

### Advanced Example

Update both the title and position:

```graphql
mutation EditChecklistAdvanced {
  editChecklist(
    input: {
      checklistId: "clm4n8qwx000008l0checklist1"
      title: "Pre-Release Verification"
      position: 1
    }
  ) {
    id
    title
    position
    createdAt
    updatedAt
    createdBy {
      id
      fullName
    }
    todo {
      id
      title
    }
    checklistItems {
      id
      title
      done
    }
  }
}
```

## Input Parameters

### EditChecklistInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistId` | String! | Yes | ID of the checklist to edit |
| `title` | String | No | New title for the checklist |
| `position` | Float | No | New position within the record (used for ordering) |

## Response Fields

The mutation returns a `Checklist` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the checklist |
| `title` | String! | Checklist title |
| `position` | Float! | Position within the record |
| `createdAt` | DateTime! | When the checklist was created |
| `updatedAt` | DateTime! | When the checklist was last updated |
| `todo` | Todo! | The parent record |
| `checklistItems` | [ChecklistItem!]! | Items within the checklist |
| `createdBy` | User! | The user who created the checklist |

## Delete a Checklist

The `deleteChecklist` mutation permanently removes a checklist and all of its items from a record.

### Basic Example

```graphql
mutation DeleteChecklist {
  deleteChecklist(id: "clm4n8qwx000008l0checklist1")
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | ID of the checklist to delete |

### Response

Returns `Boolean!` -- `true` if the checklist was successfully deleted.

## Required Permissions

| Access Level | Can Edit/Delete Checklists |
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
**When**: The specified checklist ID does not exist or the user lacks access to the parent record.

## Important Notes

### Destructive Operation
- **Deleting a checklist removes all of its items permanently.** This action cannot be undone. All checklist item assignments, due dates, and completion statuses are lost.

### Side Effects
Editing a checklist triggers:
- Activity log entry (`UPDATE_CHECKLIST` action with old and new titles)
- Webhook notification (`todoChecklistNameChanged`) when the title changes
- Real-time update pushed to all users viewing the record

Deleting a checklist triggers:
- Activity log entry (`DELETE_CHECKLIST` action)
- Webhook notification (`todoChecklistDeleted`)
- Real-time update pushed to all users viewing the record

### Business Logic
- **Partial Updates**: You can update just the `title`, just the `position`, or both in a single call. Only the provided fields are modified.
- **Reordering**: To reorder checklists within a record, update the `position` field. Use fractional values (e.g., 1.5) to insert between existing positions without updating other checklists.

### Related Endpoints
- **Create Checklist**: Use `createChecklist` to add a new checklist to a record
- **Checklist Items**: Use `createChecklistItem`, `editChecklistItem`, and `deleteChecklistItem` to manage items within a checklist
- **Set Assignees**: Use `setChecklistItemAssignees` to assign users to checklist items
- **Set Due Dates**: Use `updateChecklistItemDueDate` to add due dates to checklist items
