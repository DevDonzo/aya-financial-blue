---
title: Error Codes
description: Comprehensive reference of all error codes in the Blue GraphQL API, organized by category
icon: AlertTriangle
order: 99
---

## Error Response Format

Blue's GraphQL API returns errors in a standardized format following the GraphQL specification. When an error occurs, the response includes an `errors` array with detailed information about what went wrong.

### Example Error Response

```json
{
  "errors": [
    {
      "message": "Todo was not found.",
      "extensions": {
        "code": "TODO_NOT_FOUND"
      }
    }
  ]
}
```

### Error Structure

Each error object contains:
- **message**: A human-readable description of the error
- **extensions.code**: A machine-readable error code for programmatic handling

## Production Error Safety

Blue implements a safety system for error exposure:

- **Safe Errors**: Display actual error codes and messages to clients
- **Non-Safe Errors**: Return generic `INTERNAL_SERVER_ERROR` to hide sensitive details
- **Resource Not Found**: All `*_NOT_FOUND` errors are considered safe and always exposed

## Error Categories

Blue defines 108 custom error codes organized into the following categories:

### Authentication & Authorization Errors

| Error Code | Message | Description |
|------------|---------|-------------|
| `UNAUTHENTICATED` | "Authentication required." | Request requires authentication but none provided |
| `FORBIDDEN` | "You are not authorized." | Authenticated but lacks required permissions |

### Resource Not Found Errors (52 total)

#### Core Resources

| Error Code | Message | Description |
|------------|---------|-------------|
| `TODO_NOT_FOUND` | "Todo was not found." | Record/todo doesn't exist or user lacks access |
| `TODO_LIST_NOT_FOUND` | "Todo list was not found." | List doesn't exist or user lacks access |
| `PROJECT_NOT_FOUND` | "Project was not found." | Project doesn't exist or user lacks access |
| `COMPANY_NOT_FOUND` | "Organization was not found." | Organization doesn't exist or user lacks access |
| `USER_NOT_FOUND` | "User was not found." | User doesn't exist in the system |

#### Custom Fields & Forms

| Error Code | Message | Description |
|------------|---------|-------------|
| `CUSTOM_FIELD_NOT_FOUND` | "Custom field was not found." | Custom field doesn't exist |
| `CUSTOM_FIELD_OPTION_NOT_FOUND` | "Custom field option was not found." | Select field option doesn't exist |
| `FORM_NOT_FOUND` | "Form was not found." | Form template doesn't exist |
| `FORM_FIELD_NOT_FOUND` | "Form field was not found." | Form field doesn't exist |

#### Project Components

| Error Code | Message | Description |
|------------|---------|-------------|
| `TAG_NOT_FOUND` | "Tag was not found." | Tag doesn't exist in project |
| `AUTOMATION_NOT_FOUND` | "Automation was not found." | Automation rule doesn't exist |
| `CHART_NOT_FOUND` | "Chart was not found." | Dashboard chart doesn't exist |
| `WEBHOOK_NOT_FOUND` | "Webhook was not found." | Webhook configuration doesn't exist |
| `TEMPLATE_NOT_FOUND` | "Template was not found." | Project template doesn't exist |

#### Comments & Activities

| Error Code | Message | Description |
|------------|---------|-------------|
| `COMMENT_NOT_FOUND` | "Comment was not found." | Comment doesn't exist |
| `ACTIVITY_NOT_FOUND` | "Activity was not found." | Activity log entry doesn't exist |
| `REACTION_NOT_FOUND` | "Reaction was not found." | Comment reaction doesn't exist |

#### Other Resources

| Error Code | Message | Description |
|------------|---------|-------------|
| `FILE_NOT_FOUND` | "File was not found." | File attachment doesn't exist |
| `SUBSCRIPTION_NOT_FOUND` | "Subscription not found." | Billing subscription doesn't exist |
| `INVOICE_NOT_FOUND` | "Invoice not found." | Invoice record doesn't exist |
| `CHECKLIST_NOT_FOUND` | "Checklist was not found." | Checklist doesn't exist |
| `CHECKLIST_ITEM_NOT_FOUND` | "Checklist item was not found." | Checklist item doesn't exist |
| `PROJECT_ROLE_NOT_FOUND` | "Project role was not found." | Custom project role doesn't exist |
| `PROJECT_ACCESS_NOT_FOUND` | "Project access was not found." | User project access doesn't exist |
| `NOTIFICATION_NOT_FOUND` | "Notification was not found." | Notification doesn't exist |
| `DASHBOARD_NOT_FOUND` | "Dashboard was not found." | Dashboard doesn't exist |
| `KEY_NOT_FOUND` | "Key was not found." | Settings key doesn't exist |

