---
title: Workspaces API
description: Complete API reference for managing workspaces in Blue - create, update, delete, and query workspaces
icon: FolderKanban
---

## Overview

Workspaces are the core organizational unit in Blue. They contain lists, todos, custom fields, automations, and all other work-related data. Workspaces belong to organizations and have their own permission systems, templates, and configurations.

## Available Operations

### Core Workspace Operations

| Operation | Description | Link |
|-----------|-------------|------|
| **Create Workspace** | Create a new workspace or from template | [View Details →](/api/workspaces/create-workspace) |
| **List Workspaces** | Query and filter workspaces | [View Details →](/api/workspaces/list-workspaces) |
| **Delete Workspace** | Permanently delete a workspace | [View Details →](/api/workspaces/delete-workspace) |
| **Archive Workspace** | Archive/unarchive workspaces | [View Details →](/api/workspaces/archive-workspace) |
| **Rename Workspace** | Update workspace name and slug | [View Details →](/api/workspaces/rename-workspace) |
| **Copy Workspace** | Duplicate an existing workspace | [View Details →](/api/workspaces/copy-workspace) |

### Workspace Components

| Component | Description | Link |
|-----------|-------------|------|
| **Lists** | Manage todo lists within workspaces | [View Details →](/api/workspaces/lists) |
| **Templates** | Work with workspace templates | [View Details →](/api/workspaces/templates) |
| **Activity** | Track workspace activity and changes | [View Details →](/api/workspaces/workspace-activity) |

## Key Concepts

### Workspace Structure
- Workspaces belong to organizations
- Each workspace can have multiple lists
- Lists contain todos
- Workspaces support custom fields, tags, and automations

### Permissions Model
Workspaces have a multi-level permission system:

| Level | Permissions |
|-------|-------------|
| **OWNER** | Full control, can delete workspace |
| **ADMIN** | Manage workspace settings, users, and content |
| **MEMBER** | Create and edit content |
| **CLIENT** | Limited edit access |
| **VIEW_ONLY** | Read-only access |
| **COMMENT_ONLY** | Can only comment |

### Workspace Categories
Workspaces can be categorized for better organization:
- CRM
- CROSS_FUNCTIONAL
- CUSTOMER_SUCCESS
- DESIGN
- ENGINEERING
- GENERAL (default)
- HR
- IT
- MARKETING
- OPERATIONS
- PERSONAL
- PROCUREMENT
- PRODUCT
- SALES

## Common Patterns

### Creating a Basic Workspace
```graphql
mutation CreateProject {
  createProject(input: {
    name: "Q1 Marketing Campaign"
    companyId: "company-123"
    category: MARKETING
  }) {
    id
    name
    slug
  }
}
```

### Querying Workspaces with Filters
```graphql
query GetProjects {
  projectList(
    filter: {
      companyIds: ["company-123"]
      isArchived: false
      categories: [MARKETING, SALES]
    }
    sort: [{ field: updatedAt, direction: DESC }]
    take: 20
  ) {
    items {
      id
      name
      category
      todosCount
      todosDoneCount
    }
    pageInfo {
      hasNextPage
      total
    }
  }
}
```

> **Note**: The `projectList` query is the recommended approach for querying workspaces. A legacy `projects` query exists but should not be used for new implementations.

### Managing Workspace Lists
```graphql
# Get all lists in a project
query GetProjectLists {
  todoLists(projectId: "project-123") {
    id
    title
    position
    todosCount
  }
}

# Create a new list
mutation CreateList {
  createTodoList(input: {
    projectId: "project-123"
    title: "To Do"
    position: 1.0
  }) {
    id
    title
  }
}
```

## Best Practices

1. **Workspace Naming**
   - Use clear, descriptive names
   - Avoid special characters that might affect slugs
   - Keep names under 50 characters

2. **Permission Management**
   - Start with minimal permissions
   - Use CLIENT role for external stakeholders
   - Regularly audit workspace access

3. **Organization**
   - Use categories to group similar workspaces
   - Archive completed workspaces instead of deleting
   - Use templates for repetitive workspace types

4. **Performance**
   - Use pagination for large workspace lists
   - Filter by active/archived status
   - Limit the number of lists per workspace (max 50)

## Error Handling

Common errors you might encounter:

| Error Code | Description | Solution |
|------------|-------------|----------|
| `PROJECT_NOT_FOUND` | Workspace doesn't exist or no access | Verify workspace ID and permissions |
| `COMPANY_NOT_FOUND` | Organization doesn't exist | Check organization ID |
| `FORBIDDEN` | Insufficient permissions | Ensure proper role level |
| `BAD_USER_INPUT` | Validation error (e.g., name too long) | Check input validation requirements |


## Related Resources

- [Records API](/api/records) - Managing todos/records within workspaces
- [Custom Fields API](/api/custom-fields) - Adding custom fields to workspaces
- [Automations API](/api/automations) - Setting up workspace automations
- [Users API](/api/users) - Managing workspace users and permissions
