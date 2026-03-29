---
title: Update Webhook
description: How to update webhook configuration, events, and status in Blue.
icon: RefreshCw
---

## Update a Webhook

The `updateWebhook` mutation allows you to modify an existing webhook's URL, name, subscribed events, workspace scope, and enabled status.

### Basic Example

```graphql
mutation {
  updateWebhook(input: {
    webhookId: "webhook-abc-123"
    name: "Updated Webhook Name"
  }) {
    id
    name
    url
    status
    enabled
    updatedAt
  }
}
```

### Advanced Example

```graphql
mutation UpdateWebhook($input: UpdateWebhookInput!) {
  updateWebhook(input: $input) {
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
  "input": {
    "webhookId": "webhook-abc-123",
    "name": "Production Notifications",
    "url": "https://example.com/webhooks/blue-v2",
    "events": [
      "TODO_CREATED",
      "TODO_DELETED",
      "TODO_DONE_STATUS_UPDATED",
      "TODO_ASSIGNEE_ADDED",
      "TODO_ASSIGNEE_REMOVED",
      "COMMENT_CREATED"
    ],
    "projectIds": ["project-abc-123"],
    "enabled": true
  }
}
```

<Callout variant="warning" title="Health check on enable">
When you set `enabled` to `true`, Blue sends a `WEBHOOK_HEALTH_CHECK` event to the webhook URL to verify it is reachable. If the health check fails (timeout after 7 seconds or non-2xx response), the webhook will remain disabled and its status will be set to `UNHEALTHY`.
</Callout>

## Input Parameters

### UpdateWebhookInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhookId` | String! | Yes | The unique identifier of the webhook to update |
| `name` | String | No | Updated human-readable name |
| `url` | String | No | Updated endpoint URL. Must be a valid, publicly accessible URL. |
| `events` | [WebhookEvent] | No | Updated array of event types to subscribe to. Replaces the existing list entirely. |
| `projectIds` | [String] | No | Updated array of workspace IDs. Replaces the existing list entirely. |
| `enabled` | Boolean | No | Set to `true` to enable or `false` to disable the webhook. Enabling triggers a health check. |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the webhook |
| `uid` | String! | User-friendly unique identifier |
| `name` | String | Human-readable name for the webhook |
| `url` | String! | The endpoint URL receiving webhook events |
| `secret` | String | Always `null` (only returned at creation) |
| `status` | WebhookStatusType! | Health status: `HEALTHY` or `UNHEALTHY` |
| `events` | [WebhookEvent!] | Array of subscribed event types |
| `projectIds` | [String!] | Array of workspace IDs this webhook is scoped to |
| `enabled` | Boolean | Whether the webhook is currently active |
| `metadata` | JSON | Additional metadata associated with the webhook |
| `createdAt` | DateTime! | Timestamp when the webhook was created |
| `updatedAt` | DateTime! | Timestamp when the webhook was last updated |

## Required Permissions

You can only update webhooks that you created.

| Requirement | Description |
|-------------|-------------|
| Authenticated user | You must be logged in |
| Webhook owner | You must be the user who created the webhook |

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
**When**: The provided `webhookId` does not match any existing webhook.

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
**When**: You attempt to update a webhook created by another user.

### Invalid URL
```json
{
  "errors": [{
    "message": "url is not valid",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```
**When**: The provided `url` is not a valid URL format.

## Health Check Behavior

When enabling a webhook (`enabled: true`), Blue performs a health check:

1. A POST request is sent to the webhook URL with a `WEBHOOK_HEALTH_CHECK` event payload.
2. The payload is signed with the webhook's secret via the `X-Signature` header.
3. The request has a **7-second timeout**.
4. If the endpoint responds with a 2xx status, the webhook is enabled and status is set to `HEALTHY`.
5. If the endpoint fails to respond or returns an error, the webhook remains **disabled** and status is set to `UNHEALTHY`.

## Important Notes

- Only the webhook creator can update the webhook.
- The `events` and `projectIds` fields are replaced entirely when provided -- they are not merged with existing values.
- Changing the `url` also validates that the new URL is not a private network address.
- The `secret` cannot be changed or rotated. If you need a new secret, delete the webhook and create a new one.
- Setting `enabled: true` always triggers a health check, even if the webhook was already enabled.
