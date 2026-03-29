---
title: Copy Record
description: Create a copy of an existing record while preserving specific data elements.
icon: Copy
---

## Copy a Record

To create a copy of an existing record while maintaining specific elements, use the `copyTodo` mutation:

```graphql
mutation CopyTodo {
  copyTodo(
    input: {
      title: "new todo"
      todoId: "todo-id"
      todoListId: "todo-list-id"
      options: [
        DESCRIPTION
        DUE_DATE
        CHECKLISTS
        ASSIGNEES
        TAGS
        CUSTOM_FIELDS
        COMMENTS
      ]
    }
  )
}
```

### Required Headers
```http
x-bloo-token-id: "your-token-id"
x-bloo-token-secret: "your-token-secret" 
x-bloo-project-id: "project-id-or-slug"
x-bloo-company-id: "company-id-or-slug"
```

### Input Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | No | New title for the copied record (optional) |
| todoId | String | Yes | ID of the record to copy |
| todoListId | String | Yes | ID of the list to create the copy in |
| options | Array | Yes | Data elements to copy from original record |

### Copy Options

The `options` array accepts these values:

| Option | Description |
|--------|-------------|
| DESCRIPTION | Copies the record's description |
| DUE_DATE | Copies the due date and timezone |
| CHECKLISTS | Copies all checklists and their items |
| ASSIGNEES | Copies all assigned users (filtered by target project membership) |
| TAGS | Copies all associated tags |
| CUSTOM_FIELDS | Copies all custom field values (including file attachments) |
| COMMENTS | Copies all comments and replies |

### Example Response
```json
{
  "data": {
    "copyTodo": true
  }
}
```

<Callout variant="tip" title="Positioning Copies">
The copied record will be placed at the bottom of the target list by default. To control positioning, use the [move record mutation](/api/records/move-record-list).
</Callout> 

<Callout variant="warning" title="Required Permissions">
You need **Edit** permissions (OWNER, ADMIN, or MEMBER role) on both the source and target projects. **Note**: MEMBER role users can only copy records within the same project. Cross-project copying requires ADMIN or OWNER permissions. Failed copies will return a `FORBIDDEN` error code.
</Callout>

### Error Handling
Common error codes for this operation:
- `TODO_NOT_FOUND`: Invalid or inaccessible todoId
- `TODO_LIST_NOT_FOUND`: Invalid or inaccessible todoListId
- `FORBIDDEN`: Insufficient permissions or cross-project restriction

See [Error Codes](/api/error-codes) for complete reference.

## Advanced Features

### Cross-Project Copying
The mutation supports copying records between different projects with these considerations:
- **OWNER/ADMIN**: Can copy records across any projects they have access to
- **MEMBER**: Restricted to copying within the same project only
- **Assignee Filtering**: When copying across projects, assignees are automatically filtered to only include users who have access to the target project

### Custom Field Handling
When using the `CUSTOM_FIELDS` option:
- All custom field values are copied to the new record
- File attachments in custom fields are properly duplicated with new storage references
- Custom field types are preserved and validated against the target project's configuration

### Automation Integration
Cross-project copies may trigger additional automation rules in both source and target projects, allowing for sophisticated workflow management across project boundaries.
