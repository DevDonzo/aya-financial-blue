---
title: List all Workspaces
description: Workspaces in Blue form the fundamental framework for organizing users and data.
icon: List
---

## List all Workspaces

The `projectList` query allows you to retrieve workspaces with powerful filtering, sorting, and pagination options.

### Basic Example

```graphql
query ProjectListQuery {
  projectList(filter: { companyIds: ["ENTER COMPANY ID"] }) {
    items {
      id
      uid
      slug
      name
      description
      archived
      color
      icon
      createdAt
      updatedAt
      allowNotification
      position
      unseenActivityCount
      todoListsMaxPosition
      lastAccessedAt
      isTemplate
      automationsCount
      totalFileCount
      totalFileSize
      todoAlias
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

### Advanced Example with Filtering and Sorting

```graphql
query FilteredProjectList {
  projectList(
    filter: {
      companyIds: ["company-123", "company-456"]
      archived: false
      isTemplate: false
      search: "marketing"
      inProject: true
      folderId: null  # Get root-level projects only
    }
    sort: [position_ASC, name_ASC]
    skip: 0
    take: 50
  ) {
    items {
      id
      name
      slug
      position
      archived
    }
    totalCount
    pageInfo {
      totalItems
      hasNextPage
    }
  }
}
```

## Workspace Fields

The following table describes all available fields for each workspace in the `ProjectListQuery`:

| Field | Type | Description |
|-------|------|-------------|
| id | ID! | Unique identifier for the workspace |
| uid | String! | User-friendly unique identifier for the workspace |
| slug | String! | URL-friendly name of the workspace |
| name | String! | Display name of the workspace |
| description | String | Brief description of the workspace |
| archived | Boolean | Boolean indicating if the workspace is archived |
| color | String | Color associated with the workspace for visual identification |
| icon | String | Icon associated with the workspace for visual identification |
| image | Image | Workspace cover image object |
| createdAt | DateTime! | Timestamp when the workspace was created |
| updatedAt | DateTime! | Timestamp when the workspace was last updated |
| allowNotification | Boolean! | Boolean indicating if notifications are enabled for the workspace |
| position | Float! | Numeric value representing the workspace's position in a list |
| unseenActivityCount | Int! | Number of unseen activities in the workspace |
| todoListsMaxPosition | Float! | Maximum position value for todo lists in the workspace |
| lastAccessedAt | DateTime | Timestamp when the workspace was last accessed |
| isTemplate | Boolean! | Boolean indicating if the workspace is a template |
| isOfficialTemplate | Boolean! | Boolean indicating if this is an official Blue template |
| automationsCount(isActive: Boolean) | Int! | Number of automations associated with the workspace |
| totalFileCount | Int | Total number of files in the workspace |
| totalFileSize | Float | Total size of all files in the workspace (in bytes) |
| todoAlias | String | Custom alias for "todo" used in the workspace |
| category | ProjectCategory! | Workspace category (CRM, MARKETING, etc.) |
| hideEmailFromRoles | [UserAccessLevel!] | Array of roles that should hide email addresses |
| hideStatusUpdate | Boolean | Boolean for hiding status updates |
| company | Company! | Full organization object details |
| accessLevel(userId: String) | UserAccessLevel | Get user's access level for the specific workspace |
| folder | Folder | Folder containing this workspace |
| features | [ProjectFeature!] | Array of enabled workspace features |
| sequenceCustomField | CustomField | Custom field used for sequence numbering |
| coverConfig | TodoCoverConfig | Configuration for todo cover images |
| hideRecordCount | Boolean | Whether to hide record counts |
| showTimeSpentInTodoList | Boolean | Whether to show time spent in todo lists |
| showTimeSpentInProject | Boolean | Whether to show time spent in workspace |
| todoFields | [TodoField] | Custom todo field definitions |

Note: You can request any combination of these fields in your GraphQL query.

## Pagination Fields

The `pageInfo` object provides pagination details for the query results:

| Field | Type | Description |
|-------|------|-------------|
| totalPages | Int | Total number of pages of results |
| totalItems | Int | Total number of workspaces matching the query |
| page | Int | Current page number |
| perPage | Int | Number of items per page |
| hasNextPage | Boolean! | Boolean indicating if there's a next page of results |
| hasPreviousPage | Boolean! | Boolean indicating if there's a previous page of results |

## Query Parameters

### Filter Options (ProjectListFilter)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyIds` | [String!]! | ✅ Yes | Array of organization IDs or slugs to search within |
| `ids` | [String!] | No | Filter by specific workspace IDs |
| `archived` | Boolean | No | Filter by archived status (true/false) |
| `isTemplate` | Boolean | No | Filter template workspaces (true/false) |
| `search` | String | No | Search workspaces by name (case-insensitive) |
| `folderId` | String | No | Filter by folder ID. Use `null` for root-level workspaces |
| `inProject` | Boolean | No | Filter by user membership. See note below |

**Note on `inProject` filter:**
- `true` or `undefined`: Returns workspaces the user is a member of
- `false`: Returns workspaces the user is NOT in (requires organization owner permission)
- Folder filtering (`folderId`) only works when `inProject` is not `false`

### Sorting Options (ProjectSort)

| Value | Description |
|-------|-------------|
| `id_ASC` | Sort by ID ascending |
| `id_DESC` | Sort by ID descending |
| `name_ASC` | Sort by name ascending (A-Z) |
| `name_DESC` | Sort by name descending (Z-A) |
| `createdAt_ASC` | Sort by creation date (oldest first) |
| `createdAt_DESC` | Sort by creation date (newest first) |
| `updatedAt_ASC` | Sort by last update (oldest first) |
| `updatedAt_DESC` | Sort by last update (newest first) |
| `position_ASC` | Sort by position ascending* |
| `position_DESC` | Sort by position descending* |

*Position sorting is only available when viewing workspaces the user is a member of (`inProject !== false`)

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Int | 0 | Number of records to skip |
| `take` | Int | 20 | Number of records to return |

### Important Notes

1. **Default behavior for non-member workspaces** (`inProject: false`):
   - Excludes archived workspaces unless `archived` filter is explicitly set
   - Excludes template workspaces unless `isTemplate` filter is explicitly set

2. **Folder filtering limitations**:
   - Only works when showing user's workspaces
   - Cannot be used with `inProject: false`
   - Use `folderId: null` to get workspaces not in any folder

3. **Sorting fallback**:
   - Position sorting is ignored when viewing non-member workspaces
   - Falls back to name sorting in such cases

4. **Deprecated parameters**:
   - `orderBy`, `after`, `before`, `first`, `last` are deprecated
   - Use `sort`, `skip`, and `take` instead
