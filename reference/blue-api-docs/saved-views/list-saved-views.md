---
title: List Saved Views
description: Query and retrieve saved views in a Blue workspace with pagination support.
icon: List
---

## List Saved Views

The `savedViews` query retrieves all saved views that the current user can access in a workspace. This includes the user's own personal views and all shared views created by any workspace member. Results are ordered by position descending.

### Basic Example

List all saved views in a workspace:

```graphql
query ListSavedViews {
  savedViews(
    filter: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  ) {
    items {
      id
      name
      viewType
      isShared
      position
    }
    pageInfo {
      totalItems
      hasNextPage
    }
  }
}
```

### Advanced Example

Retrieve saved views with full details, pagination, and nested relationships:

```graphql
query ListSavedViewsAdvanced {
  savedViews(
    filter: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
    skip: 0
    take: 50
  ) {
    items {
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
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Get a Single Saved View

To retrieve a specific saved view by ID, use the `savedView` query:

```graphql
query GetSavedView {
  savedView(id: "view_abc123") {
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
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### SavedViewFilterInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace to list views from |

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Int | 0 | Number of records to skip |
| `take` | Int | 100 | Number of records to return |

### Single View Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | Unique identifier of the saved view to retrieve |

## Response Fields

### SavedViewPagination

| Field | Type | Description |
|-------|------|-------------|
| `items` | [SavedView!]! | Array of saved view objects |
| `pageInfo` | PageInfo! | Pagination metadata |

### SavedView

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the saved view |
| `uid` | String! | User-friendly unique identifier |
| `name` | String! | Display name of the saved view |
| `icon` | String | Icon identifier |
| `position` | Float! | Sort position for ordering views |
| `isShared` | Boolean! | Whether the view is visible to all workspace members |
| `viewType` | SavedViewType! | View layout type (BOARD, DATABASE, CALENDAR, TIMELINE, MAP) |
| `viewConfig` | JSON! | Configuration object with filters, sorting, columns, and other settings |
| `createdBy` | User! | The user who created the view |
| `project` | Project! | The workspace this view belongs to |
| `createdAt` | DateTime! | Timestamp when the view was created |
| `updatedAt` | DateTime! | Timestamp when the view was last updated |

### PageInfo

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | Int | Total number of pages available |
| `totalItems` | Int | Total count of views matching the filter |
| `page` | Int | Current page number |
| `perPage` | Int | Number of items per page |
| `hasNextPage` | Boolean! | Whether there is a next page |
| `hasPreviousPage` | Boolean! | Whether there is a previous page |

## Required Permissions

| Workspace Role | Can List Views |
|----------------|---------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | Yes |
| `CLIENT` | Yes |
| `COMMENT_ONLY` | Yes |
| `VIEW_ONLY` | Yes |

Any workspace member can query saved views. Users will see their own personal views plus all shared views in the workspace.

## Error Responses

### Saved View Not Found (Single View Query)
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
**When**: The specified view ID does not exist, the user is not a member of the workspace, or the view is a personal view owned by another user.

## Important Notes

- **Visibility Rules**: Users see their own personal views and all shared views. Personal views created by other users are never returned.
- **Ordering**: Results are returned ordered by `position` descending by default.
- **Default Pagination**: If `take` is not specified, up to 100 views are returned per request.
- **Workspace Default View**: To check which view is the workspace default, query the `defaultSavedView` field on the Project type. To check the current user's personal default, query the `userDefaultSavedView` field.

### Related Endpoints
- **Create Saved View**: Use `createSavedView` mutation to create new views
- **Edit Saved View**: Use `editSavedView` mutation to update views
- **Delete Saved View**: Use `deleteSavedView` mutation to remove views
