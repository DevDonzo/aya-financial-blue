---
title: Manage Record Assignees
description: Assign, add, or remove users from records using the Blue API
icon: Users
---

## Manage Record Assignees

The Blue API provides three operations for managing record assignees: setting assignees (smart replacement), adding assignees, and removing assignees. These operations handle activity tracking, notifications, webhooks, and real-time updates automatically.

### Set Record Assignees (Smart Assignment)

Replaces all current assignees with a new list. The system intelligently calculates what changes are needed, removing users not in the new list and adding new ones.

```graphql
mutation SetRecordAssignees {
  setTodoAssignees(input: {
    todoId: "record_abc123"
    assigneeIds: ["user_123", "user_456", "user_789"]
  }) {
    success
    operationId
  }
}
```

### Add Record Assignees

Adds new assignees without removing existing ones. Only users not already assigned will be added.

```graphql
mutation AddRecordAssignees {
  addTodoAssignees(input: {
    todoId: "record_abc123"
    assigneeIds: ["user_999", "user_111"]
  }) {
    success
    operationId
  }
}
```

### Remove Record Assignees

Removes specific assignees from a record.

```graphql
mutation RemoveRecordAssignees {
  removeTodoAssignees(input: {
    todoId: "record_abc123"
    assigneeIds: ["user_456"]
  }) {
    success
    operationId
  }
}
```

## Input Parameters

### SetTodoAssigneesInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to assign users to |
| `assigneeIds` | [String!]! | ✅ Yes | Array of user IDs to assign (replaces all current assignees) |

### AddTodoAssigneesInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to assign users to |
| `assigneeIds` | [String!]! | ✅ Yes | Array of user IDs to add as assignees |

### RemoveTodoAssigneesInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to remove assignees from |
| `assigneeIds` | [String!]! | ✅ Yes | Array of user IDs to remove from assignees |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Whether the operation completed successfully |
| `operationId` | String | Unique identifier for tracking this operation |

## Required Permissions

### Set/Remove Assignees

| Role | Can Assign/Remove |
|------|-------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `VIEW_ONLY` | ❌ No |
| `COMMENT_ONLY` | ❌ No |

### Add Assignees

| Role | Can Add Assignees |
|------|------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `VIEW_ONLY` | ✅ Yes |
| `COMMENT_ONLY` | ✅ Yes |

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

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to modify this record",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Invalid Input
```json
{
  "errors": [{
    "message": "Variable '$input' got invalid value; Expected non-nullable type 'String!' not to be null.",
    "extensions": {
      "code": "GRAPHQL_VALIDATION_FAILED"
    }
  }]
}
```

## Operation Comparison

| Feature | Set Assignees | Add Assignees | Remove Assignees |
|---------|---------------|---------------|------------------|
| **Logic** | Smart replacement | Incremental addition | Selective removal |
| **Activity Tracking** | ✅ Yes | ❌ No | ❌ No |
| **Notifications** | ✅ Yes | ❌ No | ❌ No |
| **Webhooks** | ✅ Yes | ❌ No | ❌ No |
| **Automations** | ✅ Yes | ❌ No | ❌ No |
| **Permission Level** | Stricter | More permissive | Stricter |

## Business Logic

### Smart Assignment (setTodoAssignees)

When you use `setTodoAssignees`, the system:

1. **Compares Lists**: Analyzes current assignees vs new assignee list
2. **Calculates Changes**: Determines who to remove, keep, and add
3. **Removes Users**: Unassigns users not in the new list
4. **Adds Users**: Assigns users in the new list who weren't previously assigned
5. **Tracks Activity**: Creates activity log entries for each change
6. **Sends Notifications**: Notifies newly assigned users
7. **Triggers Webhooks**: Fires assignee added/removed webhooks
8. **Updates Charts**: Marks analytics charts for refresh
9. **Real-time Updates**: Publishes updates to connected clients

### Simple Operations (add/remove)

The `addTodoAssignees` and `removeTodoAssignees` operations provide basic functionality without the comprehensive tracking and notification features of `setTodoAssignees`.

## Important Notes

- **Project Membership**: Assignees should be members of the project containing the record
- **No Assignment Limits**: There's no maximum number of assignees per record
- **Self-Assignment**: Users can assign themselves if they have proper permissions
- **Empty Arrays**: Providing an empty `assigneeIds` array to `setTodoAssignees` removes all assignees
- **Duplicate Prevention**: The system automatically prevents duplicate assignments
- **Database Efficiency**: Uses junction table (`TodoUser`) for scalable many-to-many relationships
- **Real-time Updates**: All connected clients receive immediate updates when assignments change

## Get Available Assignees

To get a list of users who can be assigned to records in a project:

```graphql
query GetAssignees {
  assignees(projectId: "project_abc123") {
    id
    name
    email
    avatar
  }
}
```

This query returns all project members who can potentially be assigned to records.

## Related Operations

- [List Records](/api/records/list-records) - Get records with their current assignees
- [Update Record](/api/records/update-record) - Modify other record properties
- [Add Comment](/api/records/add-comment) - Add comments to assigned records