### Validation Errors

| Error Code | Message | Description |
|------------|---------|-------------|
| `BAD_USER_INPUT` | "Invalid input." | Generic input validation failure |
| `VALIDATION_ERROR` | "Invalid parameters" | Request parameters failed validation |
| `BAD_EMAIL` | "You need to enter a valid email." | Invalid email format |
| `INVALID_IDS` | "Invalid ids." | One or more IDs in request are invalid |
| `PHONE_INVALID` | "Phone is invalid." | Invalid phone number format |
| `URL_INVALID` | "URL is invalid." | Invalid URL format |
| `INVALID_RECURRING_DUE_DATE` | "Invalid due date for recurring task" | Recurring task date validation failed |
| `INVALID_COLOR` | "Invalid color" | Color value doesn't match expected format |

### Business Logic Errors

#### Limits & Quotas

| Error Code | Message | Description |
|------------|---------|-------------|
| `COMPANY_LIMIT` | "You have reached the organization limit for your account." | Maximum organizations reached |
| `PROJECT_LIMIT` | "You have reached the project limit for your organization." | Maximum projects reached |
| `USER_LIMIT` | "You have reached the users limit for your organization." | Maximum users reached |
| `PROJECT_TEMPLATE_LIMIT` | "You have reached the templates limit for your organization." | Maximum templates reached |
| `CUSTOM_FIELD_LIMIT` | "Custom fields limit reached." | Maximum custom fields reached |
| `TODO_LIST_LIMIT` | "You have reached the list limit for your project." | Maximum lists per project |
| `TOO_MANY_TODOS` | "Too many todos." | Record limit exceeded |
| `TOO_MANY_OPTIONS` | "Too many options." | Select field option limit exceeded |
| `MAX_FILE_SIZE` | "Max file size is 4.8gb" | File upload size limit exceeded |

#### Resource Conflicts

| Error Code | Message | Description |
|------------|---------|-------------|
| `TAG_ALREADY_EXISTS` | "Tag already exists." | Tag with same name exists in project |
| `COMPANY_SLUG_ALREADY_EXISTS` | "Organization already exists." | Organization slug/URL is taken |
| `USER_ALREADY_EXISTS` | "User already exists." | User email already registered |
| `ALREADY_INVITED` | "The user is already invited." | User already has pending invitation |
| `USER_ALREADY_IN_PROJECT` | "User is already on this project." | User already has project access |
| `FILE_TYPE_NOT_ALLOWED` | "File type not allowed." | Uploaded file type is restricted |

#### Permission & Access Errors

| Error Code | Message | Description |
|------------|---------|-------------|
| `UNABLE_TO_DELETE_ONLY_ADMIN` | "Unable to delete the only Admin in the organization." | Cannot remove last admin |
| `UNABLE_TO_UPDATE_OWNER` | "Unable to update OWNER." | Cannot modify owner permissions |
| `TODO_LIST_IS_HIDDEN` | "Todo list is hidden." | List hidden from user's role |
| `COMPANY_NOT_ACTIVE` | "Organization is not active." | Organization subscription inactive |
| `PROJECT_NOT_ACTIVE` | "Project is not active." | Project is archived/inactive |

#### Data Integrity Errors

| Error Code | Message | Description |
|------------|---------|-------------|
| `UNABLE_TO_DELETE_LIST_WITH_TODOS` | "Unable to delete list with todos." | List must be empty to delete |
| `UNABLE_TO_DELTE_FILE` | "Unable to delete file." | File deletion failed (typo in code) |
| `UNABLE_TO_MOVE_TODO` | "Unable to move todo." | Cannot move record between lists |
| `DEPENDENCY_HAS_DEPENDENCY` | "Dependency has dependency" | Circular dependency detected |
| `TODO_DEPENDS_ON_ITSELF` | "Todo depends on itself" | Self-referential dependency |

### Stripe/Payment Errors

