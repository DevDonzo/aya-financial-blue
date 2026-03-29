---
title: Workspace Activity
description: Retrieve and monitor workspace activity feeds using the Blue API.
icon: Activity
---

## Retrieve Workspace Activity

The `activityList` query provides access to a comprehensive activity feed for workspaces and organizations. Activities are automatically generated when users perform actions like creating todos, comments, or making workspace changes.

### Basic Example

```graphql
query ProjectActivity {
  activityList(
    projectId: "your-project-id"
    first: 20
    orderBy: createdAt_DESC
  ) {
    activities {
      id
      category
      html
      createdAt
      createdBy {
        id
        name
        email
      }
      project {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

### Advanced Example with Filtering

```graphql
query FilteredActivity {
  activityList(
    companyId: "your-company-id"
    categories: [CREATE_TODO, MARK_TODO_AS_COMPLETE, CREATE_COMMENT]
    userIds: ["user1-id", "user2-id"]
    startDate: "2024-01-01T00:00:00Z"
    endDate: "2024-12-31T23:59:59Z"
    first: 50
    orderBy: createdAt_DESC
  ) {
    activities {
      id
      uid
      category
      html
      createdAt
      updatedAt
      createdBy {
        id
        name
        email
      }
      affectedBy {
        id
        name
      }
      todo {
        id
        title
      }
      comment {
        id
        text
      }
      project {
        id
        name
        slug
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }
}
```

## Input Parameters

### activityList Query

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | String | No | Filter activities by organization ID or slug |
| `projectId` | String | No | Filter activities by workspace ID or slug |
| `userId` | String | No | Filter activities by a specific user |
| `userIds` | [String!] | No | Filter activities by multiple users |
| `tagIds` | [String!] | No | Filter activities by todo tags |
| `categories` | [ActivityCategory!] | No | Filter by specific activity types |
| `startDate` | DateTime | No | Filter activities from this date |
| `endDate` | DateTime | No | Filter activities up to this date |
| `skip` | Int | No | Skip this number of records (offset pagination) |
| `first` | Int | No | Return first N records (cursor pagination) |
| `last` | Int | No | Return last N records (cursor pagination) |
| `after` | String | No | Return records after this cursor |
| `before` | String | No | Return records before this cursor |
| `orderBy` | ActivityOrderByInput | No | Sort order for results |

### ActivityCategory Values

The system tracks various types of activities automatically:

| Category | Description |
|----------|-------------|
| `CREATE_TODO` | A new todo/task was created |
| `MARK_TODO_AS_COMPLETE` | A todo was marked as complete |
| `CREATE_COMMENT` | A comment was added |
| `CREATE_DISCUSSION` | A discussion was started |
| `CREATE_STATUS_UPDATE` | A status update was posted |
| `CREATE_TODO_LIST` | A new todo list was created |
| `MOVE_TODO` | A todo was moved between lists |
| `COPY_TODO` | A todo was copied |
| `ADD_USER_TO_PROJECT` | A user was added to the workspace |
| `REMOVE_USER_FROM_PROJECT` | A user was removed from the workspace |
| `ARCHIVE_PROJECT` | The workspace was archived |
| `UNARCHIVE_PROJECT` | The workspace was unarchived |
| `CREATE_INVITATION` | A user was invited |
| `ACCEPT_INVITATION` | An invitation was accepted |
| `CREATE_CUSTOM_FIELD` | A custom field was created |
| `RECEIVE_FORM` | A form submission was received |

### ActivityOrderByInput Values

| Value | Description |
|-------|-------------|
| `createdAt_DESC` | Most recent first (default) |
| `createdAt_ASC` | Oldest first |
| `updatedAt_DESC` | Most recently updated first |
| `updatedAt_ASC` | Least recently updated first |
| `category_ASC` | Alphabetical by category |
| `category_DESC` | Reverse alphabetical by category |

## Response Fields

### Activity Type

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the activity |
| `uid` | String! | Alternative unique identifier |
| `category` | ActivityCategory! | Type of activity that occurred |
| `html` | String! | Rich HTML description of the activity |
| `createdAt` | DateTime! | When the activity occurred |
| `updatedAt` | DateTime! | When the activity was last updated |
| `createdBy` | User! | User who performed the action |
| `affectedBy` | User | User who was affected by the action |
| `company` | Company | Associated organization |
| `project` | Project | Associated workspace |
| `todo` | Todo | Associated todo (if applicable) |
| `todoList` | TodoList | Associated todo list (if applicable) |
| `comment` | Comment | Associated comment (if applicable) |
| `discussion` | Discussion | Associated discussion (if applicable) |
| `statusUpdate` | StatusUpdate | Associated status update (if applicable) |
| `metadata` | String | Additional activity metadata |

### ActivityList Response

| Field | Type | Description |
|-------|------|-------------|
| `activities` | [Activity!]! | Array of activity records |
| `pageInfo` | PageInfo! | Pagination information |
| `totalCount` | Int! | Total number of activities matching filters |

## Real-Time Activity Updates

Subscribe to activity changes using the `subscribeToActivity` subscription:

```graphql
subscription ActivityUpdates($companyId: String!, $projectId: String) {
  subscribeToActivity(companyId: $companyId, projectId: $projectId) {
    mutation
    node {
      id
      category
      html
      createdAt
      createdBy {
        id
        name
        email
      }
      project {
        id
        name
      }
    }
  }
}
```

### Subscription Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | String | No | Subscribe to organization-wide activities |
| `projectId` | String | No | Subscribe to specific workspace activities |

The subscription will notify you of:
- `ACTIVITY_CREATED` - New activities
- `ACTIVITY_UPDATED` - Modified activities
- `ACTIVITY_DELETED` - Removed activities

## Filtering and Privacy

### Automatic Filtering

The activity feed automatically filters results based on:

- **Workspace Settings**: Only shows activities from workspaces with activity tracking enabled
- **User Permissions**: Different user roles see different activity types
- **Workspace Membership**: Users only see activities from workspaces they have access to
- **Organization Membership**: Activities are scoped to the user's organizations

### Privacy Considerations

- CLIENT role users have limited visibility into certain administrative activities
- Activities respect workspace-level privacy settings
- Sensitive operations may not generate public activities

## Error Responses

### Invalid Workspace/Organization
```json
{
  "errors": [{
    "message": "Project not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Permission Denied
```json
{
  "errors": [{
    "message": "You do not have permission to view activities for this project",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Invalid Date Range
```json
{
  "errors": [{
    "message": "Start date must be before end date",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

## Best Practices

1. **Use Pagination**: Activity feeds can be large, always use `first` parameter
2. **Filter by Workspace**: Organization-wide activity feeds can be overwhelming
3. **Real-time Updates**: Use subscriptions for live activity feeds
4. **Date Filtering**: Use date ranges for historical activity analysis
5. **Category Filtering**: Filter by specific activity types for focused feeds
6. **User Filtering**: Track specific team members' activities using `userIds`

## Important Notes

- Activities are automatically generated and cannot be manually created via API
- Activity text uses HTML formatting for rich display
- The `text` field is deprecated in favor of `html`
- Activities are permanently stored and provide a complete audit trail
- Real-time subscriptions require WebSocket connection authentication
