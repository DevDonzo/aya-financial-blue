---
title: Rename Dashboard
description: Update the title of an existing dashboard using the Blue API
icon: FileEdit
---

## Rename a Dashboard

The `editDashboard` mutation allows you to rename a dashboard by updating its title. Only the dashboard creator has permission to rename a dashboard.

### Basic Example

```graphql
mutation RenameDashboard {
  editDashboard(
    input: {
      id: "dash_abc123"
      title: "Q4 Sales Dashboard"
    }
  ) {
    id
    title
    updatedAt
  }
}
```

### Advanced Example with User Management

The `editDashboard` mutation can also update dashboard users while renaming:

```graphql
mutation RenameAndUpdateUsers {
  editDashboard(
    input: {
      id: "dash_abc123"
      title: "Updated Sales Dashboard"
      dashboardUsers: [
        {
          userId: "user_123"
          role: EDITOR
        }
        {
          userId: "user_456"
          role: VIEWER
        }
      ]
    }
  ) {
    id
    title
    dashboardUsers {
      id
      user {
        id
        email
        firstName
        lastName
      }
      role
    }
    updatedAt
  }
}
```

## Input Parameters

### EditDashboardInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | The unique identifier of the dashboard to rename |
| `title` | String | No | The new title for the dashboard. If not provided, title remains unchanged |
| `dashboardUsers` | [EditDashboardUserInput!] | No | Optional array to update dashboard user permissions |

### EditDashboardUserInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | String! | ✅ Yes | The ID of the user to add or update |
| `role` | DashboardRole! | ✅ Yes | The role to assign to the user |

### DashboardRole Values

| Value | Description |
|-------|-------------|
| `EDITOR` | Can view and edit dashboard content (charts, filters, layout) |
| `VIEWER` | Can only view the dashboard |

## Response Fields

The mutation returns a complete `Dashboard` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique dashboard identifier |
| `title` | String! | The updated dashboard title |
| `createdBy` | User! | The user who created the dashboard |
| `dashboardUsers` | [DashboardUser!]! | List of users with access to the dashboard |
| `createdAt` | DateTime! | When the dashboard was created |
| `updatedAt` | DateTime! | When the dashboard was last modified |

## Required Permissions

Only the **dashboard creator** can rename a dashboard. Other users with EDITOR or VIEWER roles cannot change the dashboard title.

| User Type | Can Rename Dashboard |
|-----------|-------------------|
| Dashboard Creator | ✅ Yes |
| Dashboard Editor | ❌ No |
| Dashboard Viewer | ❌ No |
| Other Company Users | ❌ No |

## Error Responses

### Dashboard Not Found
```json
{
  "errors": [{
    "message": "Dashboard not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to edit this dashboard",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Validation Error
```json
{
  "errors": [{
    "message": "Dashboard title cannot be empty",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Important Notes

- **No separate rename mutation**: There is no `renameDashboard` mutation. Renaming is handled through the `editDashboard` mutation
- **Creator-only permission**: Only the dashboard creator can rename it, even if other users have EDITOR role
- **Title validation**: Dashboard titles must be non-empty strings
- **Atomic operation**: When updating both title and users, either all changes succeed or none are applied
- **User management**: You can add, update, or remove dashboard users in the same operation as renaming

## Use Cases

1. **Rebranding dashboards**: Update dashboard names to reflect new company terminology or branding
2. **Seasonal updates**: Rename dashboards to reflect current time periods (e.g., "Q3 2024 Sales" → "Q4 2024 Sales")
3. **Project evolution**: Update dashboard titles as projects change scope or focus
4. **Clarity improvements**: Rename dashboards to be more descriptive or follow naming conventions

## Related Operations

- [List Dashboards](/api/dashboards/) - Retrieve all dashboards for a company or project
- [Create Dashboard](/api/dashboards/create-dashboard) - Create a new dashboard
- [Delete Dashboard](/api/dashboards/delete-dashboard) - Remove a dashboard
- [Copy Dashboard](/api/dashboards/copy-dashboard) - Duplicate an existing dashboard