| Error Code | Message | Description |
|------------|---------|-------------|
| `STRIPE_CREATING_CUSTOMER` | "Error while creating customer in stripe." | Stripe customer creation failed |
| `STRIPE_ALREADY_SUBSCRIBED` | "Already subscribed." | Active subscription exists |
| `STRIPE_MISSING_PAYMENT_METHOD` | "Missing payment method." | No payment method on file |
| `STRIPE_CREATING_SUBSCRIPTION` | "Error while creating subscription in stripe." | Subscription creation failed |
| `STRIPE_UPDATING_SUBSCRIPTION` | "Error while updating subscription in stripe." | Subscription update failed |
| `STRIPE_CHECKOUT_SESSION` | "Error while creating checkout session in stripe." | Checkout session creation failed |
| `STRIPE_CUSTOMER_PORTAL` | "Error while creating customer portal in stripe." | Portal session creation failed |
| `STRIPE_TAX_ID` | "Unable to save tax ID" | Tax ID validation/save failed |
| `PAYMENT_REQUIRED` | "Payment required." | Feature requires active subscription |
| `NO_PAYMENT_REQUIRED` | "No payment required." | Payment not needed for operation |

### Authentication & Session Errors

| Error Code | Message | Description |
|------------|---------|-------------|
| `INVALID_CREDENTIALS` | "Invalid credentials." | Username/password incorrect |
| `EXPIRED_RESET_TOKEN` | "Reset token has expired." | Password reset token expired |
| `OAUTH_FAILED` | "OAuth process failed." | OAuth authentication failed |
| `SAML_NOT_ENABLED` | "SSO (SAML) is not enabled." | SAML SSO not configured |
| `SSO_AUTO_PROVISION_DISABLED` | "Auto provision is disabled." | Cannot auto-create SSO users |

### Rate Limiting

Rate limiting is handled by the `graphql-rate-limit` package with different configurations:

| Limit Type | Window | Max Requests | Applied To |
|------------|--------|--------------|------------|
| Standard | 60s | 500 | Most queries/mutations |
| Sensitive | 300s | 10 | Password reset, auth operations |
| Expensive | 60s | 20 | Complex queries, bulk operations |
| Search | 60s | 60 | Search operations |
| File Upload | 60s | 100 | File upload operations |

When rate limited, you'll receive a standard GraphQL error with message indicating the limit exceeded.

### System & Internal Errors

| Error Code | Message | Description |
|------------|---------|-------------|
| `INTERNAL_SERVER_ERROR` | "Internal server error." | Generic error for non-safe errors in production |
| `UNKNOWN_ERROR` | "Unknown error." | Unexpected error occurred |
| `RESOLVER_NOT_FOUND` | "Resolver not found" | GraphQL resolver missing |
| `FIELD_NOT_IN_SCHEMA` | "Field not in schema" | Requested field doesn't exist |

## Error Handling Best Practices

### Client-Side Handling

```javascript
try {
  const result = await client.mutate({
    mutation: CREATE_TODO,
    variables: { input }
  });
} catch (error) {
  if (error.graphQLErrors?.length > 0) {
    const errorCode = error.graphQLErrors[0].extensions?.code;
    
    switch (errorCode) {
      case 'UNAUTHENTICATED':
        // Redirect to login
        break;
      case 'TODO_NOT_FOUND':
        // Show "Record not found" message
        break;
      case 'VALIDATION_ERROR':
        // Display validation errors
        break;
      default:
        // Show generic error message
    }
  }
}
```

### Common Error Scenarios

1. **Authentication Required**: `UNAUTHENTICATED` - User needs to log in
2. **Permission Denied**: `FORBIDDEN` - User lacks required role/permission
3. **Resource Not Found**: `*_NOT_FOUND` - Resource doesn't exist or user can't access it
4. **Validation Failed**: `VALIDATION_ERROR`, `BAD_USER_INPUT` - Check input parameters
5. **Rate Limited**: Check rate limit headers and implement backoff
6. **Payment Required**: `PAYMENT_REQUIRED` - Feature requires subscription

## Related Documentation

- [Authentication](/api/start-guide/authentication) - How to authenticate API requests
- [Making Requests](/api/start-guide/making-requests) - Request format and headers
- [Rate Limits](/api/start-guide/rate-limits) - Detailed rate limiting information
