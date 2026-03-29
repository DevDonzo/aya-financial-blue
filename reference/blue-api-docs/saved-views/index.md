---
title: Create a Saved View
description: Create saved views in Blue to store custom workspace layouts including board, database, calendar, timeline, and map configurations.
icon: Bookmark
---

## Create a Saved View

The `createSavedView` mutation allows you to create a new saved view in a workspace. Saved views store view type and configuration (filters, sorting, column visibility, etc.) so users can quickly switch between different layouts. Views can be personal (visible only to the creator) or shared (visible to all workspace members).

### Basic Example

Create a simple personal board view:

```graphql
mutation CreateSavedView {
  createSavedView(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
      name: "My Board View"
      viewType: BOARD
      viewConfig: {}
    }
  ) {
    id
    uid
    name
    viewType
    isShared
    position
    createdAt
  }
}
```

### Advanced Example

Create a shared database view with a full configuration including filters, sorting, and column settings:

```graphql
mutation CreateSavedViewAdvanced {
  createSavedView(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
      name: "Sprint Planning"
      icon: "layout-grid"
      isShared: true
      viewType: DATABASE
      viewConfig: {
        filters: {
          op: "AND"
          fields: [
            {
              type: "CUSTOM_FIELD"
              customFieldId: "cf_status_123"
              customFieldType: "SELECT_SINGLE"
              values: ["In Progress", "To Do"]
              op: "IN"
            }
          ]
        }
        sort: [{ field: "duedAt", direction: "ASC" }]
        columns: ["title", "assignees", "duedAt", "cf_status_123", "cf_priority_456"]
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
    position
    viewConfig
    createdBy {
      id
      fullName
    }
    project {
      id
      name
    }
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### CreateSavedViewInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace to create the view in |
| `name` | String! | Yes | Display name for the saved view |
| `icon` | String | No | Icon identifier for the saved view |
| `isShared` | Boolean | No | Whether the view is shared with all workspace members (default: false) |
| `viewType` | SavedViewType! | Yes | The type of view layout |
| `viewConfig` | JSON! | Yes | Configuration object containing filters, sorting, columns, and other view settings |

### SavedViewType Values

| Value | Description |
|-------|-------------|
| `BOARD` | Kanban-style board layout |
| `DATABASE` | Table/spreadsheet layout |
| `CALENDAR` | Calendar view layout |
| `TIMELINE` | Gantt-style timeline layout |
| `MAP` | Geographic map layout |

## Response Fields

The mutation returns a `SavedView` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the saved view |
| `uid` | String! | User-friendly unique identifier |
| `name` | String! | Display name of the saved view |
| `icon` | String | Icon identifier |
| `position` | Float! | Sort position for ordering views in the sidebar |
| `isShared` | Boolean! | Whether the view is shared with all workspace members |
| `viewType` | SavedViewType! | The type of view layout (BOARD, DATABASE, CALENDAR, TIMELINE, MAP) |
| `viewConfig` | JSON! | Configuration object with filters, sorting, columns, and other settings |
| `createdBy` | User! | The user who created the view |
| `project` | Project! | The workspace this view belongs to |
| `createdAt` | DateTime! | Timestamp when the view was created |
| `updatedAt` | DateTime! | Timestamp when the view was last updated |

## Required Permissions

| Workspace Role | Can Create Personal Views | Can Create Shared Views |
|----------------|--------------------------|------------------------|
| `OWNER` | Yes | Yes |
| `ADMIN` | Yes | Yes |
| `MEMBER` | Yes | No |
| `CLIENT` | Yes | No |
| `COMMENT_ONLY` | Yes | No |
| `VIEW_ONLY` | Yes | No |

All workspace members can create personal views. Only users with `OWNER` or `ADMIN` roles can create shared views (`isShared: true`).

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
**When**: The specified `projectId` does not exist, or the user is not a member of the workspace.

### Unauthorized (Shared View)
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
**When**: A non-OWNER/ADMIN user attempts to create a shared view (`isShared: true`).

## Important Notes

- **Position**: New views are automatically assigned the next available position value (incremented by 65535 from the last view). Use `updateSavedViewPosition` to reorder views after creation.
- **Personal vs. Shared**: Personal views are only visible to the creator. Shared views are visible to all workspace members. Only OWNER and ADMIN roles can create shared views.
- **View Config**: The `viewConfig` field accepts any valid JSON object. The structure depends on your application's view rendering needs (filters, sorting, column visibility, grouping, etc.).
- **Real-time Updates**: Creating a saved view triggers a real-time subscription event (`subscribeToSavedView`) so other connected clients are notified immediately.

### Related Endpoints
- **List Saved Views**: Query `savedViews` to retrieve all views in a workspace
- **Edit Saved View**: Use `editSavedView` mutation to update view name, config, or sharing
- **Delete Saved View**: Use `deleteSavedView` mutation to remove a view
- **Set Workspace Default View**: Use `setWorkspaceDefaultView` to set a shared view as the workspace default
- **Set User Default View**: Use `setUserDefaultView` to set a personal default view
