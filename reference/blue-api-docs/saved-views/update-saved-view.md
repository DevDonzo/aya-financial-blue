---
title: Update Saved View
description: Edit saved view properties, reorder views, and set default views in Blue workspaces.
icon: Pencil
---

## Update a Saved View

The `editSavedView` mutation allows you to update the name, icon, sharing status, or configuration of an existing saved view.

### Basic Example

Rename a saved view:

```graphql
mutation EditSavedView {
  editSavedView(
    input: {
      id: "view_abc123"
      name: "Updated View Name"
    }
  ) {
    id
    name
    updatedAt
  }
}
```

### Advanced Example

Update the view configuration, icon, and sharing status:

```graphql
mutation EditSavedViewAdvanced {
  editSavedView(
    input: {
      id: "view_abc123"
      name: "Sprint Board - Q1"
      icon: "kanban"
      isShared: true
      viewConfig: {
        filters: {
          op: "AND"
          fields: [
            {
              type: "CUSTOM_FIELD"
              customFieldId: "cf_sprint_789"
              customFieldType: "SELECT_SINGLE"
              values: ["Sprint 12"]
              op: "IN"
            }
          ]
        }
        sort: [{ field: "position", direction: "ASC" }]
        columns: ["title", "assignees", "duedAt", "cf_sprint_789", "cf_points_101"]
        groupBy: "cf_status_123"
      }
    }
  ) {
    id
    uid
    name
    icon
    viewType
    isShared
    viewConfig
    createdBy {
      id
      fullName
    }
    updatedAt
  }
}
```

## Update View Position

Use the `updateSavedViewPosition` mutation to reorder a saved view in the sidebar:

```graphql
mutation UpdateSavedViewPosition {
  updateSavedViewPosition(
    id: "view_abc123"
    position: 131070.0
  ) {
    id
    name
    position
  }
}
```

## Set Workspace Default View

Use `setWorkspaceDefaultView` to set a shared view as the default for all workspace members. Only OWNER and ADMIN roles can perform this action. The selected view must be a shared view.

```graphql
mutation SetWorkspaceDefaultView {
  setWorkspaceDefaultView(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    viewId: "view_abc123"
  ) {
    id
    name
    defaultSavedView {
      id
      name
      viewType
    }
  }
}
```

To clear the workspace default view, omit the `viewId` parameter or pass `null`:

```graphql
mutation ClearWorkspaceDefaultView {
  setWorkspaceDefaultView(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    viewId: null
  ) {
    id
    name
    defaultSavedView {
      id
    }
  }
}
```

## Set User Default View

Use `setUserDefaultView` to set a personal default view for the current user in a workspace. Any workspace member can set their own default. The view can be personal or shared.

```graphql
mutation SetUserDefaultView {
  setUserDefaultView(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    viewId: "view_abc123"
  )
}
```

To clear the user default view, pass `null` for `viewId`:

```graphql
mutation ClearUserDefaultView {
  setUserDefaultView(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    viewId: null
  )
}
```

## Input Parameters

### EditSavedViewInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | ID of the saved view to update |
| `name` | String | No | Updated display name |
| `icon` | String | No | Updated icon identifier |
| `isShared` | Boolean | No | Updated sharing status |
| `viewConfig` | JSON | No | Updated view configuration (replaces entire config) |

### updateSavedViewPosition Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | ID of the saved view to reorder |
| `position` | Float! | Yes | New position value for ordering |

### setWorkspaceDefaultView Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace |
| `viewId` | String | No | ID of the shared view to set as default, or null to clear |

### setUserDefaultView Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace |
| `viewId` | String | No | ID of the view to set as personal default, or null to clear |

## Response Fields

### editSavedView / updateSavedViewPosition

Returns a `SavedView` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the saved view |
| `uid` | String! | User-friendly unique identifier |
| `name` | String! | Display name of the saved view |
| `icon` | String | Icon identifier |
| `position` | Float! | Sort position for ordering views |
| `isShared` | Boolean! | Whether the view is shared with all workspace members |
| `viewType` | SavedViewType! | View layout type (BOARD, DATABASE, CALENDAR, TIMELINE, MAP) |
| `viewConfig` | JSON! | Configuration object |
| `createdBy` | User! | The user who created the view |
| `project` | Project! | The workspace this view belongs to |
| `createdAt` | DateTime! | Timestamp when the view was created |
| `updatedAt` | DateTime! | Timestamp when the view was last updated |

### setWorkspaceDefaultView

Returns a `Project` object with the updated `defaultSavedView` field.

### setUserDefaultView

Returns `Boolean!` indicating success.

## Required Permissions

### editSavedView / updateSavedViewPosition

| Scenario | Who Can Edit |
|----------|-------------|
| Personal view (own) | Creator only |
| Shared view (own) | Creator, OWNER, or ADMIN |
| Shared view (other's) | OWNER or ADMIN only |
| Changing `isShared` to `true` | OWNER or ADMIN only |
| Changing `isShared` to `false` | Creator, OWNER, or ADMIN |

### setWorkspaceDefaultView

| Workspace Role | Can Set Workspace Default |
|----------------|--------------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |
| `COMMENT_ONLY` | No |
| `VIEW_ONLY` | No |

### setUserDefaultView

Any workspace member can set their own personal default view.

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
**When**: The user does not have permission to modify the view (e.g., editing another user's personal view, or a non-OWNER/ADMIN trying to change sharing status).

### Workspace Not Found (Default View)
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
**When**: The workspace does not exist or the user does not have the required role for `setWorkspaceDefaultView`.

## Important Notes

- **Partial Updates**: Only fields included in the `editSavedView` input are updated. Omitted fields remain unchanged.
- **View Config Replacement**: When updating `viewConfig`, the entire configuration object is replaced, not merged. Always send the complete config.
- **Sharing Permissions**: Converting a personal view to shared requires OWNER or ADMIN role. Converting a shared view back to personal can be done by the creator or by an OWNER/ADMIN.
- **Workspace Default Constraints**: Only shared views can be set as the workspace default. Personal views cannot be used as workspace defaults.
- **Position Values**: Position values use a spacing of 65535 for fractional ordering. To place a view between two others, use a value between their positions.
- **Real-time Updates**: Editing a saved view triggers a real-time subscription event so other connected clients are notified immediately.

### Related Endpoints
- **Create Saved View**: Use `createSavedView` mutation to create new views
- **List Saved Views**: Query `savedViews` to retrieve all views
- **Delete Saved View**: Use `deleteSavedView` mutation to remove views
