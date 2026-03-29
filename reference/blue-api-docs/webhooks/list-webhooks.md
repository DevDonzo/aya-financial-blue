---
title: List Webhooks
description: How to query and list webhooks in Blue with filtering and pagination.
icon: List
---

## List Webhooks

The `webhooks` query retrieves a paginated list of your webhooks. You can also fetch a single webhook by ID using the `webhook` query.

### Basic Example

```graphql
query {
  webhooks {
    items {
      id
      uid
      name
      url
      status
      enabled
      createdAt
    }
    pageInfo {
      totalItems
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Advanced Example

```graphql
query ListWebhooks($filter: WebhookFilter, $skip: Int, $take: Int) {
  webhooks(filter: $filter, skip: $skip, take: $take) {
    items {
      id
      uid
      name
      url
      status
      events
      projectIds
      enabled
      metadata
      createdAt
      updatedAt
    }
    pageInfo {
      totalItems
      totalPages
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

Variables:
```json
{
  "filter": { "enabled": true },
  "skip": 0,
  "take": 10
}
```

### Fetch a Single Webhook

```graphql
query GetWebhook($id: String!) {
  webhook(id: $id) {
    id
    uid
    name
    url
    status
    events
    projectIds
    enabled
    metadata
    createdAt
    updatedAt
  }
}
```

Variables:
```json
{
  "id": "webhook-abc-123"
}
```

## Query Parameters

### webhooks Query

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filter` | WebhookFilter | — | Optional filter to narrow results |
| `skip` | Int | 0 | Number of records to skip for pagination |
| `take` | Int | 20 | Number of records to return per page |

### webhook Query

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | The unique identifier of the webhook to retrieve |

### WebhookFilter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `enabled` | Boolean | No | Filter by enabled/disabled status. Omit to return all webhooks. |

## Response Fields

### Webhook

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the webhook |
| `uid` | String! | User-friendly unique identifier |
| `name` | String | Human-readable name for the webhook |
| `url` | String! | The endpoint URL receiving webhook events |
| `secret` | String | Always `null` when queried (only returned at creation) |
| `status` | WebhookStatusType! | Health status: `HEALTHY` or `UNHEALTHY` |
| `events` | [WebhookEvent!] | Array of subscribed event types |
| `projectIds` | [String!] | Array of workspace IDs this webhook is scoped to |
| `enabled` | Boolean | Whether the webhook is currently active |
| `metadata` | JSON | Additional metadata associated with the webhook |
| `createdAt` | DateTime! | Timestamp when the webhook was created |
| `updatedAt` | DateTime! | Timestamp when the webhook was last updated |

### Pagination Fields (PageInfo)

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | Int | Total number of pages |
| `totalItems` | Int | Total number of webhooks matching the query |
| `page` | Int | Current page number |
| `perPage` | Int | Number of items per page |
| `hasNextPage` | Boolean! | Whether there are more results after this page |
| `hasPreviousPage` | Boolean! | Whether there are results before this page |

## Required Permissions

Webhooks are user-scoped. You can only view webhooks that you created.

| Requirement | Description |
|-------------|-------------|
| Authenticated user | You must be logged in |

## Error Responses

### Webhook Not Found
```json
{
  "errors": [{
    "message": "Webhook not found",
    "extensions": {
      "code": "WEBHOOK_NOT_FOUND"
    }
  }]
}
```
**When**: The `webhook` query is called with an ID that does not exist.

### Unauthorized
```json
{
  "errors": [{
    "message": "Unauthorized",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```
**When**: You attempt to query a webhook that was created by another user.

## Important Notes

- The `webhooks` query only returns webhooks created by the authenticated user.
- Results are ordered by creation date, newest first.
- The `secret` field is always `null` when querying webhooks; it is only returned once at creation time.
- The default page size is 20 items. Use `skip` and `take` to paginate through results.
