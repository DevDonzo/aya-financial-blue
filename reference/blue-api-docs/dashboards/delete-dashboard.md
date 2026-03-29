---
title: Delete Dashboard
description: Permanently delete a dashboard and all its associated charts and data
category: Dashboards
icon: Trash2
---

## Delete Dashboard

Permanently delete a dashboard that you created. This operation cannot be undone and will remove all charts, chart segments, and dashboard sharing configurations.

## Basic Example

```graphql
mutation DeleteDashboard {
  deleteDashboard(id: "dashboard_123") {
    success
    message
  }
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | Unique identifier of the dashboard to delete |

## Response Fields

### MutationResult

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Whether the deletion was successful |
| `message` | String | Status message about the operation |

## Required Permissions

### Creator Only
- **Only the dashboard creator** can delete a dashboard
- Users with EDITOR access cannot delete dashboards
- Company administrators cannot delete dashboards created by others

### Authentication
- Must be authenticated and have access to the dashboard's company

## What Gets Deleted

When you delete a dashboard, the following data is permanently removed:

### Dashboard Data
- Dashboard title and metadata
- Creation and modification timestamps
- Dashboard user sharing configurations

### Chart Data
- All charts within the dashboard
- Chart segments and their configurations
- Chart segment values and calculations
- Chart display settings and formatting

### Related Data
- Dashboard user role assignments
- Any dashboard subscriptions or real-time connections

## Error Responses

### Dashboard Not Found
```json
{
  "errors": [{
    "message": "Dashboard not found",
    "extensions": {
      "code": "DASHBOARD_NOT_FOUND"
    }
  }]
}
```

### Permission Denied
```json
{
  "errors": [{
    "message": "Only the creator of a dashboard can delete it",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Authentication Required
```json
{
  "errors": [{
    "message": "You must be authenticated to perform this action",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```

## Important Considerations

### Permanent Action
- **Cannot be undone**: Once deleted, the dashboard and all its data cannot be recovered
- **No soft delete**: The dashboard is permanently removed from the database
- **Immediate effect**: The deletion takes place immediately

### Impact on Other Users
- **Shared users lose access**: Users who had VIEWER or EDITOR access will no longer be able to access the dashboard
- **Active sessions**: Users currently viewing the dashboard will lose connection
- **Subscriptions**: Any real-time subscriptions to the dashboard will be terminated

### Data Dependencies
- **No external dependencies**: Deleting a dashboard does not affect projects, todos, or other company data
- **Self-contained**: Only dashboard-specific data is removed

## Best Practices

### Before Deletion
- **Export important data**: Save any critical chart configurations or insights
- **Notify shared users**: Inform team members who have access to the dashboard
- **Consider copying**: Use the copy dashboard feature to create a backup if needed
- **Document insights**: Save any important business insights or findings

### Alternative Actions
- **Remove sharing**: Consider removing dashboard users instead of deleting
- **Archive approach**: There is no built-in archive feature, but you could rename the dashboard to indicate it's archived

## Common Use Cases

### Cleanup Unused Dashboards
```graphql
# First, list dashboards to identify unused ones
query FindUnusedDashboards {
  dashboards(filter: { companyId: "company_123" }) {
    items {
      id
      title
      updatedAt
      dashboardUsers {
        id
      }
    }
  }
}

# Then delete specific dashboard
mutation CleanupDashboard {
  deleteDashboard(id: "old_dashboard_id") {
    success
    message
  }
}
```

### Remove Test Dashboards
```graphql
mutation RemoveTestDashboard {
  deleteDashboard(id: "test_dashboard_123") {
    success
    message
  }
}
```

## Security Notes

### Creator Verification
- The system verifies that the requesting user is the original creator
- User ID is checked against the dashboard's `createdById` field
- No role-based overrides are allowed (even company owners cannot delete others' dashboards)

### Audit Trail
- Dashboard deletion events are logged for audit purposes
- Deletion timestamp and requesting user are recorded
- Company administrators can view deletion logs

## Related Operations

- [List Dashboards](/api/dashboards/1.index) - View available dashboards
- [Copy Dashboard](/api/dashboards/2.copy-dashboard) - Create backup before deletion
- [Create Dashboard](/api/dashboards/create-dashboard) - Create new dashboard (documentation pending)
- [Edit Dashboard](/api/dashboards/edit-dashboard) - Modify dashboard instead of deleting (documentation pending)
