---
title: Tags
description: Create, manage, and use tags to categorize records using the Blue API.
icon: Tag
---

## Overview

Tags are a powerful way to categorize and organize records in Blue. The tag system provides comprehensive functionality for creating, managing, and filtering tags, with support for bulk operations and advanced filtering.

## List Tags

Retrieve tags from projects with flexible filtering and sorting options.

### Basic Example

```graphql
query ListTags {
  tagList(
    filter: { 
      projectIds: ["project-123"] 
      excludeArchivedProjects: false 
    }
    first: 50
    orderBy: title_ASC
  ) {
    items {
      id
      uid
      title
      color
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
    totalCount
  }
}
```

### Advanced Filtering Example

```graphql
query FilterTags {
  tagList(
    filter: {
      projectIds: ["project-123", "project-456"]
      search: "urgent"
      colors: ["#ff0000", "#ffaa00"]
      excludeArchivedProjects: true
    }
    orderBy: createdAt_DESC
    first: 20
  ) {
    items {
      id
      title
      color
      todos {
        id
        title
      }
    }
    totalCount
  }
}
```

## Create Tags

Create new tags within a project.

```graphql
mutation CreateTag {
  createTag(
    input: {
      title: "High Priority"
      color: "#ff0000"
    }
  ) {
    id
    uid
    title
    color
    project {
      id
      name
    }
    createdAt
  }
}
```

## Update Tags

Modify existing tag properties.

```graphql
mutation UpdateTag {
  editTag(
    input: {
      id: "tag-123"
      title: "Critical Priority"
      color: "#cc0000"
    }
  ) {
    id
    title
    color
    updatedAt
  }
}
```

## Delete Tags

Remove tags from the system. This will also remove the tag from all associated records.

```graphql
mutation DeleteTag {
  deleteTag(id: "tag-123")
}
```

## Tag Records

Associate tags with records (todos) using existing tags or create new ones.

### Using Existing Tags

```graphql
mutation TagRecord {
  setTodoTags(
    input: {
      todoId: "todo-123"
      tagIds: ["tag-456", "tag-789"]
    }
  )
}
```

### Create Tags While Tagging

You can create new tags on-the-fly by providing tag titles:

```graphql
mutation TagRecordWithNewTags {
  setTodoTags(
    input: {
      todoId: "todo-123"
      tagIds: ["existing-tag-id"]
      tagTitles: ["New Tag", "Another New Tag"]
    }
  )
}
```

## AI Tag Suggestions

Get AI-powered tag suggestions for a record:

```graphql
mutation GetTagSuggestions {
  aiTag(
    input: {
      todoId: "todo-123"
      suggestionsCount: 5
    }
  ) {
    suggestions {
      title
      confidence
      color
    }
  }
}
```

## Input Parameters

### TagListFilter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectIds` | [String!] | No | Filter tags by project IDs or slugs |
| `excludeArchivedProjects` | Boolean | No | Exclude tags from archived projects |
| `search` | String | No | Search tag titles (case-insensitive) |
| `titles` | [String!] | No | Filter by specific tag titles |
| `colors` | [String!] | No | Filter by specific colors (hex format) |
| `tagIds` | [String!] | No | Filter by specific tag IDs |

### CreateTagInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | String | No | Tag title (auto-generated if not provided) |
| `color` | String! | ✅ Yes | Tag color in hex format (e.g., "#ff0000") |

### EditTagInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | ID of the tag to update |
| `title` | String | No | New tag title |
| `color` | String | No | New tag color in hex format |

### SetTodoTagsInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to tag |
| `tagIds` | [String!] | No | IDs of existing tags to apply |
| `tagTitles` | [String!] | No | Titles of new tags to create and apply |

### TagOrderByInput Values

| Value | Description |
|-------|-------------|
| `id_ASC` / `id_DESC` | Sort by tag ID |
| `uid_ASC` / `uid_DESC` | Sort by unique identifier |
| `title_ASC` / `title_DESC` | Sort alphabetically by title |
| `color_ASC` / `color_DESC` | Sort by color value |
| `createdAt_ASC` / `createdAt_DESC` | Sort by creation date |
| `updatedAt_ASC` / `updatedAt_DESC` | Sort by last update date |

## Response Fields

### Tag Type

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the tag |
| `uid` | String! | User-friendly unique identifier |
| `title` | String! | Tag title/name |
| `color` | String! | Tag color in hex format |
| `project` | Project! | Project this tag belongs to |
| `todos` | [Todo!]! | Records associated with this tag |
| `createdAt` | DateTime! | When the tag was created |
| `updatedAt` | DateTime! | When the tag was last updated |

### TagPagination Response

| Field | Type | Description |
|-------|------|-------------|
| `items` | [Tag!]! | Array of tag records |
| `pageInfo` | PageInfo! | Pagination information |
| `totalCount` | Int! | Total number of tags matching filters |

### PageInfo Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | Int | Total number of pages |
| `totalItems` | Int | Total number of items across all pages |
| `page` | Int | Current page number |
| `perPage` | Int | Number of items per page |
| `hasNextPage` | Boolean! | Whether there's a next page |
| `hasPreviousPage` | Boolean! | Whether there's a previous page |

## Required Permissions

### Tag Management

| Action | Required Role |
|--------|--------------|
| Create tags | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` |
| Edit tags | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` |
| Delete tags | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` |
| Apply tags to records | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` |

### Tag Visibility

Tags are visible to all users who have access to the project where the tag was created. Role-based filtering may apply for certain operations.

## Error Responses

### Tag Not Found
```json
{
  "errors": [{
    "message": "Tag not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Invalid Color Format
```json
{
  "errors": [{
    "message": "Color must be in hex format (e.g., #ff0000)",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

### Permission Denied
```json
{
  "errors": [{
    "message": "You do not have permission to modify tags in this project",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Record Not Found
```json
{
  "errors": [{
    "message": "Todo not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

## Best Practices

1. **Use Consistent Colors**: Establish a color coding system for your team
2. **Descriptive Titles**: Use clear, descriptive tag names that team members will understand
3. **Batch Operations**: Use `setTodoTags` to apply multiple tags at once
4. **Search and Filter**: Use the search functionality to find existing tags before creating new ones
5. **Tag Management**: Regularly review and clean up unused tags
6. **Color Conventions**: Consider using standard colors for common tag types (red for urgent, green for completed, etc.)

## Advanced Features

### Tag Creation Defaults

- New tags created via `setTodoTags` with `tagTitles` default to color `#4a9fff`
- Tags without specified colors fall back to `#00a0d2`
- Tag titles are automatically trimmed of whitespace

### Automation Integration

Tags can be:
- Automatically applied by automation rules
- Used as triggers for automation workflows
- Modified through automation actions

### Real-time Updates

Tag changes are broadcast via GraphQL subscriptions, allowing real-time updates in connected clients.

## Important Notes

- Deleting a tag removes it from all associated records
- Tags are project-scoped and cannot be shared across projects
- Color values must be valid hex codes (e.g., "#ff0000", "#00aa00")
- Tag titles are case-sensitive
- Maximum 100 tags can be applied to a single record
- Tags support full-text search across titles
