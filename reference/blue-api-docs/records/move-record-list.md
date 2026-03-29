---
title: Move Record to List
description: Move a record to a different list within the same project or across projects with comprehensive copying and validation.
icon: Move
---

## Move Record to List

The `moveTodo` mutation allows you to move a record to a different list. This operation creates a complete copy of the record in the destination list and removes it from the source list. Records can be moved within the same project or across different projects (with appropriate permissions).

### Basic Example

```graphql
mutation MoveTodo {
  moveTodo(
    input: {
      todoId: "todo_123abc"
      todoListId: "list_456def"
    }
  )
}
```

### Cross-Project Move Example

```graphql
mutation MoveTodoAcrossProjects {
  moveTodo(
    input: {
      todoId: "todo_123abc"
      todoListId: "different-project-list_789xyz"
    }
  )
}
```

## Input Parameters

### MoveTodoInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to move |
| `todoListId` | String! | ✅ Yes | The ID of the destination list |

## Response

The mutation returns a `Boolean!` value:
- `true` - The record was successfully moved
- Errors are thrown on failure rather than returning `false`

## What Gets Moved

When a record is moved, the following elements are copied to the new location:

- ✅ **Assignees** - All assigned users
- ✅ **Checklists** - All checklist items and their completion status
- ✅ **Comments** - All comments and replies
- ✅ **Custom Fields** - All custom field values
- ✅ **Description** - Full record description and formatting
- ✅ **Due Date** - Original due date and time
- ✅ **Tags** - All associated tags
- ✅ **Todo Actions** - All subtasks and action items
- ✅ **Files** - All file attachments (with special handling for cross-project moves)

## Position Handling

- Records are automatically positioned at the **end** of the destination list
- You cannot specify a custom position - it's calculated automatically
- Position is set to the current maximum position + 65,535

## Required Permissions

Different permission levels have different capabilities:

| User Role | Same Project | Cross-Project | File Access |
|-----------|--------------|---------------|-------------|
| `OWNER` | ✅ Yes | ✅ Yes | All files |
| `ADMIN` | ✅ Yes | ✅ Yes | All files |
| `MEMBER` | ✅ Yes | ❌ No | Own files only |

### Permission Requirements

- You must have `OWNER`, `ADMIN`, or `MEMBER` access to the source project
- You must have access to the destination project
- `MEMBER` users cannot move records between different projects
- Both projects must be active (not archived)

## Error Responses

### Record Not Found
```json
{
  "errors": [{
    "message": "Todo was not found.",
    "extensions": {
      "code": "TODO_NOT_FOUND"
    }
  }]
}
```

### List Not Found
```json
{
  "errors": [{
    "message": "Todo list was not found.",
    "extensions": {
      "code": "TODO_LIST_NOT_FOUND"
    }
  }]
}
```

### Cross-Project Permission Denied
```json
{
  "errors": [{
    "message": "You are not authorized.",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

## File Handling

### Same Project Moves
- Files are moved directly without creating copies
- All file permissions are preserved

### Cross-Project Moves
- New copies of files are created in the destination project's storage
- Original files are deleted asynchronously after successful copy
- File permissions may be updated based on destination project settings
- `MEMBER` users can only move files they own

## Side Effects

Moving a record triggers several automatic actions:

1. **Activity Logging** - Creates an activity record showing the move
2. **Notifications** - Notifies relevant project members
3. **Webhooks** - Triggers `handleTodoMoved` webhook event
4. **Automations** - Runs automations configured for record moves
5. **Real-time Updates** - Publishes live updates to all connected clients
6. **Chart Updates** - Updates project charts and statistics

## Important Notes

- **Complete Copy**: All record data is copied - you cannot selectively move only certain elements
- **Automatic Position**: Records are always placed at the end of the destination list
- **Cross-Project Restrictions**: `MEMBER` users cannot move records between projects
- **Asynchronous Cleanup**: File cleanup happens in the background for cross-project moves
- **Preserves History**: Comments, activity, and audit trails are maintained
- **Webhook Events**: Move operations trigger both deletion and creation events for real-time sync

## Use Cases

### Reorganizing Work
Move records between lists to reorganize project structure or workflow stages.

### Cross-Project Transfers
Transfer records between projects when work needs to move to a different team or phase.

### List Consolidation
Move records when combining or restructuring project lists.
