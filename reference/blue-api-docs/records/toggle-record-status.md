---
title: Toggle Record Status
description: Toggle a record between complete and incomplete status with a single mutation.
icon: ToggleLeft
---

## Toggle Record Status

The `updateTodoDoneStatus` mutation provides a simple way to toggle a record's completion status. If the record is incomplete, it marks it as complete. If it's complete, it marks it as incomplete.

### Example

```graphql
mutation ToggleRecordStatus {
  updateTodoDoneStatus(todoId: "todo_123") {
    id
    title
    done
    updatedAt
  }
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to toggle |

## Response

Returns the updated `Todo` object with all available fields. Commonly used fields include:

- `id` - Record identifier
- `title` - Record title
- `done` - New completion status (true/false)
- `updatedAt` - Timestamp of the update
- All other [Todo fields](/api/records/list-records#todo-fields) are available

## Required Permissions

| Access Level | Can Toggle Status |
|--------------|-------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

**Note**: Custom roles with `allowMarkRecordsAsDone: false` will be blocked from using this mutation.

## Error Responses

### TodoNotFoundError
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

### UnauthorizedError
```json
{
  "errors": [{
    "message": "You are not authorized.",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

## Important Notes

### Side Effects
Toggling a record's status triggers several automated actions:

- **Activity Log**: Creates entries for MARK_AS_COMPLETE or MARK_AS_INCOMPLETE
- **Webhooks**: Sends notifications to configured webhook endpoints with before/after states
- **Automations**: Triggers TODO_MARKED_AS_COMPLETE or TODO_MARKED_AS_INCOMPLETE automation rules
- **Real-time Notifications**: Sends updates to relevant users (if configured)
- **Real-time Publishing**: Publishes todo updates to connected clients
- **Time Tracking**: Updates time duration custom fields automatically
- **Search Index**: Updates the search index for improved discoverability
- **Analytics**: Updates charts and reports
- **Activity Feed**: Completed records appear in the company activity feed

### Usage Tips
- The mutation is idempotent - calling it twice returns the record to its original state
- The operation is atomic - either succeeds completely or fails with no changes
- Custom roles can restrict this action via the `allowMarkRecordsAsDone` permission

### Related Endpoints
- **List Records**: Use `todoQueries.todos` to query and filter records
- **Bulk Update**: Use `updateTodos` to modify multiple records at once
