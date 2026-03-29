---
title: User Management API
description: Complete API reference for managing users, invitations, roles, and permissions in Blue workspaces and organizations
icon: Users
---

## Overview

The User Management API provides comprehensive tools for managing team members, controlling access permissions, and organizing your workforce across Blue workspaces and organizations. Whether you're adding new team members, managing existing users, or defining custom permission structures, these APIs handle all aspects of user lifecycle management.

User management in Blue operates at two levels:
- **Workspace-level**: Manage users within specific workspaces with workspace-specific permissions
- **Organization-level**: Manage users across your entire organization with organization-wide access

## Available Operations

### Core User Management

| Operation | Description | Link |
|-----------|-------------|------|
| **Invite User** | Send invitations to new users with specific access levels | [View Details →](/api/user-management/invite-user) |
| **List Users** | Query and filter users in workspaces or organizations | [View Details →](/api/user-management/list-users) |
| **Remove User** | Remove users from workspaces or organizations | [View Details →](/api/user-management/remove-user) |

### Role and Permission Management

| Operation | Description | Link |
|-----------|-------------|------|
| **Custom Roles** | Create and manage custom roles with granular permissions | [View Details →](/api/user-management/retrieve-custom-role) |

## Access Levels

Blue provides a hierarchical permission system with predefined access levels:

### Standard Access Levels

| Level | Description | Capabilities |
|-------|-------------|--------------|
| **OWNER** | Full control over workspace/organization | All permissions, can transfer ownership |
| **ADMIN** | Administrative access | User management, settings, billing |
| **MEMBER** | Standard team member | Full workspace functionality, limited admin access |
| **CLIENT** | External client access | Limited workspace visibility, focused on deliverables |
| **COMMENT_ONLY** | Comment-only access | Can view and comment, cannot edit |
| **VIEW_ONLY** | Read-only access | Can view content only |

### Permission Hierarchy

Users can only invite or manage users at their level or below:
- **OWNERS** can manage all access levels
- **ADMINS** can manage ADMIN, MEMBER, CLIENT, COMMENT_ONLY, VIEW_ONLY
- **MEMBERS** can manage MEMBER, CLIENT, COMMENT_ONLY, VIEW_ONLY
- **CLIENTS** can only manage other CLIENTS

## Key Concepts

### User Invitations
- **Email-based**: Users are invited via email address
- **Role assignment**: Set access level and optional custom role during invitation
- **Multi-workspace**: Single invitation can grant access to multiple workspaces
- **Expiration**: Invitations expire after 7 days
- **Automatic notifications**: Blue sends email invitations automatically

### Workspace vs Organization Access
- **Workspace invitation**: Grants access to specific workspace only
- **Organization invitation**: Grants organization-level access, optionally including specific workspaces
- **Organization owners**: Automatically get ADMIN access to all organization workspaces
- **Scope restrictions**: Cannot combine workspace and organization invitation parameters

### Custom Roles
- **Granular permissions**: Define specific capabilities beyond standard access levels
- **Workspace-specific**: Custom roles are scoped to individual workspaces
- **Field-level control**: Control access to specific custom fields
- **Action restrictions**: Limit specific actions (create, edit, delete, etc.)

## Common Patterns

### Inviting a New Team Member
```graphql
mutation InviteTeamMember {
  inviteUser(input: {
    email: "john.doe@company.com"
    projectId: "web-redesign"
    accessLevel: MEMBER
  })
}
```

### Creating an Organization-Wide Invitation
```graphql
mutation InviteToCompany {
  inviteUser(input: {
    email: "manager@company.com"
    companyId: "company_123"
    projectIds: ["project_1", "project_2", "project_3"]
    accessLevel: ADMIN
  })
}
```

### Listing Workspace Users
```graphql
query ProjectUsers {
  projectUsers(projectId: "web-redesign") {
    id
    user {
      name
      email
      avatar
    }
    accessLevel
    role {
      name
      permissions
    }
    invitedAt
    joinedAt
  }
}
```

### Removing a User
```graphql
mutation RemoveProjectUser {
  removeUser(input: {
    userId: "user_456"
    projectId: "web-redesign"
  })
}
```

### Creating a Custom Role
```graphql
mutation CreateCustomRole {
  createProjectUserRole(input: {
    projectId: "web-redesign"
    name: "Content Reviewer"
    permissions: {
      canCreateRecords: false
      canEditOwnRecords: true
      canEditAllRecords: false
      canDeleteRecords: false
      canManageUsers: false
      canViewReports: true
    }
  }) {
    id
    name
    permissions
  }
}
```

## Permission Management

### Standard Permissions Matrix

| Action | OWNER | ADMIN | MEMBER | CLIENT | COMMENT_ONLY | VIEW_ONLY |
|--------|-------|-------|--------|--------|-------------|-----------|
| **Invite Users** | ✅ All levels | ✅ ADMIN and below | ✅ MEMBER and below | ✅ CLIENT only | ❌ No | ❌ No |
| **Remove Users** | ✅ All users | ✅ ADMIN and below | ✅ MEMBER and below | ✅ CLIENT only | ❌ No | ❌ No |
| **Modify Workspace Settings** | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **Create Records** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Limited | ❌ No | ❌ No |
| **Edit All Records** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Delete Records** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **View Reports** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Limited | ❌ No | ❌ No |

### Custom Role Capabilities
- **Field-level permissions**: Control access to specific custom fields
- **Action-specific rules**: Allow/deny specific operations (create, edit, delete)
- **View restrictions**: Limit which records users can see
- **Feature toggles**: Enable/disable specific features per role

## Best Practices

### User Onboarding
1. **Start with standard roles** - Use predefined access levels for most users
2. **Progressive permissions** - Begin with limited access, expand as needed
3. **Clear communication** - Include context when sending invitations
4. **Regular reviews** - Audit user access periodically

### Security Considerations
1. **Principle of least privilege** - Grant minimum necessary permissions
2. **Regular access audits** - Review user permissions quarterly
3. **Offboarding process** - Remove access immediately when users leave
4. **Custom role documentation** - Document custom role purposes and limitations

### Team Organization
1. **Consistent naming** - Use clear, descriptive role names
2. **Role consolidation** - Avoid creating too many similar custom roles
3. **Organization structure** - Align permissions with organizational hierarchy
4. **Workspace inheritance** - Consider how organization roles affect workspace access

## Error Handling

Common errors when managing users:

| Error Code | Description | Solution |
|------------|-------------|----------|
| `USER_ALREADY_IN_THE_PROJECT` | User already has workspace access | Check current user list before inviting |
| `UNAUTHORIZED` | Insufficient permissions to perform action | Verify your access level and permissions |
| `PROJECT_NOT_FOUND` | Workspace doesn't exist or no access | Confirm workspace ID and access rights |
| `INVITATION_LIMIT` | Reached invitation limit for billing tier | Upgrade plan or remove inactive users |
| `ADD_SELF` | Cannot invite yourself | Use a different email or have another admin invite you |
| `COMPANY_BANNED` | Organization account is suspended | Contact support to resolve account status |

## Rate Limits

User management operations have the following rate limits:
- **Invitations**: 100 per hour per organization
- **User queries**: 1000 per hour per user
- **Role modifications**: 50 per hour per workspace

## Related Resources

- [Workspaces API](/api/workspaces) - Managing workspaces that contain users
- [Records API](/api/records) - Understanding how user permissions affect record access
- [Automations API](/api/automations) - Automating user management workflows
- [Custom Fields API](/api/custom-fields) - Managing field-level permissions for custom roles
