---
title: Create Dashboard
description: Create a new dashboard for data visualization and reporting in Blue
icon: Plus
---

## Create a Dashboard

The `createDashboard` mutation allows you to create a new dashboard within your organization or project. Dashboards are powerful visualization tools that help teams track metrics, monitor progress, and make data-driven decisions.

### Basic Example

```graphql
mutation CreateDashboard {
  createDashboard(
    input: {
      companyId: "comp_abc123"
      title: "Sales Performance Dashboard"
    }
  ) {
    id
    title
    createdBy {
      id
      email
      firstName
      lastName
    }
    createdAt
  }
}
```

### Project-Specific Dashboard

Create a dashboard associated with a specific project:

```graphql
mutation CreateProjectDashboard {
  createDashboard(
    input: {
      companyId: "comp_abc123"
      projectId: "proj_xyz789"
      title: "Q4 Project Metrics"
    }
  ) {
    id
    title
    project {
      id
      name
    }
    createdBy {
      id
      email
    }
    dashboardUsers {
      id
      user {
        id
        email
      }
      role
    }
    createdAt
  }
}
```

## Input Parameters

### CreateDashboardInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | String! | ✅ Yes | The ID of the organization where the dashboard will be created |
| `title` | String! | ✅ Yes | The name of the dashboard. Must be a non-empty string |
| `projectId` | String | No | Optional ID of a project to associate with this dashboard |

## Response Fields

The mutation returns a complete `Dashboard` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the created dashboard |
| `title` | String! | The dashboard title as provided |
| `companyId` | String! | The organization this dashboard belongs to |
| `projectId` | String | The associated project ID (if provided) |
| `project` | Project | The associated project object (if projectId was provided) |
| `createdBy` | User! | The user who created the dashboard (you) |
| `dashboardUsers` | [DashboardUser!]! | List of users with access (initially just the creator) |
| `createdAt` | DateTime! | Timestamp of when the dashboard was created |
| `updatedAt` | DateTime! | Timestamp of last modification (same as createdAt for new dashboards) |

### DashboardUser Fields

When a dashboard is created, the creator is automatically added as a dashboard user:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the dashboard user relationship |
| `user` | User! | The user object with access to the dashboard |
| `role` | DashboardRole! | The user's role (creator gets full access) |
| `dashboard` | Dashboard! | Reference back to the dashboard |

## Required Permissions

Any authenticated user who belongs to the specified organization can create dashboards. There are no special role requirements.

| User Status | Can Create Dashboard |
|-------------|-------------------|
| Organization Member | ✅ Yes |
| Non-Organization Member | ❌ No |
| Unauthenticated | ❌ No |

## Error Responses

### Invalid Organization
```json
{
  "errors": [{
    "message": "Organization not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### User Not in Organization
```json
{
  "errors": [{
    "message": "You don't have access to this organization",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Invalid Project
```json
{
  "errors": [{
    "message": "Project not found or doesn't belong to the specified organization",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Empty Title
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

- **Automatic ownership**: The user creating the dashboard automatically becomes its owner with full permissions
- **Project association**: If you provide a `projectId`, it must belong to the same organization
- **Initial permissions**: Only the creator has access initially. Use `editDashboard` to add more users
- **Title requirements**: Dashboard titles must be non-empty strings. There's no uniqueness requirement
- **Organization membership**: You must be a member of the organization to create dashboards in it

## Dashboard Creation Workflow

1. **Create the dashboard** using this mutation
2. **Configure charts and widgets** using the dashboard builder UI
3. **Add team members** using the `editDashboard` mutation with `dashboardUsers`
4. **Set up filters and date ranges** through the dashboard interface
5. **Share or embed** the dashboard using its unique ID

## Use Cases

1. **Executive dashboards**: Create high-level overviews of organization metrics
2. **Project tracking**: Build project-specific dashboards to monitor progress
3. **Team performance**: Track team productivity and achievement metrics
4. **Client reporting**: Create dashboards for client-facing reports
5. **Real-time monitoring**: Set up dashboards for live operational data

## Best Practices

1. **Naming conventions**: Use clear, descriptive titles that indicate the dashboard's purpose
2. **Project association**: Link dashboards to projects when they're project-specific
3. **Access management**: Add team members immediately after creation for collaboration
4. **Organization**: Create a dashboard hierarchy using consistent naming patterns

## Related Operations

- [List Dashboards](/api/dashboards/) - Retrieve all dashboards for an organization or project
- [Edit Dashboard](/api/dashboards/rename-dashboard) - Rename dashboard or manage users
- [Copy Dashboard](/api/dashboards/copy-dashboard) - Duplicate an existing dashboard
- [Delete Dashboard](/api/dashboards/delete-dashboard) - Remove a dashboard
