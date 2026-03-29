---
title: Webhooks API
description: Complete API reference for managing webhooks in Blue - create, configure, and manage webhook integrations
icon: Webhook
---

## Overview

Webhooks allow you to receive real-time HTTP notifications when events occur in your Blue workspaces. When an event is triggered (such as a record being created or updated), Blue sends a POST request to your configured URL with details about the event.

Each webhook has a `secret` that is used to sign payloads with an HMAC SHA-256 signature, sent via the `X-Signature` header. The secret is only returned once at creation time and cannot be retrieved afterward.

## Available Operations

| Operation | Description | Link |
|-----------|-------------|------|
| **Create Webhook** | Register a new webhook endpoint | This page |
| **List Webhooks** | Query and paginate your webhooks | [View Details](/api/webhooks/list-webhooks) |
| **Update Webhook** | Update webhook URL, events, or status | [View Details](/api/webhooks/update-webhook) |
| **Delete Webhook** | Permanently remove a webhook | [View Details](/api/webhooks/delete-webhook) |

## Create a Webhook

The `createWebhook` mutation registers a new webhook endpoint that will receive event notifications.

### Basic Example

```graphql
mutation {
  createWebhook(input: {
    url: "https://example.com/webhooks/blue"
  }) {
    id
    uid
    url
    secret
    status
    enabled
    createdAt
  }
}
```

### Advanced Example

```graphql
mutation CreateWebhook($input: CreateWebhookInput!) {
  createWebhook(input: $input) {
    id
    uid
    name
    url
    secret
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
    "name": "Slack Notifications",
    "url": "https://example.com/webhooks/blue",
    "events": [
      "TODO_CREATED",
      "TODO_DONE_STATUS_UPDATED",
      "COMMENT_CREATED"
    ],
    "projectIds": ["project-abc-123", "project-def-456"]
  }
}
```

<Callout variant="info" title="Secret is only returned once">
The `secret` field is only included in the response when the webhook is first created. Subsequent queries for the webhook will return `null` for this field. Store the secret securely for verifying webhook signatures.
</Callout>

## Input Parameters

### CreateWebhookInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | String! | Yes | The endpoint URL that will receive webhook POST requests. Must be a valid, publicly accessible URL. Private/internal network URLs are rejected. |
| `name` | String | No | A human-readable name for the webhook |
| `events` | [WebhookEvent!] | No | Array of event types to subscribe to. If omitted, no events will be delivered until events are configured via update. |
| `projectIds` | [String!] | No | Array of workspace IDs to scope the webhook to. You must be a member of each workspace. If omitted, the webhook applies to all your workspaces. |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the webhook |
| `uid` | String! | User-friendly unique identifier |
| `name` | String | Human-readable name for the webhook |
| `url` | String! | The endpoint URL receiving webhook events |
| `secret` | String | HMAC signing secret (only returned on creation) |
| `status` | WebhookStatusType! | Health status: `HEALTHY` or `UNHEALTHY` |
| `events` | [WebhookEvent!] | Array of subscribed event types |
| `projectIds` | [String!] | Array of workspace IDs this webhook is scoped to |
| `enabled` | Boolean | Whether the webhook is currently active |
| `metadata` | JSON | Additional metadata associated with the webhook |
| `createdAt` | DateTime! | Timestamp when the webhook was created |
| `updatedAt` | DateTime! | Timestamp when the webhook was last updated |

## Available Webhook Events

### Record Events

| Event | Description |
|-------|-------------|
| `TODO_CREATED` | A record was created |
| `TODO_DELETED` | A record was deleted |
| `TODO_MOVED` | A record was moved to a different list |
| `TODO_NAME_CHANGED` | A record's title was changed |
| `TODO_DONE_STATUS_UPDATED` | A record was marked done or undone |
| `TODO_DUE_DATE_ADDED` | A due date was added to a record |
| `TODO_DUE_DATE_UPDATED` | A record's due date was changed |
| `TODO_DUE_DATE_REMOVED` | A due date was removed from a record |
| `TODO_ASSIGNEE_ADDED` | An assignee was added to a record |
| `TODO_ASSIGNEE_REMOVED` | An assignee was removed from a record |
| `TODO_TAG_ADDED` | A tag was added to a record |
| `TODO_TAG_REMOVED` | A tag was removed from a record |
| `TODO_CUSTOM_FIELD_UPDATED` | A custom field value was changed on a record |

