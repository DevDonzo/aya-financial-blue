---
title: Rate Limits
description: Guidelines for Blue API rate limiting
icon: Gauge
---

In general, the Blue API does not enforce hard rate limits on most operations. However, certain sensitive operations have specific rate limits to prevent abuse and ensure system stability.

## Rate Limited Operations

The following operations have enforced rate limits:

| Operation | Rate Limit | Window | Purpose |
|-----------|------------|---------|---------|
| `signIn` | 5 requests | 60 seconds | Prevent brute force attacks |
| `signInRequest` | 3 requests | 120 seconds | Limit authentication attempts |
| `createDocument` | 5 requests | 60 seconds | Prevent document spam |
| `sendTestEmail` | 5 requests | 60 seconds | Prevent email abuse |
| `submitForm` | 5 requests | 60 seconds | Prevent form spam |
| `exportTodos` | 1 request | 50 seconds | Limit resource-intensive exports |
| `deleteCompany` | 3 requests | 60 seconds | Prevent accidental deletions |
| `deleteCompanyRequest` | 3 requests | 60 seconds | Prevent accidental deletions |
| `updateEmail` | 3 requests | 60 seconds | Prevent email change abuse |
| `updateEmailRequest` | 3 requests | 60 seconds | Prevent email change abuse |
| `verifyAcceptInvitation` | 3 requests | 60 seconds | Limit verification attempts |
| `verifySecurityCode` | 3 requests | 60 seconds | Limit verification attempts |

## Rate Limit Behavior

- **Per User**: Rate limits are applied per authenticated user
- **Per IP**: For unauthenticated requests, limits are applied per IP address
- **No Headers**: Rate limit information is not included in response headers

## Error Response

When a rate limit is exceeded, you'll receive a GraphQL error:

```json
{
  "errors": [{
    "message": "Rate limit exceeded",
    "extensions": {
      "code": "RATE_LIMITED"
    }
  }]
}
```

## Best Practices

1. **Handle Rate Limit Errors**: Implement proper error handling for rate-limited operations
2. **Exponential Backoff**: Use exponential backoff when retrying rate-limited requests
3. **Monitor Usage**: Be aware of which operations have limits when building integrations

For questions about rate limits, please [contact our support team](mailto:support@blue.cc).
