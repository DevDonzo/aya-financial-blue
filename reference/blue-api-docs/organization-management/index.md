---
title: Organization Management
description: Overview of organization management operations in the Blue API.
icon: Building2
---

The Blue API provides comprehensive organization management capabilities, allowing you to create, query, and manage organizations within your Blue account.

## Available Operations

### Creating Organizations
- [Create an Organization](/api/organization-management/create-organization) - Create new organizations with custom names and slugs

### Querying Organizations
- [Query Organization](/api/organization-management/query-organization) - Retrieve organization information using ID or slug

## Key Concepts

### Organization Identification
Organizations in Blue can be identified using two methods:
1. **Organization ID** - A unique identifier (CUID) automatically generated when creating an organization
2. **Organization Slug** - A URL-friendly identifier that you specify when creating an organization

### Access Control
- Users can only access organizations where they are members
- Organization operations respect user permissions and access levels
- Banned organizations cannot be accessed through the API

### Billing Considerations
Each organization in Blue is billed separately, so creating new organizations may affect your account billing.
