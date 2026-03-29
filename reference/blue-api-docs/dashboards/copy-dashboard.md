---
title: Copy Dashboard
description: Create a complete copy of an existing dashboard including all charts, segments, and permissions
category: Dashboards
icon: Copy
---

The `copyDashboard` mutation creates a complete copy of an existing dashboard, including all charts, chart segments, values, and user permissions. This operation performs a deep copy with new unique identifiers for all copied elements.

## Basic Example

Create a copy of a dashboard with a custom title:

```graphql
mutation CopyDashboard {
  copyDashboard(input: {
    dashboardId: "dashboard_123"
    title: "Q4 Sales Dashboard Copy"
  }) {
    id
    title
    createdAt
    charts {
      id
      title
      chartType
    }
    dashboardUsers {
      id
      role
      user {
        id
        email
      }
    }
  }
}
```

## Advanced Example

Copy a dashboard without specifying a title (automatically appends "(Copy)"):

```graphql
mutation CopyDashboardAuto {
  copyDashboard(input: {
    dashboardId: "dashboard_456"
  }) {
    id
    uid
    title
    createdBy {
      id
      email
    }
    company {
      id
      name
    }
    charts {
      id
      title
      chartType
      position
      chartSegments {
        id
        title
        formula
        chartValues {
          id
          value
        }
      }
    }
    dashboardUsers {
      id
      role
      user {
        id
        email
        fullName
      }
    }
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### CopyDashboardInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dashboardId` | String! | ✅ Yes | ID of the dashboard to copy |
| `title` | String | No | Custom title for the copied dashboard. If not provided, appends "(Copy)" to the original title |

## Response Fields

### Dashboard Response

The mutation returns a complete `Dashboard` object with all copied data:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the new dashboard |
| `uid` | String! | Unique identifier used for URL routing |
| `title` | String! | Title of the copied dashboard |
| `createdBy` | User! | The user who performed the copy operation |
| `company` | Company! | The company the dashboard belongs to (same as original) |
| `project` | Project | Project association (same as original, if any) |
| `charts` | [Chart!]! | All charts copied from the original dashboard |
| `dashboardUsers` | [DashboardUser!]! | User permissions copied from original (excluding copying user) |
| `createdAt` | DateTime! | When the copy was created |
| `updatedAt` | DateTime! | When the copy was last modified |

## Dashboard Copying Behavior

### Deep Copy Process

The `copyDashboard` operation performs a complete deep copy including:

1. **Dashboard Metadata**
   - Creates new dashboard with new ID and UID
   - Copies title (or appends "(Copy)" if no custom title)
   - Sets creator to the user performing the copy
   - Maintains company and project associations

2. **Charts and Structure**
   - Copies all charts with new IDs and UIDs
   - Preserves chart types, titles, and positions
   - Maintains chart configuration and metadata

3. **Chart Segments and Values**
   - Copies all chart segments with new IDs and UIDs
   - Preserves segment titles, formulas, and configurations
   - Copies all chart values and their data

4. **Formula References**
   - Updates formula references to use new UIDs
   - Maintains formula logic and calculations
   - Ensures copied formulas reference copied data

5. **User Permissions**
   - Copies all dashboard user permissions from original
   - Excludes the copying user (they become the creator)
   - Preserves VIEWER and EDITOR role assignments

### Post-Copy Operations

After creating the copy, the system automatically:
- Publishes dashboard creation events for real-time updates
- Triggers chart result recalculation for all copied charts
- Updates any dependent systems or integrations

## Required Permissions

Dashboard copying requires specific permissions:

| Role | Can Copy Dashboard |
|------|-------------------|
| Dashboard Creator | ✅ Yes |
| Dashboard EDITOR | ✅ Yes |
| Dashboard VIEWER | ❌ No |
| Non-dashboard User | ❌ No |

**Permission Check**: The user must have EDITOR access to the original dashboard through either:
- Being the original dashboard creator
- Having an explicit EDITOR role assignment on the dashboard

## Error Responses

### Dashboard Not Found

```json
{
  "errors": [{
    "message": "Dashboard was not found.",
    "extensions": {
      "code": "DASHBOARD_NOT_FOUND"
    }
  }]
}
```

### Insufficient Permissions

```json
{
  "errors": [{
    "message": "You don't have permission to access this dashboard",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Invalid Input

```json
{
  "errors": [{
    "message": "Dashboard ID is required",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Use Cases

### 1. Template Dashboards
Create template dashboards that can be copied for new projects or teams:

```graphql
mutation CreateProjectDashboard {
  copyDashboard(input: {
    dashboardId: "template_dashboard_id"
    title: "Project Alpha - Sales Dashboard"
  }) {
    id
    title
  }
}
```

### 2. Backup and Versioning
Create backups before making significant changes:

```graphql
mutation BackupDashboard {
  copyDashboard(input: {
    dashboardId: "production_dashboard"
    title: "Production Dashboard - Backup 2024-01-15"
  }) {
    id
    title
    createdAt
  }
}
```

### 3. Cross-Team Sharing
Copy dashboards between teams while maintaining data structure:

```graphql
mutation ShareDashboardWithTeam {
  copyDashboard(input: {
    dashboardId: "marketing_dashboard"
    title: "Marketing Dashboard - Sales Team Copy"
  }) {
    id
    title
    dashboardUsers {
      role
      user {
        email
      }
    }
  }
}
```

## Best Practices

### Naming Conventions
- Use descriptive titles that indicate the copy's purpose
- Include team names, dates, or version numbers for clarity
- Avoid generic names like "Copy" or "New Dashboard"

### Permission Management
- Review copied dashboard permissions after creation
- Add or remove users as needed for the specific use case
- Consider whether viewers need to become editors on the copy

### Data Integrity
- Verify that formulas and calculations work correctly after copying
- Check that chart data sources are appropriate for the new context
- Test any automated reports or integrations

## Performance Considerations

- Copying large dashboards with many charts may take several seconds
- Chart recalculation happens asynchronously after the copy
- Consider copying during off-peak hours for very large dashboards
- Monitor system resources when copying multiple dashboards simultaneously

## Limitations

- Cannot copy dashboards across different companies
- Formula references are limited to data within the same company
- Some external integrations may need reconfiguration
- Custom permissions or roles may need manual adjustment
- Historical data and analytics are not preserved in the copy

## Related Resources

- [Dashboard Overview](/api/9.dashboards/1.index) - General dashboard concepts
- [Rename Dashboard](/api/9.dashboards/3.rename-dashboard) - Change dashboard titles
- [Dashboard Users](/api/dashboard-users) - Manage dashboard permissions
- [Charts API](/api/charts) - Work with individual charts
