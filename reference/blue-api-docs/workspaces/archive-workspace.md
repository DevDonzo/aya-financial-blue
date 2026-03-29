---
title: Archive Workspace
description: How to archive and unarchive workspaces in Blue.
icon: Archive
---

## Archive a Workspace

Archiving workspaces is useful when you want to temporarily hide a workspace without permanently deleting it. Archived workspaces:
- Are hidden from active workspace lists
- Cannot be edited or modified
- Can still be viewed by workspace members
- Can be unarchived at any time

### Basic Example

```graphql
mutation {
  archiveProject(id: "project-123")
}
```

### Using Workspace Context Header

```graphql
# With header: x-bloo-project-id: project-123
mutation {
  archiveProject
}
```

### With Variables

```graphql
mutation ArchiveProject($projectId: String!) {
  archiveProject(id: $projectId)
}
```

Variables:
```json
{
  "projectId": "abc123-project-id"
}
```

## Unarchive a Workspace

To restore an archived workspace to active status:

```graphql
mutation {
  unarchiveProject(id: "project-123")
}
```

## Mutation Parameters

### archiveProject

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | No | The workspace ID to archive. If not provided, uses the workspace from context headers. |

### unarchiveProject

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | No | The workspace ID to unarchive. If not provided, uses the workspace from context headers. |

## Response

Both mutations return a Boolean indicating success:

| Field | Type | Description |
|-------|------|-------------|
| `Boolean` | Boolean! | Returns `true` when the operation is successful |

## Required Permissions

| Workspace Role | Can Archive/Unarchive |
|----------------|---------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |
| `CLIENT` | ❌ No |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

## Workspace ID Resolution

The workspace ID can be specified in two ways:

1. **As a parameter** (recommended):
   ```graphql
   archiveProject(id: "project-123")
   ```

2. **Via HTTP header**:
   - `x-bloo-project-id: project-123` (preferred)
   - `x-project-id: project-123` (deprecated)

If both are provided, the parameter takes precedence.

## Error Responses

### Workspace Not Found
```json
{
  "errors": [{
    "message": "Project was not found.",
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
    "message": "You don't have permission to archive this project",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

## What Happens When Archiving

When you archive a workspace:

1. **Workspace Status**: The workspace is marked as archived
2. **Visibility**: Hidden from active workspace lists
3. **Templates**: If the workspace was a template, it loses template status
4. **Position**: Moved to the end of user's workspace list
5. **Folders**: Removed from any workspace folders
6. **Activity Log**: Archive action is recorded
7. **Real-time Updates**: All connected users are notified

## Important Notes

- **Idempotent Operation**: Archiving an already archived workspace returns `true` without changes
- **Reversible**: Use `unarchiveProject` to restore the workspace
- **View Access**: Archived workspaces remain viewable by existing members
- **No Data Loss**: Archiving preserves all workspace data, unlike deletion
- **Alternative to Deletion**: Consider archiving instead of deleting for temporary removal
