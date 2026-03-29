---
title: Delete Webhook
description: How to permanently delete a webhook in Blue.
icon: Trash2
---

## Delete a Webhook

The `deleteWebhook` mutation permanently removes a webhook. Once deleted, no further events will be delivered to the webhook's URL.

### Basic Example

```graphql
mutation {
  deleteWebhook(input: {
    webhookId: "webhook-abc-123"
  }) {
    success
  }
}
```

### With Variables

```graphql
mutation DeleteWebhook($input: DeleteWebhookInput!) {
  deleteWebhook(input: $input) {
    success
  }
}
```

Variables:
```json
{
  "input": {
    "webhookId": "webhook-abc-123"
  }
}
```

## Input Parameters

### DeleteWebhookInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhookId` | String! | Yes | The unique identifier of the webhook to delete |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Indicates whether the deletion was successful |

## Required Permissions

You can only delete webhooks that you created.

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
**When**: You attempt to delete a webhook created by another user.

## Important Notes

- Deletion is **permanent** and cannot be undone.
- Once deleted, any in-flight event deliveries may still be attempted but no new events will be queued.
- If you want to temporarily stop receiving events without losing your webhook configuration, use the `updateWebhook` mutation to set `enabled: false` instead.
- To re-create a webhook after deletion, you will receive a new `secret` -- the previous secret cannot be recovered.