### Checklist Events

| Event | Description |
|-------|-------------|
| `TODO_CHECKLIST_CREATED` | A checklist was created on a record |
| `TODO_CHECKLIST_NAME_CHANGED` | A checklist was renamed |
| `TODO_CHECKLIST_DELETED` | A checklist was deleted |
| `TODO_CHECKLIST_ITEM_CREATED` | A checklist item was created |
| `TODO_CHECKLIST_ITEM_NAME_CHANGED` | A checklist item was renamed |
| `TODO_CHECKLIST_ITEM_DELETED` | A checklist item was deleted |
| `TODO_CHECKLIST_ITEM_DUE_DATE_ADDED` | A due date was added to a checklist item |
| `TODO_CHECKLIST_ITEM_DUE_DATE_UPDATED` | A checklist item's due date was changed |
| `TODO_CHECKLIST_ITEM_DUE_DATE_REMOVED` | A due date was removed from a checklist item |
| `TODO_CHECKLIST_ITEM_ASSIGNEE_ADDED` | An assignee was added to a checklist item |
| `TODO_CHECKLIST_ITEM_ASSIGNEE_REMOVED` | An assignee was removed from a checklist item |
| `TODO_CHECKLIST_ITEM_DONE_STATUS_UPDATED` | A checklist item was marked done or undone |

### List Events

| Event | Description |
|-------|-------------|
| `TODO_LIST_CREATED` | A list was created in a workspace |
| `TODO_LIST_DELETED` | A list was deleted |
| `TODO_LIST_NAME_CHANGED` | A list was renamed |

### Custom Field Events

| Event | Description |
|-------|-------------|
| `CUSTOM_FIELD_CREATED` | A custom field was created |
| `CUSTOM_FIELD_DELETED` | A custom field was deleted |
| `CUSTOM_FIELD_UPDATED` | A custom field definition was updated |

### Tag Events

| Event | Description |
|-------|-------------|
| `TAG_CREATED` | A tag was created |
| `TAG_DELETED` | A tag was deleted |
| `TAG_UPDATED` | A tag was updated |

### Comment Events

| Event | Description |
|-------|-------------|
| `COMMENT_CREATED` | A comment was created |
| `COMMENT_DELETED` | A comment was deleted |
| `COMMENT_UPDATED` | A comment was updated |

## Required Permissions

Webhooks are user-scoped. You can only create webhooks for workspaces you are a member of.

| Requirement | Description |
|-------------|-------------|
| Authenticated user | You must be logged in |
| Workspace membership | You must be a member of every workspace specified in `projectIds` |

## Error Responses

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

### Private URL Rejected
```json
{
  "errors": [{
    "message": "URL points to a private network",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```
**When**: The provided `url` resolves to a private or internal network address.

### Unauthorized Workspace Access
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
**When**: One or more of the provided `projectIds` refer to workspaces you are not a member of.

## Verifying Webhook Signatures

When Blue sends a webhook event, it includes an `X-Signature` header containing an HMAC SHA-256 hash of the request body, signed with your webhook's `secret`. To verify:

```javascript
const crypto = require('crypto');

function verifySignature(body, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');
  return hash === signature;
}
```

## Important Notes

- Webhooks are **user-scoped** -- each user manages their own webhooks independently.
- The `secret` is generated automatically and only returned once at creation time. Store it securely.
- If no `events` are specified, the webhook will not receive any notifications until events are configured via the `updateWebhook` mutation.
- If no `projectIds` are specified, the webhook applies across all workspaces you are a member of.
- URLs must be publicly accessible; private network addresses (localhost, 10.x.x.x, 192.168.x.x, etc.) are rejected.
- New webhooks are created in a `HEALTHY` status. The status changes to `UNHEALTHY` if delivery failures occur.
