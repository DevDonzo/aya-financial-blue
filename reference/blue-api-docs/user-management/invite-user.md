---
title: Invite User
description: Invite users to projects or companies with specific access levels and custom roles.
icon: UserPlus
---

## Invite a User

The `inviteUser` mutation allows you to invite users to your Blue projects or companies. Users can be assigned predefined access levels or custom roles with specific permissions.

### Basic Example

Invite a user with a standard access level:

```graphql
mutation InviteUserToProject {
  inviteUser(
    input: {
      email: "newuser@example.com"
      projectId: "web-redesign"
      accessLevel: MEMBER
    }
  )
}
```

### Advanced Example

Invite a user with a custom role to multiple projects:

```graphql
mutation InviteUserWithCustomRole {
  inviteUser(
    input: {
      email: "contractor@example.com"
      projectIds: ["web-redesign", "mobile-app", "api-v2"]
      accessLevel: MEMBER
      roleId: "role_contractor_123"
    }
  )
}
```

## Input Parameters

### InviteUserInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | String! | ✅ Yes | Email address of the user to invite |
| `accessLevel` | UserAccessLevel! | ✅ Yes | Access level to grant (see table below) |
| `projectId` | String | No | Single project ID (mutually exclusive with companyId) |
| `projectIds` | [String!] | No | Multiple project IDs when using companyId |
| `companyId` | String | No | Company ID for company-level invitation (mutually exclusive with projectId) |
| `roleId` | String | No | Custom role ID (requires accessLevel: MEMBER) |

### UserAccessLevel Values

| Value | Description |
|-------|-------------|
| `OWNER` | Full control over project/company |
| `ADMIN` | Administrative access, can manage users and settings |
| `MEMBER` | Standard member access with full functionality |
| `CLIENT` | Limited access for external clients |
| `COMMENT_ONLY` | Can only view and comment on records |
| `VIEW_ONLY` | Read-only access to project |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Whether the invitation was sent successfully |

## Required Permissions

Users must have sufficient permissions to invite others. The permission hierarchy is enforced:

| Your Role | Can Invite |
|-----------|------------|
| `OWNER` | ✅ All access levels |
| `ADMIN` | ✅ ADMIN, MEMBER, CLIENT, COMMENT_ONLY, VIEW_ONLY (cannot invite OWNER) |
| `MEMBER` | ✅ MEMBER, CLIENT, COMMENT_ONLY, VIEW_ONLY (cannot invite OWNER or ADMIN) |
| `CLIENT` | ✅ CLIENT only |
| `COMMENT_ONLY` | ❌ Cannot invite |
| `VIEW_ONLY` | ❌ Cannot invite |

**Note**: For company invitations (using `companyId`), only company **OWNERS** can invite users.

## Invitation Types

### Project Invitation
Invite a user to a single project:
- Use `projectId` parameter
- Cannot use `companyId` simultaneously
- Inviter must have access to the project
- Access level restrictions apply

### Company Invitation
Invite a user to a company (and optionally specific projects):
- Use `companyId` parameter
- Cannot use `projectId` simultaneously
- Only company **OWNERS** can use this method
- Use `projectIds` array to specify which projects to include
- If `projectIds` is omitted, user gets company access only

## Custom Roles

When using custom roles:
1. Set `accessLevel` to `MEMBER`
2. Provide the `roleId` of your custom role
3. The user will inherit all permissions defined in the custom role
4. Custom roles are project-specific

To retrieve available custom roles, use the `projectUserRoles` [query](/api/user-management/retrieve-custom-role).

## Error Responses

### User Already in Project
```json
{
  "errors": [{
    "message": "User is already in the project.",
    "extensions": {
      "code": "USER_ALREADY_IN_THE_PROJECT"
    }
  }]
}
```

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to invite users with this access level",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

### Invalid Project
```json
{
  "errors": [{
    "message": "Project not found",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```

### Invitation Limit Exceeded
```json
{
  "errors": [{
    "message": "Unable to invite more people.",
    "extensions": {
      "code": "INVITATION_LIMIT"
    }
  }]
}
```

### Cannot Invite Yourself
```json
{
  "errors": [{
    "message": "You are not allowed to add yourself.",
    "extensions": {
      "code": "ADD_SELF"
    }
  }]
}
```

### Invalid Custom Role
```json
{
  "errors": [{
    "message": "Project user role was not found.",
    "extensions": {
      "code": "PROJECT_USER_ROLE_NOT_FOUND"
    }
  }]
}
```

### Company Banned
```json
{
  "errors": [{
    "message": "Company is banned",
    "extensions": {
      "code": "COMPANY_BANNED"
    }
  }]
}
```

## Important Notes

- **Email Validation**: Email addresses are normalized and validated before sending invitations
- **Invitation Expiry**: Invitations expire after 7 days and must be resent if not accepted
- **Automatic Notifications**: Blue automatically sends invitation emails to new users
- **Company Owners**: Company owners automatically receive ADMIN access in all projects
- **Billing Impact**: Adding users may affect your subscription if you have per-user pricing
- **Activity Logging**: All user invitations are logged for audit purposes
- **Parameter Exclusivity**: You must provide either `projectId` OR `companyId`, not both
- **Company Restrictions**: Only company owners can use the `companyId` parameter
- **Self-Invitation**: Users cannot invite themselves (will throw `ADD_SELF` error)

## Related Operations

- [List Users](/api/user-management/list-users) - View all users in a project or company
- [Remove User](/api/user-management/remove-user) - Remove users from projects
- [Custom Roles](/api/user-management/retrieve-custom-role) - Manage custom user roles
