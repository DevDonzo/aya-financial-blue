---
title: Delete Saved View
description: Permanently delete a saved view from a Blue workspace.
icon: Trash2
---

## Delete a Saved View

The `deleteSavedView` mutation permanently removes a saved view from a workspace. If the deleted view was set as the workspace default or any user's personal default, those references are automatically cleared.

### Basic Example

```graphql
mutation DeleteSavedView {
  deleteSavedView(id: "view_abc123") {
    success
  }
}
```

### With Variables

```graphql
mutation DeleteSavedView($viewId: String!) {
  deleteSavedView(id: $viewId) {
    success
  }
}
```

Variables:
```json
{
  "viewId": "view_abc123"
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | The unique identifier of the saved view to delete |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Indicates whether the deletion was successful |

## Required Permissions

| Scenario | Who Can Delete |
|----------|---------------|
| Personal view (own) | Creator only |
| Shared view (own) | Creator, OWNER, or ADMIN |
| Shared view (other's) | OWNER or ADMIN only |

Only the view creator can delete their own personal views. For shared views, the creator or any workspace OWNER/ADMIN can perform the deletion.

## Error Responses

### Saved View Not Found
```json
{
  "errors": [{
    "message": "Saved view was not found.",
    "extensions": {
      "code": "SAVED_VIEW_NOT_FOUND"
    }
  }]
}
```
**When**: The saved view ID does not exist, or the user does not have access to the workspace.

### Unauthorized
```json
{
  "errors": [{
    "message": "You are not authorized to perform this action.",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```
**When**: The user does not have permission to delete the view (e.g., trying to delete another user's personal view, or a non-OWNER/ADMIN trying to delete another user's shared view).

## Important Notes

- **Permanent Action**: Deleting a saved view is permanent and cannot be undone.
- **Default View Cleanup**: If the deleted view was set as the workspace default (`defaultSavedView`) or any user's personal default (`userDefaultSavedView`), those references are automatically cleared to `null` before the view is removed.
- **Real-time Updates**: Deleting a saved view triggers a real-time subscription event so other connected clients are notified immediately.
- **Cascading Behavior**: Only the saved view record itself is deleted. The underlying workspace data (records, custom fields, etc.) is not affected.

### Related Endpoints
- **Create Saved View**: Use `createSavedView` mutation to create new views
- **List Saved Views**: Query `savedViews` to retrieve all views
- **Edit Saved View**: Use `editSavedView` mutation to update views
