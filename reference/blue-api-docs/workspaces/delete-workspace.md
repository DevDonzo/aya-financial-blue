---
title: Delete Workspace
description: How to delete workspaces in Blue.
icon: Trash2
---

## Delete a Workspace

The `deleteProject` mutation permanently removes a workspace and all its associated data from Blue.

### Basic Example

```graphql
mutation {
  deleteProject(id: "{project-id}") {
    success
  }
}
```

### With Variables

```graphql
mutation DeleteProject($projectId: String!) {
  deleteProject(id: $projectId) {
    success
  }
}
```

Variables:
```json
{
  "projectId": "abc123-project-id"
}
```

<Callout variant="warning" title="Workspace deletion is permanent">
Once a workspace is deleted, all associated data will be permanently removed from the system. This includes:
- All todos and lists
- Comments and attachments
- Custom fields and their values
- Automations
- Tags and dependencies
- User assignments
- File attachments

Please ensure you have backed up any important information before proceeding with the deletion.
</Callout>

## Mutation Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | The unique identifier of the workspace to delete |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Indicates whether the deletion was successful |

## Required Permissions

To delete a workspace, you must have:

1. **Organization-level access**: `OWNER`, `ADMIN`, or `MEMBER` role in the organization
2. **Workspace-level access**: `OWNER` or `ADMIN` role in the specific workspace

### Workspace Role Permissions

| Workspace Role | Can Delete Workspace |
|----------------|---------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |
| `CLIENT` | ❌ No |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

## Deletion Process

When you delete a workspace, Blue performs the following steps:

1. **Validation**: Verifies the workspace exists and you have permission to delete it
2. **Backup**: Saves workspace data to a trash table for potential recovery (internal use only)
3. **Immediate deletion**: Removes the workspace from the active database
4. **Notifications**: Updates related systems and notifies relevant services
5. **Background cleanup**: Asynchronously removes all associated data

## Error Responses

### Workspace Not Found
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

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You are not authorized to delete this project",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

## Important Notes

- Deletion is **cascading** - all workspace data is removed
- The process is **asynchronous** - large workspaces may take time to fully clean up
- Consider using **archive** instead of delete if you might need the workspace later
- Deleted workspaces are saved internally for recovery purposes but are not accessible via the API
