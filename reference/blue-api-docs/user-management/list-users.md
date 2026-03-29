---
title: List Users
description: Retrieve lists of users in organizations or projects with filtering and pagination.
icon: List
---

## List Users

Blue provides multiple queries to list users at different scopes - organization-wide, project-specific, or individual user lookup. These queries support pagination, filtering, and sorting to efficiently manage large user bases.

### Basic Example - Organization Users

List all users in an organization:

```graphql
query ListCompanyUsers {
  companyUserList(companyId: "acme-corp") {
    users {
      id
      email
      fullName
      jobTitle
      lastActiveAt
    }
    pageInfo {
      totalItems
      hasNextPage
    }
  }
}
```

### Advanced Example - Filtered Project Users

List project users with search and pagination:

```graphql
query ListProjectUsers {
  projectUserList(
    projectId: "web-redesign"
    search: "engineer"
    first: 20
    orderBy: lastActiveAt_DESC
  ) {
    edges {
      node {
        id
        email
        fullName
        accessLevel
        customRole {
          id
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Available Queries

### companyUserList

Lists all users in an organization with optional filtering.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | String! | ✅ Yes | Organization ID or slug |
| `notInProjectId` | String | No | Exclude users already in this project |
| `search` | String | No | Search by name or email |
| `first` | Int | No | Number of results to return (forward pagination) |
| `after` | String | No | Cursor for forward pagination |
| `last` | Int | No | Number of results to return (backward pagination) |
| `before` | String | No | Cursor for backward pagination |
| `skip` | Int | No | Number of results to skip |
| `orderBy` | UserOrderByInput | No | Sort order (see below) |

### projectUserList

Lists all users in a specific project.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | Project ID or slug |
| `search` | String | No | Search by name or email |
| `first` | Int | No | Number of results (max: 200) |
| `after` | String | No | Cursor for pagination |
| `orderBy` | UserOrderByInput | No | Sort order |

### user

Retrieves a single user by ID.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | User ID |

## Sorting Options

### UserOrderByInput Values

| Value | Description |
|-------|-------------|
| `createdAt_ASC` | Sort by registration date (oldest first) |
| `createdAt_DESC` | Sort by registration date (newest first) |
| `lastActiveAt_ASC` | Sort by last activity (oldest first) |
| `lastActiveAt_DESC` | Sort by last activity (newest first) |
| `firstName_ASC` | Sort by first name (A-Z) |
| `firstName_DESC` | Sort by first name (Z-A) |
| `lastName_ASC` | Sort by last name (A-Z) |
| `lastName_DESC` | Sort by last name (Z-A) |
| `email_ASC` | Sort by email address (A-Z) |
| `email_DESC` | Sort by email address (Z-A) |
| `username_ASC` | Sort by username (A-Z) |
| `username_DESC` | Sort by username (Z-A) |
| `jobTitle_ASC` | Sort by job title (A-Z) |
| `jobTitle_DESC` | Sort by job title (Z-A) |

## Response Fields

### User Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique user identifier |
| `uid` | String! | Firebase authentication UID |
| `username` | String! | User's chosen username |
| `email` | String! | Email address (visible to OWNER/ADMIN only) |
| `firstName` | String | First name |
| `lastName` | String | Last name |
| `fullName` | String | Combined first and last name |
| `jobTitle` | String | Professional title |
| `phoneNumber` | String | Contact number |
| `dateOfBirth` | DateTime | Birth date |
| `isEmailVerified` | Boolean! | Email verification status |
| `lastActiveAt` | DateTime | Last activity timestamp |
| `createdAt` | DateTime! | Account creation date |
| `updatedAt` | DateTime! | Last profile update |
| `isOnline` | Boolean! | Current online status |
| `timezone` | String | User's timezone |
| `locale` | String | Language preference |
| `theme` | JSON | UI theme preferences |
| `image` | Image | Profile picture object |

### Project User Additional Fields

When listing project users, additional fields are available:

| Field | Type | Description |
|-------|------|-------------|
| `accessLevel` | UserAccessLevel! | User's role in the project |
| `customRole` | ProjectUserRole | Custom role details if applicable |
| `joinedAt` | DateTime! | When user joined the project |

### Pagination Info

| Field | Type | Description |
|-------|------|-------------|
| `totalItems` | Int! | Total number of users |
| `totalPages` | Int | Total pages (for offset pagination) |
| `page` | Int | Current page number |
| `perPage` | Int | Items per page |
| `hasNextPage` | Boolean! | More results available |
| `hasPreviousPage` | Boolean! | Previous results available |
| `startCursor` | String | First item cursor |
| `endCursor` | String | Last item cursor |

## Required Permissions

| Query | Required Permission |
|-------|-------------------|
| `companyUserList` | Any authenticated user in the organization |
| `projectUserList` | Any project member (including VIEW_ONLY) |
| `user` | Any authenticated user |

## Error Responses

### Organization Not Found
```json
{
  "errors": [{
    "message": "Organization not found",
    "extensions": {
      "code": "COMPANY_NOT_FOUND"
    }
  }]
}
```

### Project Not Found
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

### Unauthorized Access
```json
{
  "errors": [{
    "message": "You don't have access to this resource",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

## Important Notes

- **Performance**: Use pagination for large user lists (max 200 users per request)
- **Search**: Searches across first name, last name, and email fields
- **Email Privacy**: Email addresses are only visible to users with OWNER or ADMIN access levels
- **Online Status**: `isOnline` updates in real-time via WebSocket connections
- **Profile Images**: Use the `image.variants` field for different sizes
- **Filtering**: The `notInProjectId` parameter is useful when building user selection interfaces
- **Access Levels**: Project user lists include role information not available in organization lists

## Related Operations

- [User Management Overview](/api/user-management/1.index) - User management operations
- [Remove User](/api/user-management/3.remove-user) - Remove users from projects
- [Custom Roles](/api/user-management/4.retrieve-custom-role) - Manage user permissions
