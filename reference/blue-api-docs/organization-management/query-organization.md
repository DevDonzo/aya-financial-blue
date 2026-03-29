---
title: Query Organization
description: How to retrieve organization information using ID or slug with the Blue API.
icon: Search
---

To retrieve organization information, you can use the `company` query with either the organization ID or slug:

## Query by Organization ID

```graphql
query GetCompanyById {
  company(id: "company-id-here") {
    id
    name
    slug
    createdAt
    updatedAt
  }
}
```

## Query by Organization Slug

The same query also accepts an organization slug, making it easy to retrieve organization information using the URL-friendly identifier:

```graphql
query GetCompanyBySlug {
  company(id: "company-slug-here") {
    id
    name
    slug
    createdAt
    updatedAt
  }
}
```

## Response Example

Both queries will return the same organization object:

```json
{
  "data": {
    "company": {
      "id": "cuid123456789",
      "name": "Acme Corporation",
      "slug": "acme-corp",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-03-20T14:45:00.000Z"
    }
  }
}
```

## Important Notes

- The `id` parameter accepts both organization IDs and slugs
- Only organizations where the current user is a member will be returned
- If the organization is not found or the user doesn't have access, a `CompanyNotFoundError` will be thrown
- Banned organizations will throw a `CompanyBannedError`

## Available Fields

You can query for additional organization fields as needed:

```graphql
query GetCompanyDetails {
  company(id: "company-slug") {
    id
    name
    slug
    # Add more fields as needed based on your requirements
    # Check the GraphQL schema for all available fields
  }
}
```
