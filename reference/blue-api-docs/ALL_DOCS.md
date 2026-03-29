# Blue API Documentation

Combined local export of every page currently published under `https://blue.cc/api`.

## automations

### /api/automations/copy-automation

Source: https://blue.cc/api/automations/copy-automation

## Copy Automation

Create a copy of an existing automation within the same project. The new automation duplicates the trigger configuration and all actions from the original, but is created in an inactive state by default. This is useful for creating variations of existing automations without building them from scratch.

### Basic Example

```graphql
mutation CopyAutomation {
  copyAutomation(
    input: {
      automationId: "automation_abc123"
    }
  ) {
    id
    isActive
    trigger {
      type
    }
    actions {
      type
    }
    createdAt
  }
}
```

### Advanced Example

```graphql
mutation CopyAutomationAdvanced {
  copyAutomation(
    input: {
      automationId: "automation_abc123"
      isActive: false
    }
  ) {
    id
    isActive
    trigger {
      id
      type
      color
      todoList {
        id
        title
      }
      tags {
        id
        title
      }
      assignees {
        id
        name
      }
      customField {
        id
        name
        type
      }
      customFieldOptions {
        id
        title
      }
      conditionMode
      filterGroups
      filterGroupLinks
    }
    actions {
      id
      type
      duedIn
      color
      assigneeTriggerer
      todoList {
        id
        title
      }
      tags {
        id
        title
      }
      assignees {
        id
        name
      }
      customField {
        id
        name
      }
      customFieldOptions {
        id
        title
      }
      projects {
        id
        title
      }
      portableDocument {
        id
      }
      httpOption {
        url
        method
        contentType
        authorizationType
      }
      metadata {
        ... on AutomationActionMetadataSendEmail {
          email {
            subject
            to
            from
            cc
            bcc
            content
          }
        }
        ... on AutomationActionMetadataCreateChecklist {
          checklists {
            title
            position
            checklistItems {
              title
              position
              duedIn
            }
          }
        }
        ... on AutomationActionMetadataCopyTodo {
          copyTodoOptions
        }
      }
    }
    createdBy {
      id
      name
      email
    }
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### CopyAutomationInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `automationId` | String! | Yes | The ID of the automation to copy |
| `isActive` | Boolean | No | Set the copied automation's active state (defaults to inactive) |

## Response Fields

The mutation returns the newly created `Automation` object.

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the new automation copy |
| `trigger` | AutomationTrigger! | The duplicated trigger configuration |
| `actions` | [AutomationAction!]! | The duplicated actions |
| `isActive` | Boolean! | Active status (defaults to false) |
| `createdBy` | User! | The user who performed the copy (not the original creator) |
| `project` | Project! | The project this automation belongs to |
| `createdAt` | DateTime! | Timestamp of the copy operation |
| `updatedAt` | DateTime! | Timestamp of the copy operation |

## Required Permissions

| Access Level | Can Copy Automations |
|--------------|---------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |

Only owners and admins of an active project can copy automations.

## Error Responses

### Authentication Required
```json
{
  "errors": [{
    "message": "You must be logged in",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```
**When**: No valid authentication token is provided.

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
**When**: The authenticated user does not have OWNER or ADMIN access to the project, or the project is archived.

### Automation Not Found
```json
{
  "errors": [{
    "message": "Automation or its trigger not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```
**When**: The specified `automationId` does not exist or its trigger data is missing.

## Important Notes

- **Inactive by Default**: Copied automations are created in an inactive state to prevent unintended triggers; use `editAutomation` to activate when ready
- **New Owner**: The `createdBy` field is set to the user performing the copy, not the original automation's creator
- **Full Duplication**: All trigger conditions, action configurations, HTTP options, email settings, checklist templates, and tag/assignee references are copied
- **Assignee Fallback**: For `ASSIGNEE_ADDED` or `ASSIGNEE_REMOVED` trigger types, if the original has no assignees configured, the copying user is added as the default assignee
- **No Schedule Copy**: Scheduled triggers are not automatically rescheduled for the copy -- activate the automation via `editAutomation` to start the schedule
- **Same Project**: The copy is created within the same project as the original automation

### /api/automations/create-automation

Source: https://blue.cc/api/automations/create-automation

## Create Automation

Create a new automation workflow for your project. An automation consists of a trigger event and one or more actions that execute when the trigger fires. The automation is created in an active state by default.

### Basic Example

```graphql
mutation CreateAutomation {
  createAutomation(
    input: {
      trigger: {
        type: TODO_CREATED
      }
      actions: [
        {
          type: ADD_TAG
          tagIds: ["tag_abc123"]
        }
      ]
    }
  ) {
    id
    isActive
    trigger {
      id
      type
    }
    actions {
      id
      type
    }
    createdAt
  }
}
```

### Advanced Example

```graphql
mutation CreateAutomationAdvanced {
  createAutomation(
    input: {
      trigger: {
        type: TODO_LIST_CHANGED
        todoListId: "list_abc123"
        tagIds: ["tag_456"]
        assigneeIds: ["user_789"]
        color: "#FF5733"
        conditionMode: ALL
      }
      actions: [
        {
          type: CHANGE_DUE_DATE
          duedIn: 7
        }
        {
          type: ADD_ASSIGNEE
          assigneeIds: ["user_101", "user_102"]
        }
        {
          type: SEND_EMAIL
          metadata: {
            email: {
              to: ["team@example.com"]
              from: "notifications@example.com"
              subject: "Record moved to In Progress"
              content: "<p>A record has been moved.</p>"
              cc: ["manager@example.com"]
            }
          }
        }
        {
          type: CREATE_CHECKLIST
          metadata: {
            checklists: [
              {
                title: "Review Checklist"
                position: 1.0
                checklistItems: [
                  {
                    title: "Code review"
                    position: 1.0
                    duedIn: 3
                    assigneeIds: ["user_101"]
                  }
                  {
                    title: "QA testing"
                    position: 2.0
                    duedIn: 5
                  }
                ]
              }
            ]
          }
        }
        {
          type: MAKE_HTTP_REQUEST
          httpOption: {
            url: "https://api.example.com/webhook"
            method: POST
            contentType: APPLICATION_JSON
            body: "{\"event\": \"record_moved\"}"
            headers: [
              { key: "X-Custom-Header", value: "automation" }
            ]
            authorizationType: BEARER_TOKEN
            authorizationBearerToken: "your-token-here"
          }
        }
      ]
    }
  ) {
    id
    isActive
    trigger {
      id
      type
      color
      todoList {
        id
        title
      }
      tags {
        id
        title
      }
      assignees {
        id
        name
      }
      conditionMode
      schedule {
        type
        hour
        minute
        timezone
        nextExecutionAt
      }
    }
    actions {
      id
      type
      duedIn
      assigneeTriggerer
      tags {
        id
        title
      }
      assignees {
        id
        name
      }
      metadata {
        ... on AutomationActionMetadataSendEmail {
          email {
            subject
            to
            from
          }
        }
        ... on AutomationActionMetadataCreateChecklist {
          checklists {
            title
            checklistItems {
              title
              duedIn
            }
          }
        }
      }
      httpOption {
        url
        method
        contentType
      }
    }
    createdBy {
      id
      name
      email
    }
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### CreateAutomationInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `trigger` | CreateAutomationTriggerInput! | Yes | The trigger event configuration |
| `actions` | [CreateAutomationActionInput!]! | Yes | One or more actions to perform when triggered |

### CreateAutomationTriggerInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | AutomationTriggerType! | Yes | The type of event that triggers the automation |
| `metadata` | AutomationTriggerMetadataInput | No | Trigger-specific metadata (e.g., overdue settings) |
| `customFieldId` | String | No | Custom field to monitor for changes |
| `customFieldOptionIds` | [String!] | No | Specific custom field option IDs to match |
| `todoListId` | String | No | Specific todo list to scope the trigger to |
| `todoListIds` | [String!] | No | Multiple todo lists to scope the trigger to |
| `tagIds` | [String!] | No | Tag IDs that must match for the trigger |
| `todoIds` | [String!] | No | Specific todo/record IDs to scope the trigger to |
| `assigneeIds` | [String!] | No | Assignee IDs that must match for the trigger |
| `color` | String | No | Color value to match (hex format) |
| `colors` | [String!] | No | Multiple color values to match |
| `dueStart` | DateTime | No | Due date range start for filtering |
| `dueEnd` | DateTime | No | Due date range end for filtering |
| `showCompleted` | Boolean | No | Whether to include completed records |
| `fields` | JSON | No | Additional field conditions |
| `op` | FilterLogicalOperator | No | Logical operator for combining filter conditions |
| `conditionMode` | ConditionalAutomationMode | No | Mode for conditional automation matching |
| `filterGroups` | JSON | No | Advanced filter group definitions |
| `filterGroupLinks` | JSON | No | Links between filter groups |
| `schedule` | CreateAutomationTriggerScheduleInput | No | Schedule configuration for SCHEDULED triggers |

### CreateAutomationTriggerScheduleInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | AutomationScheduleType! | Yes | Schedule frequency type |
| `hour` | Int! | Yes | Hour of day to execute (0-23) |
| `minute` | Int! | Yes | Minute of hour to execute (0-59) |
| `timezone` | String! | Yes | IANA timezone string (e.g., "America/New_York") |
| `days` | [Int!] | No | Specific days for the schedule |
| `dayOfWeek` | [Int!] | No | Days of week (0=Sunday, 6=Saturday) |
| `dayOfMonth` | Int | No | Day of month (1-31) |
| `month` | Int | No | Month of year (1-12) |
| `cronExpression` | String | No | Custom cron expression |
| `isActive` | Boolean | No | Whether the schedule is active |

### AutomationTriggerMetadataInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `incompleteOnly` | Boolean | No | Only trigger for incomplete records |
| `offset` | Int | No | Offset in minutes before/after the due date |

### CreateAutomationActionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | AutomationActionType! | Yes | The type of action to perform |
| `duedIn` | Int | No | Number of days to set for due date actions |
| `customFieldId` | String | No | Target custom field ID |
| `customFieldOptionIds` | [String!] | No | Custom field option IDs to set |
| `todoListId` | String | No | Target todo list ID |
| `metadata` | AutomationActionMetadataInput | No | Action-specific metadata |
| `tagIds` | [String!] | No | Tag IDs to add or remove |
| `assigneeIds` | [String!] | No | Assignee IDs to add or remove |
| `projectIds` | [String!] | No | Project IDs for cross-project actions |
| `color` | String | No | Color value to apply (hex format) |
| `assigneeTriggerer` | String | No | Special identifier to assign the triggering user |
| `portableDocumentId` | String | No | Portable document ID for PDF generation |
| `httpOption` | AutomationActionHttpOptionInput | No | HTTP request configuration |

### AutomationActionHttpOptionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | String! | Yes | The URL to send the request to |
| `method` | HttpMethod! | Yes | HTTP method (GET, POST, PUT, DELETE, etc.) |
| `headers` | [HttpHeaderInput] | No | Custom HTTP headers |
| `parameters` | [HttpParameterInput] | No | Query parameters |
| `contentType` | HttpContentType | No | Request content type |
| `body` | String | No | Request body content |
| `authorizationType` | HttpAuthorizationType | No | Authentication type |
| `authorizationBasicAuth` | HttpAuthorizationBasicAuthInput | No | Basic auth credentials |
| `authorizationBearerToken` | String | No | Bearer token value |
| `authorizationApiKey` | HttpAuthorizationApiKeyInput | No | API key configuration |
| `oauthConnectionId` | String | No | OAuth connection ID for authenticated requests |

### AutomationActionMetadataInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklists` | [AutomationActionCreateChecklistInput] | No | Checklists to create |
| `copyTodoOptions` | [CopyTodoOption!] | No | Options for copying records |
| `email` | AutomationActionSendEmailInput | No | Email sending configuration |
| `number` | Float | No | Numeric value for custom field actions |
| `text` | String | No | Text value for custom field actions |

## Response Fields

The mutation returns an `Automation` object.

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the automation |
| `trigger` | AutomationTrigger! | The configured trigger event |
| `actions` | [AutomationAction!]! | The configured actions |
| `isActive` | Boolean! | Whether the automation is active (defaults to true) |
| `createdBy` | User! | The user who created the automation |
| `project` | Project! | The project this automation belongs to |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |

## Required Permissions

| Access Level | Can Create Automations |
|--------------|----------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |

Only owners and admins of an active project can create automations.

## Error Responses

### Authentication Required
```json
{
  "errors": [{
    "message": "You must be logged in",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```
**When**: No valid authentication token is provided.

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
**When**: The authenticated user does not have OWNER or ADMIN access to the project, or the project is archived.

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
**When**: The project context is invalid or the project does not exist.

## Important Notes

- **Active by Default**: New automations are created in an active state and will begin triggering immediately
- **Project Scope**: Automations are created within the current project context
- **Scheduled Triggers**: When using `SCHEDULED` trigger type, the schedule configuration is required and the automation will be scheduled automatically
- **Due Date Triggers**: `DUE_DATE_EXPIRED` triggers will automatically schedule monitoring jobs for existing records
- **Conditional Automations**: `CONDITIONAL` trigger types will pre-populate a cache for efficient evaluation
- **Multiple Actions**: You can attach multiple actions to a single trigger, and they will all execute when the trigger fires
- **HTTP Actions**: Use `MAKE_HTTP_REQUEST` action type with `httpOption` to call external APIs or webhooks

### /api/automations/delete-automation

Source: https://blue.cc/api/automations/delete-automation

## Delete Automation

Permanently delete an automation from your project. This removes the automation, its trigger, all associated actions, and cleans up any scheduled jobs or caches. This action cannot be undone.

### Basic Example

```graphql
mutation DeleteAutomation {
  deleteAutomation(id: "automation_abc123")
}
```

### Advanced Example

```graphql
mutation DeleteAutomationWithAlias {
  removeWorkflow: deleteAutomation(id: "automation_abc123")
  removeNotifier: deleteAutomation(id: "automation_def456")
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | The ID of the automation to delete |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| (root) | Boolean! | Returns `true` if the automation was successfully deleted |

## Required Permissions

| Access Level | Can Delete Automations |
|--------------|----------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |

Only owners and admins of an active project can delete automations.

## Error Responses

### Authentication Required
```json
{
  "errors": [{
    "message": "You must be logged in",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```
**When**: No valid authentication token is provided.

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
**When**: The authenticated user does not have OWNER or ADMIN access to the project, or the project is archived.

### Automation Not Found
```json
{
  "errors": [{
    "message": "Automation not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```
**When**: The specified `id` does not exist or belongs to a different project.

## Important Notes

- **Permanent Action**: Deletion is irreversible -- the automation and all its configuration are permanently removed
- **Schedule Cleanup**: If the automation has an active schedule, it is automatically unscheduled before deletion
- **Due Date Cleanup**: For `DUE_DATE_EXPIRED` triggers, all associated monitoring jobs are removed for both regular todo due dates and custom field due dates
- **Cache Cleanup**: For `CONDITIONAL` automations, the evaluation cache is invalidated upon deletion
- **Batch Deletion**: You can delete multiple automations in a single request using GraphQL aliases as shown in the advanced example
- **Subscription Notification**: A deletion event is published to subscribers, notifying any connected clients

### /api/automations/edit-automation

Source: https://blue.cc/api/automations/edit-automation

## Edit Automation

Update an existing automation by modifying its trigger, actions, or active status. All fields in the input are optional except `automationId`, allowing you to update only the parts you need. When updating actions, the existing actions are replaced entirely with the new set.

### Basic Example

```graphql
mutation EditAutomation {
  editAutomation(
    input: {
      automationId: "automation_abc123"
      isActive: false
    }
  ) {
    id
    isActive
    updatedAt
  }
}
```

### Advanced Example

```graphql
mutation EditAutomationAdvanced {
  editAutomation(
    input: {
      automationId: "automation_abc123"
      isActive: true
      trigger: {
        type: TODO_LIST_CHANGED
        todoListId: "list_new456"
        tagIds: ["tag_789"]
        conditionMode: ANY
      }
      actions: [
        {
          type: ADD_ASSIGNEE
          assigneeIds: ["user_101"]
        }
        {
          type: CHANGE_DUE_DATE
          duedIn: 14
        }
        {
          type: SEND_EMAIL
          metadata: {
            email: {
              to: ["team@example.com"]
              from: "noreply@example.com"
              subject: "Updated automation triggered"
              content: "<p>An automation has been triggered.</p>"
            }
          }
        }
      ]
    }
  ) {
    id
    isActive
    trigger {
      id
      type
      todoList {
        id
        title
      }
      tags {
        id
        title
      }
      conditionMode
    }
    actions {
      id
      type
      duedIn
      assignees {
        id
        name
      }
      metadata {
        ... on AutomationActionMetadataSendEmail {
          email {
            subject
            to
          }
        }
      }
    }
    createdBy {
      id
      name
    }
    updatedAt
  }
}
```

## Input Parameters

### EditAutomationInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `automationId` | String! | Yes | The ID of the automation to update |
| `trigger` | CreateAutomationTriggerInput | No | Updated trigger configuration (replaces the existing trigger) |
| `actions` | [CreateAutomationActionInput!] | No | Updated list of actions (replaces all existing actions) |
| `isActive` | Boolean | No | Set the automation's active state |

The `trigger` and `actions` inputs use the same types as `createAutomation`. See [Create Automation](/api/automations/create-automation) for the full parameter reference for `CreateAutomationTriggerInput` and `CreateAutomationActionInput`.

## Response Fields

The mutation returns the updated `Automation` object.

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the automation |
| `trigger` | AutomationTrigger! | The updated trigger configuration |
| `actions` | [AutomationAction!]! | The updated actions list |
| `isActive` | Boolean! | Current active status |
| `createdBy` | User! | The user who originally created the automation |
| `project` | Project! | The project this automation belongs to |
| `createdAt` | DateTime! | Original creation timestamp |
| `updatedAt` | DateTime! | Timestamp of this update |

## Required Permissions

| Access Level | Can Edit Automations |
|--------------|---------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |

Only owners and admins of an active project can edit automations.

## Error Responses

### Authentication Required
```json
{
  "errors": [{
    "message": "You must be logged in",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```
**When**: No valid authentication token is provided.

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
**When**: The authenticated user does not have OWNER or ADMIN access to the project, or the project is archived.

### Automation Not Found
```json
{
  "errors": [{
    "message": "Automation not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```
**When**: The specified `automationId` does not exist or belongs to a different project.

## Important Notes

- **Partial Updates**: You can update just the `isActive` status without changing the trigger or actions
- **Actions Replacement**: When providing `actions`, the entire set of existing actions is replaced -- there is no way to update individual actions
- **Trigger Update**: The trigger is updated in place, preserving its ID
- **Schedule Management**: Changing a trigger to or from `SCHEDULED` type automatically manages the underlying schedule jobs
- **Due Date Triggers**: Changes to `DUE_DATE_EXPIRED` triggers automatically update monitoring jobs
- **Conditional Automations**: Editing a `CONDITIONAL` automation re-populates its evaluation cache; changing away from `CONDITIONAL` type clears the cache
- **Active Toggle**: Deactivating a scheduled automation pauses its schedule; reactivating it resumes the schedule

### /api/automations/index

Source: https://blue.cc/api/automations/index

## List all Automations

Automations in Blue allow you to create powerful workflows that trigger actions based on specific events. This endpoint retrieves all automations configured for your project, including their triggers, actions, and current status.

### Basic Example

```graphql
query ListAutomations {
  automationList {
    items {
      id
      isActive
      trigger {
        type
        color
      }
      actions {
        type
        color
      }
      createdAt
    }
    pageInfo {
      totalItems
      hasNextPage
    }
  }
}
```

### Advanced Example

```graphql
query ListAutomationsAdvanced {
  automationList(
    filter: {
      customFieldIds: ["field_123", "field_456"]
    }
    skip: 0
    take: 50
  ) {
    items {
      id
      isActive
      createdAt
      updatedAt
      
      # Trigger details
      trigger {
        id
        type
        color
        metadata {
          ... on AutomationTriggerMetadataTodoOverdue {
            incompleteOnly
          }
        }
        customField {
          id
          name
          type
        }
        customFieldOptions {
          id
          title
          color
        }
        todoList {
          id
          title
        }
        tags {
          id
          title
          color
        }
        assignees {
          id
          name
          email
        }
      }
      
      # Action details
      actions {
        id
        type
        color
        duedIn
        assigneeTriggerer
        
        # Action-specific fields
        customField {
          id
          name
        }
        customFieldOptions {
          id
          title
        }
        todoList {
          id
          title
        }
        tags {
          id
          title
        }
        assignees {
          id
          name
        }
        
        # Email action metadata
        metadata {
          ... on AutomationActionMetadataSendEmail {
            email {
              subject
              to
              from
              content
            }
          }
          ... on AutomationActionMetadataCreateChecklist {
            checklists {
              title
              checklistItems {
                title
                duedIn
              }
            }
          }
        }
      }
      
      # Creator info
      createdBy {
        id
        name
        email
      }
    }
    
    pageInfo {
      totalItems
      totalPages
      hasNextPage
      hasPreviousPage
    }
    
    totalCount
  }
}
```

## Input Parameters

### AutomationFilterInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customFieldIds` | [String] | No | Filter automations related to specific custom fields |

### Pagination Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `skip` | Int | No | Number of items to skip (default: 0) |
| `take` | Int | No | Number of items to return (default: 20) |

## Response Fields

### AutomationPagination

| Field | Type | Description |
|-------|------|-------------|
| `items` | [Automation!]! | List of automation objects |
| `pageInfo` | PageInfo! | Pagination information |
| `totalCount` | Int! | Total number of automations |

### Automation

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier |
| `trigger` | AutomationTrigger! | The event that triggers this automation |
| `actions` | [AutomationAction!]! | Actions performed when triggered |
| `isActive` | Boolean! | Whether the automation is currently active |
| `createdBy` | User! | User who created the automation |
| `project` | Project! | Project this automation belongs to |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |

### AutomationTrigger

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier |
| `type` | AutomationTriggerType! | Type of trigger event |
| `color` | String | Associated color (hex format) |
| `metadata` | AutomationTriggerMetadata | Trigger-specific configuration |
| `customField` | CustomField | Related custom field (if applicable) |
| `customFieldOptions` | [CustomFieldOption!] | Selected options for select fields |
| `todos` | [CustomFieldReferenceTodo!] | Referenced todos |
| `todoList` | TodoList | Related todo list |
| `tags` | [Tag!] | Related tags |
| `assignees` | [User!] | Related assignees |

### AutomationAction

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier |
| `type` | AutomationActionType! | Type of action to perform |
| `color` | String | Associated color (hex format) |
| `duedIn` | Int | Days to add for due date actions |
| `assigneeTriggerer` | String | Special assignee identifier |
| `metadata` | AutomationActionMetadata | Action-specific configuration |
| `customField` | CustomField | Target custom field |
| `customFieldOptions` | [CustomFieldOption!] | Options for select fields |
| `todoList` | TodoList | Target todo list |
| `tags` | [Tag!] | Tags to add/remove |
| `assignees` | [User!] | Assignees to add/remove |
| `httpOption` | AutomationActionHttpOption | HTTP request configuration |

## Trigger Types

| Type | Description |
|------|-------------|
| `TODO_CREATED` | When a new record is created |
| `TODO_LIST_CHANGED` | When a record moves between lists |
| `TODO_MARKED_AS_COMPLETE` | When a record is completed |
| `TODO_MARKED_AS_INCOMPLETE` | When a record is uncompleted |
| `ASSIGNEE_ADDED` | When an assignee is added |
| `ASSIGNEE_REMOVED` | When an assignee is removed |
| `DUE_DATE_CHANGED` | When due date is modified |
| `DUE_DATE_REMOVED` | When due date is cleared |
| `DUE_DATE_EXPIRED` | When due date passes |
| `TAG_ADDED` | When a tag is added |
| `TAG_REMOVED` | When a tag is removed |
| `CHECKLIST_ITEM_MARKED_AS_DONE` | When checklist item is completed |
| `CHECKLIST_ITEM_MARKED_AS_UNDONE` | When checklist item is uncompleted |
| `TODO_COPIED_OR_MOVED_FROM_OTHER_PROJECT` | When record is imported |
| `CUSTOM_FIELD_ADDED` | When custom field value is set |
| `CUSTOM_FIELD_REMOVED` | When custom field value is cleared |
| `CUSTOM_FIELD_BUTTON_CLICKED` | When button field is clicked |
| `COLOR_ADDED` | When color is applied |
| `COLOR_REMOVED` | When color is removed |

## Action Types

| Type | Description |
|------|-------------|
| `CHANGE_TODO_LIST` | Move record to different list |
| `MARK_AS_COMPLETE` | Complete the record |
| `MARK_AS_INCOMPLETE` | Uncomplete the record |
| `ADD_ASSIGNEE` | Add assignee(s) |
| `REMOVE_ASSIGNEE` | Remove assignee(s) |
| `ADD_ASSIGNEE_TRIGGERER` | Add user who triggered automation |
| `CHANGE_DUE_DATE` | Set or update due date |
| `REMOVE_DUE_DATE` | Clear due date |
| `ADD_TAG` | Apply tag(s) |
| `REMOVE_TAG` | Remove tag(s) |
| `ADD_COLOR` | Apply color |
| `REMOVE_COLOR` | Remove color |
| `ADD_CUSTOM_FIELD` | Set custom field value |
| `REMOVE_CUSTOM_FIELD` | Clear custom field value |
| `CREATE_CHECKLIST` | Create new checklist |
| `MARK_CHECKLIST_ITEM_AS_DONE` | Complete checklist items |
| `MARK_CHECKLIST_ITEM_AS_UNDONE` | Uncomplete checklist items |
| `COPY_TODO` | Duplicate the record |
| `SEND_EMAIL` | Send email notification |
| `GENERATE_PDF` | Generate PDF document |
| `MAKE_HTTP_REQUEST` | Call external API |

## Required Permissions

Listing automations requires authentication and project access:

| Role | Can List Automations |
|------|---------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |

All authenticated users with project access can view automations.

## Error Responses

### Authentication Required
```json
{
  "errors": [{
    "message": "You must be logged in",
    "extensions": {
      "code": "UNAUTHENTICATED"
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

## Important Notes

- **Ordering**: Automations are always returned newest first (by creation date)
- **Project Scope**: Automations are scoped to the current project context
- **Active Status**: Check `isActive` to determine if an automation is currently running
- **Metadata**: Some triggers and actions have additional metadata for configuration
- **Performance**: Use pagination for projects with many automations
- **Filtering**: Currently only supports filtering by custom field IDs

## checklists

### /api/checklists/checklist-items

Source: https://blue.cc/api/checklists/checklist-items

## Create a Checklist Item

The `createChecklistItem` mutation adds a new item to an existing checklist. Items can later be assigned to users, given due dates, and marked as complete.

### Basic Example

```graphql
mutation CreateChecklistItem {
  createChecklistItem(
    input: {
      checklistId: "clm4n8qwx000008l0checklist1"
      title: "Write unit tests"
      position: 1
    }
  ) {
    id
    title
    position
    done
  }
}
```

### Advanced Example

```graphql
mutation CreateChecklistItemAdvanced {
  createChecklistItem(
    input: {
      checklistId: "clm4n8qwx000008l0checklist1"
      title: "Review deployment configuration"
      position: 3
    }
  ) {
    id
    title
    position
    done
    startedAt
    duedAt
    createdAt
    updatedAt
    createdBy {
      id
      fullName
    }
    checklist {
      id
      title
      todo {
        id
        title
      }
    }
    users {
      id
      fullName
    }
  }
}
```

### CreateChecklistItemInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistId` | String! | Yes | ID of the checklist to add the item to |
| `title` | String! | Yes | Title of the checklist item (HTML is sanitized to plain text) |
| `position` | Float! | Yes | Position of the item within the checklist (used for ordering) |

## Edit a Checklist Item

The `editChecklistItem` mutation allows you to update an item's title, position, completion status, or move it to a different checklist.

### Basic Example

Mark an item as done:

```graphql
mutation MarkItemDone {
  editChecklistItem(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      done: true
    }
  ) {
    id
    title
    done
  }
}
```

### Advanced Example

Update multiple fields and move to a different checklist:

```graphql
mutation EditChecklistItem {
  editChecklistItem(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      checklistId: "clm4n8qwx000008l0checklist2"
      title: "Updated task description"
      position: 2
      done: false
    }
  ) {
    id
    title
    position
    done
    checklist {
      id
      title
    }
    users {
      id
      fullName
    }
  }
}
```

### EditChecklistItemInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistItemId` | String! | Yes | ID of the checklist item to edit |
| `checklistId` | String | No | ID of a different checklist to move this item to |
| `title` | String | No | Updated title (HTML is sanitized to plain text) |
| `position` | Float | No | Updated position within the checklist |
| `done` | Boolean | No | Set to `true` to mark complete, `false` to mark incomplete |

## Delete a Checklist Item

The `deleteChecklistItem` mutation permanently removes a checklist item.

### Basic Example

```graphql
mutation DeleteChecklistItem {
  deleteChecklistItem(id: "clm4n8qwx000008l0item1")
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | ID of the checklist item to delete |

### Response

Returns `Boolean!` -- `true` if the item was successfully deleted.

## Set Checklist Item Assignees

The `setChecklistItemAssignees` mutation sets the full list of users assigned to a checklist item. This replaces any existing assignments -- pass all desired assignee IDs each time.

### Basic Example

```graphql
mutation AssignChecklistItem {
  setChecklistItemAssignees(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      assigneeIds: ["user_123", "user_456"]
    }
  )
}
```

### To Remove All Assignees

```graphql
mutation UnassignAllFromItem {
  setChecklistItemAssignees(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      assigneeIds: []
    }
  )
}
```

### SetChecklistItemAssigneesInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistItemId` | String! | Yes | ID of the checklist item |
| `assigneeIds` | [String!]! | Yes | Array of user IDs to assign. Pass an empty array to remove all assignees |

### Response

Returns `Boolean!` -- `true` if assignees were successfully updated.

## Update Checklist Item Due Date

The `updateChecklistItemDueDate` mutation sets or clears the start and due dates on a checklist item. Setting a due date also schedules an overdue notification.

### Basic Example

Set a due date:

```graphql
mutation SetItemDueDate {
  updateChecklistItemDueDate(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      duedAt: "2025-03-15T17:00:00Z"
    }
  ) {
    id
    title
    startedAt
    duedAt
  }
}
```

### Advanced Example

Set both start and due dates:

```graphql
mutation SetItemDateRange {
  updateChecklistItemDueDate(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      startedAt: "2025-03-10T09:00:00Z"
      duedAt: "2025-03-15T17:00:00Z"
    }
  ) {
    id
    title
    startedAt
    duedAt
    users {
      id
      fullName
    }
  }
}
```

### Remove Due Date

Pass `null` for both fields to clear all dates:

```graphql
mutation RemoveItemDueDate {
  updateChecklistItemDueDate(
    input: {
      checklistItemId: "clm4n8qwx000008l0item1"
      startedAt: null
      duedAt: null
    }
  ) {
    id
    startedAt
    duedAt
  }
}
```

### UpdateChecklistItemDueDateInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistItemId` | String! | Yes | ID of the checklist item |
| `startedAt` | DateTime | No | Start date/time. Pass `null` to clear |
| `duedAt` | DateTime | No | Due date/time. Pass `null` to clear |

## Response Fields

All mutations that return a `ChecklistItem` include these fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the checklist item |
| `title` | String! | Item title |
| `position` | Float! | Position within the checklist |
| `done` | Boolean! | Whether the item is marked as complete |
| `startedAt` | DateTime | Start date/time, if set |
| `duedAt` | DateTime | Due date/time, if set |
| `createdAt` | DateTime! | When the item was created |
| `updatedAt` | DateTime! | When the item was last updated |
| `checklist` | Checklist! | The parent checklist |
| `createdBy` | User! | The user who created the item |
| `users` | [User!]! | Users assigned to this item |

## Required Permissions

All checklist item mutations require the same access level:

| Access Level | Can Manage Checklist Items |
|--------------|---------------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | Yes |
| `CLIENT` | Yes |
| `COMMENT_ONLY` | No |
| `VIEW_ONLY` | No |

## Error Responses

### Permission Denied
```json
{
  "errors": [{
    "message": "You do not have permission to perform this action.",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```
**When**: The user has `VIEW_ONLY` or `COMMENT_ONLY` access, or the workspace is archived.

### Checklist Not Found
```json
{
  "errors": [{
    "message": "Checklist was not found.",
    "extensions": {
      "code": "CHECKLIST_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `checklistId` does not exist or the user lacks access.

### Checklist Item Not Found
```json
{
  "errors": [{
    "message": "Checklist item was not found.",
    "extensions": {
      "code": "CHECKLIST_ITEM_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `checklistItemId` does not exist or the user lacks access.

## Important Notes

### Title Sanitization
- Checklist item titles are automatically sanitized. HTML tags are stripped and the plain text content is stored.

### Completion Status
- Toggling the `done` field on a checklist item triggers automation rules (`CHECKLIST_ITEM_MARKED_AS_DONE` / `CHECKLIST_ITEM_MARKED_AS_UNDONE`).
- The parent record tracks aggregate completion via `checklistCount` and `checklistCompletedCount` fields.

### Assignee Behavior
- `setChecklistItemAssignees` is a **replace** operation -- it sets the exact list of assignees each time.
- Only users who are members of the workspace can be assigned.
- Assigning a user sends them an email and push notification.

### Due Date Behavior
- Setting a due date schedules an automatic overdue notification for assigned users.
- Changing or removing the due date triggers appropriate webhook events (`dueDateAdded`, `dueDateUpdated`, or `dueDateRemoved`).

### Side Effects
All checklist item mutations trigger:
- Activity log entries
- Webhook notifications
- Real-time updates pushed to users viewing the record

### Related Endpoints
- **Create Checklist**: Use `createChecklist` to create a checklist before adding items
- **Edit Checklist**: Use `editChecklist` to rename or reorder the parent checklist
- **Query Checklist Items**: Use the `checklistItems` query to search items across all records

### /api/checklists/index

Source: https://blue.cc/api/checklists/index

## Create a Checklist

The `createChecklist` mutation allows you to add a new checklist to an existing record. Checklists help break down work into smaller, trackable items that can be assigned, scheduled, and marked as complete.

### Basic Example

Create a simple checklist on a record:

```graphql
mutation CreateChecklist {
  createChecklist(
    input: {
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      title: "Launch Checklist"
      position: 1
    }
  ) {
    id
    title
    position
  }
}
```

### Advanced Example

Create a checklist and query back its full details including the parent record:

```graphql
mutation CreateChecklistAdvanced {
  createChecklist(
    input: {
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      title: "QA Verification Steps"
      position: 2
    }
  ) {
    id
    title
    position
    createdAt
    updatedAt
    createdBy {
      id
      fullName
    }
    todo {
      id
      title
    }
    checklistItems {
      id
      title
      done
    }
  }
}
```

## Input Parameters

### CreateChecklistInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | Yes | ID of the record (todo) to attach the checklist to |
| `title` | String! | Yes | Title of the checklist |
| `position` | Float! | Yes | Position of the checklist within the record (used for ordering) |

## Response Fields

The mutation returns a `Checklist` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the checklist |
| `title` | String! | Checklist title |
| `position` | Float! | Position within the record |
| `createdAt` | DateTime! | When the checklist was created |
| `updatedAt` | DateTime! | When the checklist was last updated |
| `todo` | Todo! | The parent record |
| `checklistItems` | [ChecklistItem!]! | Items within the checklist |
| `createdBy` | User! | The user who created the checklist |

## Query Checklist Items

The `checklistItems` query lets you search and paginate through checklist items across your entire organization. This is useful for building dashboards or finding assigned checklist items.

### Basic Example

```graphql
query MyChecklistItems {
  checklistItems(
    filter: {
      assigneeIds: ["user_123"]
      done: false
    }
    skip: 0
    take: 20
  ) {
    items {
      id
      title
      done
      duedAt
      checklist {
        id
        title
      }
    }
    pageInfo {
      hasNextPage
      total
    }
  }
}
```

### Advanced Example

Search for checklist items with sorting and additional filters:

```graphql
query SearchChecklistItems {
  checklistItems(
    filter: {
      q: "deploy"
      done: false
      todoDone: false
      excludeArchivedProjects: true
      assigneeIds: ["user_123", "user_456"]
    }
    sort: [duedAt_ASC]
    skip: 0
    take: 50
  ) {
    items {
      id
      title
      done
      startedAt
      duedAt
      createdAt
      users {
        id
        fullName
      }
      checklist {
        id
        title
        todo {
          id
          title
        }
      }
    }
    pageInfo {
      hasNextPage
      total
    }
  }
}
```

### ChecklistItemFilterInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | String | No | Search query to filter checklist items by title |
| `done` | Boolean | No | Filter by completion status (`true` for done, `false` for not done) |
| `todoDone` | Boolean | No | Filter by the parent record's completion status |
| `excludeArchivedProjects` | Boolean | No | When `true`, excludes items from archived workspaces |
| `assigneeIds` | [String!] | No | Filter to only items assigned to the specified user IDs |

### Sort Options

Checklist items support the following sort values (append `_ASC` or `_DESC`):

| Sort Field | Description |
|------------|-------------|
| `title` | Sort by parent record title |
| `todoListTitle` | Sort by list title |
| `todoListPosition` | Sort by list position |
| `position` | Sort by checklist item position |
| `startedAt` | Sort by start date |
| `duedAt` | Sort by due date |
| `projectName` | Sort by workspace name |
| `checklistTitle` | Sort by checklist title |
| `checklistItemTitle` | Sort by checklist item title |

## Required Permissions

| Access Level | Can Create Checklists |
|--------------|----------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | Yes |
| `CLIENT` | Yes |
| `COMMENT_ONLY` | No |
| `VIEW_ONLY` | No |

## Error Responses

### Permission Denied
```json
{
  "errors": [{
    "message": "You do not have permission to perform this action.",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```
**When**: The user has `VIEW_ONLY` or `COMMENT_ONLY` access, or the workspace is archived.

### Record Not Found
```json
{
  "errors": [{
    "message": "Todo was not found.",
    "extensions": {
      "code": "TODO_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `todoId` does not exist or the user lacks access to it.

## Important Notes

### Side Effects
Creating a checklist triggers:
- Activity log entry (`CREATE_CHECKLIST` action)
- Webhook notification (`todoChecklistCreated`)
- Real-time update pushed to all users viewing the record

### Business Logic
- **Position**: The `position` field determines the ordering of checklists within a record. Use incremental values (e.g., 1, 2, 3) to control display order.
- **Empty Checklists**: Checklists are created without items. Use the `createChecklistItem` mutation to add items after creation.
- **Inline Creation**: Checklists can also be created inline when creating a record via `createTodo` using the `checklists` input field.

### Related Endpoints
- **Create Checklist Item**: Use `createChecklistItem` to add items to a checklist
- **Edit Checklist**: Use `editChecklist` to rename or reorder a checklist
- **Delete Checklist**: Use `deleteChecklist` to remove a checklist and all its items
- **Query Checklist Items**: Use the `checklistItems` query to search items across all records

### /api/checklists/manage-checklist

Source: https://blue.cc/api/checklists/manage-checklist

## Edit a Checklist

The `editChecklist` mutation allows you to rename a checklist or change its position within a record.

### Basic Example

Rename a checklist:

```graphql
mutation RenameChecklist {
  editChecklist(
    input: {
      checklistId: "clm4n8qwx000008l0checklist1"
      title: "Updated Checklist Name"
    }
  ) {
    id
    title
    position
  }
}
```

### Advanced Example

Update both the title and position:

```graphql
mutation EditChecklistAdvanced {
  editChecklist(
    input: {
      checklistId: "clm4n8qwx000008l0checklist1"
      title: "Pre-Release Verification"
      position: 1
    }
  ) {
    id
    title
    position
    createdAt
    updatedAt
    createdBy {
      id
      fullName
    }
    todo {
      id
      title
    }
    checklistItems {
      id
      title
      done
    }
  }
}
```

## Input Parameters

### EditChecklistInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `checklistId` | String! | Yes | ID of the checklist to edit |
| `title` | String | No | New title for the checklist |
| `position` | Float | No | New position within the record (used for ordering) |

## Response Fields

The mutation returns a `Checklist` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the checklist |
| `title` | String! | Checklist title |
| `position` | Float! | Position within the record |
| `createdAt` | DateTime! | When the checklist was created |
| `updatedAt` | DateTime! | When the checklist was last updated |
| `todo` | Todo! | The parent record |
| `checklistItems` | [ChecklistItem!]! | Items within the checklist |
| `createdBy` | User! | The user who created the checklist |

## Delete a Checklist

The `deleteChecklist` mutation permanently removes a checklist and all of its items from a record.

### Basic Example

```graphql
mutation DeleteChecklist {
  deleteChecklist(id: "clm4n8qwx000008l0checklist1")
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | ID of the checklist to delete |

### Response

Returns `Boolean!` -- `true` if the checklist was successfully deleted.

## Required Permissions

| Access Level | Can Edit/Delete Checklists |
|--------------|---------------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | Yes |
| `CLIENT` | Yes |
| `COMMENT_ONLY` | No |
| `VIEW_ONLY` | No |

## Error Responses

### Permission Denied
```json
{
  "errors": [{
    "message": "You do not have permission to perform this action.",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```
**When**: The user has `VIEW_ONLY` or `COMMENT_ONLY` access, or the workspace is archived.

### Checklist Not Found
```json
{
  "errors": [{
    "message": "Checklist was not found.",
    "extensions": {
      "code": "CHECKLIST_NOT_FOUND"
    }
  }]
}
```
**When**: The specified checklist ID does not exist or the user lacks access to the parent record.

## Important Notes

### Destructive Operation
- **Deleting a checklist removes all of its items permanently.** This action cannot be undone. All checklist item assignments, due dates, and completion statuses are lost.

### Side Effects
Editing a checklist triggers:
- Activity log entry (`UPDATE_CHECKLIST` action with old and new titles)
- Webhook notification (`todoChecklistNameChanged`) when the title changes
- Real-time update pushed to all users viewing the record

Deleting a checklist triggers:
- Activity log entry (`DELETE_CHECKLIST` action)
- Webhook notification (`todoChecklistDeleted`)
- Real-time update pushed to all users viewing the record

### Business Logic
- **Partial Updates**: You can update just the `title`, just the `position`, or both in a single call. Only the provided fields are modified.
- **Reordering**: To reorder checklists within a record, update the `position` field. Use fractional values (e.g., 1.5) to insert between existing positions without updating other checklists.

### Related Endpoints
- **Create Checklist**: Use `createChecklist` to add a new checklist to a record
- **Checklist Items**: Use `createChecklistItem`, `editChecklistItem`, and `deleteChecklistItem` to manage items within a checklist
- **Set Assignees**: Use `setChecklistItemAssignees` to assign users to checklist items
- **Set Due Dates**: Use `updateChecklistItemDueDate` to add due dates to checklist items

## custom-fields

### /api/custom-fields/button

Source: https://blue.cc/api/custom-fields/button

Button custom fields provide interactive UI elements that trigger automations when clicked. Unlike other custom field types that store data, button fields serve as action triggers to execute configured workflows.

## Basic Example

Create a simple button field that triggers an automation:

```graphql
mutation CreateButtonField {
  createCustomField(input: {
    name: "Send Invoice"
    type: BUTTON
    projectId: "proj_123"
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a button with confirmation requirements:

```graphql
mutation CreateButtonWithConfirmation {
  createCustomField(input: {
    name: "Delete All Attachments"
    type: BUTTON
    projectId: "proj_123"
    buttonType: "hardConfirmation"
    buttonConfirmText: "DELETE"
    description: "Permanently removes all attachments from this task"
  }) {
    id
    name
    type
    buttonType
    buttonConfirmText
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the button |
| `type` | CustomFieldType! | ✅ Yes | Must be `BUTTON` |
| `projectId` | String! | ✅ Yes | Project ID where the field will be created |
| `buttonType` | String | No | Confirmation behavior (see Button Types below) |
| `buttonConfirmText` | String | No | Text users must type for hard confirmation |
| `description` | String | No | Help text shown to users |
| `required` | Boolean | No | Whether the field is required (defaults to false) |
| `isActive` | Boolean | No | Whether the field is active (defaults to true) |

### Button Type Field

The `buttonType` field is a free-form string that can be used by UI clients to determine confirmation behavior. Common values include:

- `""` (empty) - No confirmation
- `"soft"` - Simple confirmation dialog
- `"hard"` - Require typing confirmation text

**Note**: These are UI hints only. The API does not validate or enforce specific values.

## Triggering Button Clicks

To trigger a button click and execute associated automations:

```graphql
mutation ClickButton {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
  })
}
```

### Click Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the task containing the button |
| `customFieldId` | String! | ✅ Yes | ID of the button custom field |

### Important: API Behavior

**All button clicks through the API execute immediately** regardless of any `buttonType` or `buttonConfirmText` settings. These fields are stored for UI clients to implement confirmation dialogs, but the API itself:

- Does not validate confirmation text
- Does not enforce any confirmation requirements
- Executes the button action immediately when called

Confirmation is purely a client-side UI safety feature.

### Example: Clicking Different Button Types

```graphql
# Button with no confirmation
mutation ClickSimpleButton {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "simple_button_id"
  })
}

# Button with soft confirmation (API call is the same!)
mutation ClickSoftConfirmButton {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "soft_confirm_button_id"
  })
}

# Button with hard confirmation (API call is still the same!)
mutation ClickHardConfirmButton {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "hard_confirm_button_id"
  })
}
```

All three mutations above will execute the button action immediately when called through the API, bypassing any confirmation requirements.

## Response Fields

### Custom Field Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the custom field |
| `name` | String! | Display name of the button |
| `type` | CustomFieldType! | Always `BUTTON` for button fields |
| `buttonType` | String | Confirmation behavior setting |
| `buttonConfirmText` | String | Required confirmation text (if using hard confirmation) |
| `description` | String | Help text for users |
| `required` | Boolean! | Whether the field is required |
| `isActive` | Boolean! | Whether the field is currently active |
| `projectId` | String! | ID of the project this field belongs to |
| `createdAt` | DateTime! | When the field was created |
| `updatedAt` | DateTime! | When the field was last modified |

## How Button Fields Work

### Automation Integration

Button fields are designed to work with Blue's automation system:

1. **Create the button field** using the mutation above
2. **Configure automations** that listen for `CUSTOM_FIELD_BUTTON_CLICKED` events
3. **Users click the button** in the UI
4. **Automations execute** the configured actions

### Event Flow

When a button is clicked:

```
User Click → setTodoCustomField mutation → CUSTOM_FIELD_BUTTON_CLICKED event → Automation execution
```

### No Data Storage

Important: Button fields don't store any value data. They purely serve as action triggers. Each click:
- Generates an event
- Triggers associated automations
- Records an action in the task history
- Does not modify any field value

## Required Permissions

Users need appropriate project roles to create and use button fields:

| Action | Required Role |
|--------|-------------------|
| Create button field | `OWNER` or `ADMIN` at project level |
| Update button field | `OWNER` or `ADMIN` at project level |
| Click button | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` (based on field permissions) |
| Configure automations | `OWNER` or `ADMIN` at project level |

## Error Responses

### Permission Denied
```json
{
  "errors": [{
    "message": "You don't have permission to edit this custom field",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Custom Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

**Note**: The API does not return specific errors for missing automations or confirmation mismatches.

## Best Practices

### Naming Conventions
- Use action-oriented names: "Send Invoice", "Create Report", "Notify Team"
- Be specific about what the button does
- Avoid generic names like "Button 1" or "Click Here"

### Confirmation Settings
- Leave `buttonType` empty for safe, reversible actions
- Set `buttonType` to suggest confirmation behavior to UI clients
- Use `buttonConfirmText` to specify what users should type in UI confirmations
- Remember: These are UI hints only - API calls always execute immediately

### Automation Design
- Keep button actions focused on a single workflow
- Provide clear feedback about what happened after clicking
- Consider adding description text to explain the button's purpose

## Common Use Cases

1. **Workflow Transitions**
   - "Mark as Complete"
   - "Send for Approval"
   - "Archive Task"

2. **External Integrations**
   - "Sync to CRM"
   - "Generate Invoice"
   - "Send Email Update"

3. **Batch Operations**
   - "Update All Subtasks"
   - "Copy to Projects"
   - "Apply Template"

4. **Reporting Actions**
   - "Generate Report"
   - "Export Data"
   - "Create Summary"

## Limitations

- Buttons cannot store or display data values
- Each button can only trigger automations, not direct API calls (however, automations can include HTTP request actions to call external APIs or Blue's own APIs)
- Button visibility cannot be conditionally controlled
- Maximum of one automation execution per click (though that automation can trigger multiple actions)

## Related Resources

- [Automations API](/api/automations/index) - Configure actions triggered by buttons
- [Custom Fields Overview](/custom-fields/list-custom-fields) - General custom field concepts

### /api/custom-fields/checkbox

Source: https://blue.cc/api/custom-fields/checkbox

Checkbox custom fields provide a simple boolean (true/false) input for tasks. They're perfect for binary choices, status indicators, or tracking whether something has been completed.

## Basic Example

Create a simple checkbox field:

```graphql
mutation CreateCheckboxField {
  createCustomField(input: {
    name: "Reviewed"
    type: CHECKBOX
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a checkbox field with description and validation:

```graphql
mutation CreateDetailedCheckbox {
  createCustomField(input: {
    name: "Customer Approved"
    type: CHECKBOX
    description: "Check this box when the customer has approved the work"
  }) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the checkbox |
| `type` | CustomFieldType! | ✅ Yes | Must be `CHECKBOX` |
| `description` | String | No | Help text shown to users |

## Setting Checkbox Values

To set or update a checkbox value on a task:

```graphql
mutation CheckTheBox {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    checked: true
  })
}
```

To uncheck a checkbox:

```graphql
mutation UncheckTheBox {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    checked: false
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the task to update |
| `customFieldId` | String! | ✅ Yes | ID of the checkbox custom field |
| `checked` | Boolean | No | True to check, false to uncheck |

## Creating Tasks with Checkbox Values

When creating a new task with checkbox values:

```graphql
mutation CreateTaskWithCheckbox {
  createTodo(input: {
    title: "Review contract"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "checkbox_field_id"
      value: "true"  # Pass as string
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      checked
    }
  }
}
```

### Accepted String Values

When creating tasks, checkbox values must be passed as strings:

| String Value | Result |
|--------------|---------|
| `"true"` | ✅ Checked (case-sensitive) |
| `"1"` | ✅ Checked |
| `"checked"` | ✅ Checked (case-sensitive) |
| Any other value | ❌ Unchecked |

**Note**: String comparisons during task creation are case-sensitive. The values must exactly match `"true"`, `"1"`, or `"checked"` to result in a checked state.

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the field value |
| `uid` | String! | Alternative unique identifier |
| `customField` | CustomField! | The custom field definition |
| `checked` | Boolean | The checkbox state (true/false/null) |
| `todo` | Todo! | The task this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

## Automation Integration

Checkbox fields trigger different automation events based on state changes:

| Action | Event Triggered | Description |
|--------|----------------|-------------|
| Check (false → true) | `CUSTOM_FIELD_ADDED` | Triggered when checkbox is checked |
| Uncheck (true → false) | `CUSTOM_FIELD_REMOVED` | Triggered when checkbox is unchecked |

This allows you to create automations that respond to checkbox state changes, such as:
- Sending notifications when items are approved
- Moving tasks when review checkboxes are checked
- Updating related fields based on checkbox states

## Data Import/Export

### Importing Checkbox Values

When importing data via CSV or other formats:
- `"true"`, `"yes"` → Checked (case-insensitive)
- Any other value (including `"false"`, `"no"`, `"0"`, empty) → Unchecked

### Exporting Checkbox Values

When exporting data:
- Checked boxes export as `"X"`
- Unchecked boxes export as empty string `""`

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create checkbox field | `OWNER` or `ADMIN` role at project level |
| Update checkbox field | `OWNER` or `ADMIN` role at project level |
| Set checkbox value | Standard task edit permissions (excluding VIEW_ONLY and COMMENT_ONLY roles) |
| View checkbox value | Standard task view permissions (authenticated users in company/project) |

## Error Responses

### Invalid Value Type
```json
{
  "errors": [{
    "message": "Invalid value type for checkbox field",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

## Best Practices

### Naming Conventions
- Use clear, action-oriented names: "Approved", "Reviewed", "Is Complete"
- Avoid negative names that confuse users: prefer "Is Active" over "Is Inactive"
- Be specific about what the checkbox represents

### When to Use Checkboxes
- **Binary choices**: Yes/No, True/False, Done/Not Done
- **Status indicators**: Approved, Reviewed, Published
- **Feature flags**: Has Priority Support, Requires Signature
- **Simple tracking**: Email Sent, Invoice Paid, Item Shipped

### When NOT to Use Checkboxes
- When you need more than two options (use SELECT_SINGLE instead)
- For numeric or text data (use NUMBER or TEXT fields)
- When you need to track who checked it or when (use audit logs)

## Common Use Cases

1. **Approval Workflows**
   - "Manager Approved"
   - "Client Sign-off"
   - "Legal Review Complete"

2. **Task Management**
   - "Is Blocked"
   - "Ready for Review"
   - "High Priority"

3. **Quality Control**
   - "QA Passed"
   - "Documentation Complete"
   - "Tests Written"

4. **Administrative Flags**
   - "Invoice Sent"
   - "Contract Signed"
   - "Follow-up Required"

## Limitations

- Checkbox fields can only store true/false values (no tri-state or null after initial set)
- No default value configuration (always starts as null until set)
- Cannot store additional metadata like who checked it or when
- No conditional visibility based on other field values

## Related Resources

- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General custom field concepts
- [Automations API](/api/automations) - Create automations triggered by checkbox changes

### /api/custom-fields/country

Source: https://blue.cc/api/custom-fields/country

Country custom fields allow you to store and manage country information for records. The field supports both country names and ISO Alpha-2 country codes.

**Important**: Country validation and conversion behavior differs significantly between mutations:
- **createTodo**: Automatically validates and converts country names to ISO codes
- **setTodoCustomField**: Accepts any value without validation

## Basic Example

Create a simple country field:

```graphql
mutation CreateCountryField {
  createCustomField(input: {
    name: "Country of Origin"
    type: COUNTRY
    projectId: "proj_123"
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a country field with description:

```graphql
mutation CreateDetailedCountryField {
  createCustomField(input: {
    name: "Customer Location"
    type: COUNTRY
    projectId: "proj_123"
    description: "Primary country where the customer is located"
    isActive: true
  }) {
    id
    name
    type
    description
    isActive
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the country field |
| `type` | CustomFieldType! | ✅ Yes | Must be `COUNTRY` |
| `description` | String | No | Help text shown to users |

**Note**: The `projectId` is not passed in the input but is determined by the GraphQL context (typically from request headers or authentication).

## Setting Country Values

Country fields store data in two database fields:
- **`countryCodes`**: Stores ISO Alpha-2 country codes as a comma-separated string in the database (returned as array via API)
- **`text`**: Stores display text or country names as a string

### Understanding the Parameters

The `setTodoCustomField` mutation accepts two optional parameters for country fields:

| Parameter | Type | Required | Description | What it does |
|-----------|------|----------|-------------|--------------|
| `todoId` | String! | ✅ Yes | ID of the record to update | - |
| `customFieldId` | String! | ✅ Yes | ID of the country custom field | - |
| `countryCodes` | [String!] | No | Array of ISO Alpha-2 country codes | Stored in the `countryCodes` field |
| `text` | String | No | Display text or country names | Stored in the `text` field |

**Important**: 
- In `setTodoCustomField`: Both parameters are optional and stored independently
- In `createTodo`: The system automatically sets both fields based on your input (you cannot control them independently)

### Option 1: Using Only Country Codes

Store validated ISO codes without display text:

```graphql
mutation SetCountryByCode {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    countryCodes: ["US"]
  })
}
```

Result: `countryCodes` = `["US"]`, `text` = `null`

### Option 2: Using Only Text

Store display text without validated codes:

```graphql
mutation SetCountryByText {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    text: "United States"
  })
}
```

Result: `countryCodes` = `null`, `text` = `"United States"`

**Note**: When using `setTodoCustomField`, no validation occurs regardless of which parameter you use. The values are stored exactly as provided.

### Option 3: Using Both (Recommended)

Store both validated codes and display text:

```graphql
mutation SetCountryComplete {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    countryCodes: ["US"]
    text: "United States"
  })
}
```

Result: `countryCodes` = `["US"]`, `text` = `"United States"`

### Multiple Countries

Store multiple countries using arrays:

```graphql
mutation SetMultipleCountries {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    countryCodes: ["US", "CA", "MX"]
    text: "North American Markets"  # Can be any descriptive text
  })
}
```

## Creating Records with Country Values

When creating records, the `createTodo` mutation **automatically validates and converts** country values. This is the only mutation that performs country validation:

```graphql
mutation CreateRecordWithCountry {
  createTodo(input: {
    title: "International Client"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "country_field_id"
      value: "France"  # Can use country name or code
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      text
      countryCodes
    }
  }
}
```

### Accepted Input Formats

| Input Type | Example | Result |
|------------|---------|---------|
| Country Name | `"United States"` | Stored as `US` |
| ISO Alpha-2 Code | `"GB"` | Stored as `GB` |
| Multiple (comma-separated) | `"US, CA"` | **Not supported** - treated as single invalid value |
| Mixed format | `"United States, CA"` | **Not supported** - treated as single invalid value |

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `text` | String | Display text (country names) |
| `countryCodes` | [String!] | Array of ISO Alpha-2 country codes |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

## Country Standards

Blue uses the **ISO 3166-1 Alpha-2** standard for country codes:

- Two-letter country codes (e.g., US, GB, FR, DE)
- Validation using the `i18n-iso-countries` library **only occurs in createTodo**
- Supports all officially recognized countries

### Example Country Codes

| Country | ISO Code |
|---------|----------|
| United States | `US` |
| United Kingdom | `GB` |
| Canada | `CA` |
| Germany | `DE` |
| France | `FR` |
| Japan | `JP` |
| Australia | `AU` |
| Brazil | `BR` |

For the complete official list of ISO 3166-1 alpha-2 country codes, visit the [ISO Online Browsing Platform](https://www.iso.org/obp/ui/#search/code/).

## Validation

**Validation only occurs in the `createTodo` mutation**:

1. **Valid ISO Code**: Accepts any valid ISO Alpha-2 code
2. **Country Name**: Automatically converts recognized country names to codes
3. **Invalid Input**: Throws `CustomFieldValueParseError` for unrecognized values

**Note**: The `setTodoCustomField` mutation performs NO validation and accepts any string value.

### Error Example

```json
{
  "errors": [{
    "message": "Invalid country value.",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

## Integration Features

### Lookup Fields
Country fields can be referenced by LOOKUP custom fields, allowing you to pull country data from related records.

### Automations
Use country values in automation conditions:
- Filter actions by specific countries
- Send notifications based on country
- Route tasks based on geographic regions

### Forms
Country fields in forms automatically validate user input and convert country names to codes.

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create country field | Project `OWNER` or `ADMIN` role |
| Update country field | Project `OWNER` or `ADMIN` role |
| Set country value | Standard record edit permissions |
| View country value | Standard record view permissions |

## Error Responses

### Invalid Country Value
```json
{
  "errors": [{
    "message": "Invalid country value provided",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

### Field Type Mismatch
```json
{
  "errors": [{
    "message": "Field type mismatch: expected COUNTRY",
    "extensions": {
      "code": "INVALID_FIELD_TYPE"
    }
  }]
}
```

## Best Practices

### Input Handling
- Use `createTodo` for automatic validation and conversion
- Use `setTodoCustomField` carefully as it bypasses validation
- Consider validating inputs in your application before using `setTodoCustomField`
- Display full country names in UI for clarity

### Data Quality
- Validate country inputs at entry point
- Use consistent formats across your system
- Consider regional groupings for reporting

### Multiple Countries
- Use array support in `setTodoCustomField` for multiple countries
- Multiple countries in `createTodo` are **not supported** via the value field
- Store country codes as array in `setTodoCustomField` for proper handling

## Common Use Cases

1. **Customer Management**
   - Customer headquarters location
   - Shipping destinations
   - Tax jurisdictions

2. **Project Tracking**
   - Project location
   - Team member locations
   - Market targets

3. **Compliance & Legal**
   - Regulatory jurisdictions
   - Data residency requirements
   - Export controls

4. **Sales & Marketing**
   - Territory assignments
   - Market segmentation
   - Campaign targeting

## Limitations

- Only supports ISO 3166-1 Alpha-2 codes (2-letter codes)
- No built-in support for country subdivisions (states/provinces)
- No automatic country flag icons (text-based only)
- Cannot validate historical country codes
- No built-in region or continent grouping
- **Validation only works in `createTodo`, not in `setTodoCustomField`**
- **Multiple countries not supported in `createTodo` value field**
- **Country codes stored as comma-separated string, not true array**

## Related Resources

- [Custom Fields Overview](/custom-fields/list-custom-fields) - General custom field concepts
- [Lookup Fields](/api/custom-fields/lookup) - Reference country data from other records
- [Forms API](/api/forms) - Include country fields in custom forms

### /api/custom-fields/create-custom-fields

Source: https://blue.cc/api/custom-fields/create-custom-fields

## Create a Custom Field

Custom fields allow you to tailor Blue to your specific business needs by adding structured data fields to your records. This endpoint creates a new custom field with configurations specific to each field type.

### Basic Example

```graphql
mutation CreateTextField {
  createCustomField(input: {
    name: "Customer Name"
    type: TEXT_SINGLE
    description: "Primary customer contact name"
  }) {
    id
    uid
    name
    type
    position
  }
}
```

### Advanced Example

```graphql
mutation CreateAdvancedField {
  createCustomField(input: {
    name: "Project Budget"
    type: CURRENCY
    description: "Total allocated budget for this project"
    currency: "USD"
    min: 0
    max: 1000000
  }) {
    id
    uid
    name
    type
    currency
    min
    max
    position
    createdAt
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | The display name of the custom field |
| `type` | CustomFieldType! | ✅ Yes | The field type (see types below) |
| `description` | String | No | Optional description explaining the field's purpose |
| `min` | Float | No | Minimum value for NUMBER, RATING, PERCENT fields |
| `max` | Float | No | Maximum value for NUMBER, RATING, PERCENT fields |
| `currency` | String | No | ISO currency code for CURRENCY fields |
| `prefix` | String | No | Text prefix for UNIQUE_ID fields |
| `isDueDate` | Boolean | No | Whether DATE field represents a due date |
| `formula` | JSON | No | Formula configuration for FORMULA fields |
| `referenceProjectId` | String | No | Target project ID for REFERENCE fields |
| `referenceMultiple` | Boolean | No | Allow multiple selections in REFERENCE fields |
| `referenceFilter` | TodoFilterInput | No | Filter options for REFERENCE fields |
| `lookupOption` | CustomFieldLookupOptionInput | No | Configuration for LOOKUP fields |
| `timeDurationDisplay` | CustomFieldTimeDurationDisplayType | No | Display format for TIME_DURATION |
| `timeDurationTargetTime` | Float | No | Target time in seconds for TIME_DURATION |
| `timeDurationStartInput` | CustomFieldTimeDurationInput | No | Start trigger for TIME_DURATION |
| `timeDurationEndInput` | CustomFieldTimeDurationInput | No | End trigger for TIME_DURATION |
| `buttonType` | String | No | Button action type for BUTTON fields |
| `buttonConfirmText` | String | No | Confirmation prompt for BUTTON fields |
| `useSequenceUniqueId` | Boolean | No | Use sequential numbering for UNIQUE_ID |
| `sequenceDigits` | Int | No | Number of digits in sequence (e.g., 5 → 00001) |
| `sequenceStartingNumber` | Int | No | Starting number for sequence |
| `currencyFieldId` | String | No | Reference currency field for CURRENCY_CONVERSION |
| `conversionDate` | String | No | Conversion date for CURRENCY_CONVERSION |
| `conversionDateType` | String | No | Type of conversion date for CURRENCY_CONVERSION |
| `metadata` | JSON | No | Additional metadata for the custom field |

### CustomFieldType Values

| Value | Description | Required Parameters |
|-------|-------------|-------------------|
| `TEXT_SINGLE` | Single line text input | None |
| `TEXT_MULTI` | Multi-line text area | None |
| `SELECT_SINGLE` | Single selection dropdown | Create options separately |
| `SELECT_MULTI` | Multiple selection dropdown | Create options separately |
| `CHECKBOX` | Boolean checkbox | None |
| `RATING` | Star rating field | Optional: `max` (default: 5) |
| `PHONE` | Phone number with validation | None |
| `NUMBER` | Numeric input | Optional: `min`, `max` |
| `CURRENCY` | Currency amount | Optional: `currency`, `min`, `max` |
| `PERCENT` | Percentage (0-100) | Optional: `min`, `max` |
| `EMAIL` | Email with validation | None |
| `URL` | Web URL with validation | None |
| `UNIQUE_ID` | Auto-generated identifier | Optional: `prefix`, `useSequenceUniqueId` |
| `LOCATION` | Geographic coordinates | None |
| `FILE` | File attachment | None |
| `DATE` | Date picker | Optional: `isDueDate` |
| `COUNTRY` | Country selector | None |
| `FORMULA` | Calculated field | Required: `formula` |
| `REFERENCE` | Link to other records | Required: `referenceProjectId` |
| `LOOKUP` | Pull data from references | Required: `lookupOption` |
| `TIME_DURATION` | Time tracking | Required: duration inputs (see below) |
| `BUTTON` | Action button | Optional: `buttonType`, `buttonConfirmText` |
| `CURRENCY_CONVERSION` | Currency converter | Special configuration |

## Field Type Configuration Examples

### Number Field with Constraints
```graphql
mutation CreateQuantityField {
  createCustomField(input: {
    name: "Quantity"
    type: NUMBER
    description: "Number of items"
    min: 1
    max: 999
  }) {
    id
    name
    min
    max
  }
}
```

### Currency Field
```graphql
mutation CreateBudgetField {
  createCustomField(input: {
    name: "Budget"
    type: CURRENCY
    currency: "EUR"
    min: 0
  }) {
    id
    name
    currency
    min
  }
}
```

### Date Field with Due Date Flag
```graphql
mutation CreateDeadlineField {
  createCustomField(input: {
    name: "Project Deadline"
    type: DATE
    isDueDate: true
    description: "When this project must be completed"
  }) {
    id
    name
    isDueDate
  }
}
```

### Reference Field
```graphql
mutation CreateRelatedTasksField {
  createCustomField(input: {
    name: "Dependencies"
    type: REFERENCE
    referenceProjectId: "proj_abc123"
    referenceMultiple: true
    referenceFilter: {
      statusIds: ["status_open", "status_inprogress"]
    }
  }) {
    id
    name
    referenceProjectId
    referenceMultiple
  }
}
```

### Lookup Field
```graphql
mutation CreateLookupField {
  createCustomField(input: {
    name: "Customer Email"
    type: LOOKUP
    lookupOption: {
      referenceId: "field_customer_ref"
      lookupId: "field_email"
      lookupType: TODO_CUSTOM_FIELD
    }
  }) {
    id
    name
    customFieldLookupOption {
      referenceId
      lookupId
      lookupType
    }
  }
}
```

### Unique ID with Sequence
```graphql
mutation CreateOrderNumberField {
  createCustomField(input: {
    name: "Order Number"
    type: UNIQUE_ID
    prefix: "ORD-"
    useSequenceUniqueId: true
    sequenceDigits: 6
    sequenceStartingNumber: 1000
  }) {
    id
    name
    prefix
  }
}
```

### Time Duration Field
```graphql
mutation CreateTimeTrackingField {
  createCustomField(input: {
    name: "Time to Resolution"
    type: TIME_DURATION
    timeDurationDisplay: FULL_DATE_STRING
    timeDurationStartInput: {
      type: TODO_CREATED_AT
      condition: FIRST
    }
    timeDurationEndInput: {
      type: TODO_MARKED_AS_COMPLETE
      condition: FIRST
    }
  }) {
    id
    name
  }
}
```

#### Valid Time Duration Types
- `TODO_CREATED_AT` - When the record was created
- `TODO_CUSTOM_FIELD` - When a custom field changes
- `TODO_DUE_DATE` - When due date is set/changed
- `TODO_MARKED_AS_COMPLETE` - When record is marked complete
- `TODO_MOVED` - When record is moved to different list
- `TODO_TAG_ADDED` - When a tag is added
- `TODO_ASSIGNEE_ADDED` - When an assignee is added

## Creating Select Options

After creating a SELECT_SINGLE or SELECT_MULTI field, add options:

```graphql
mutation CreateSelectOptions {
  createCustomFieldOptions(input: {
    customFieldId: "field_xyz789"
    customFieldOptions: [
      { title: "High", color: "#FF0000", position: 1 }
      { title: "Medium", color: "#FFA500", position: 2 }
      { title: "Low", color: "#00FF00", position: 3 }
    ]
  }) {
    id
    title
    color
    position
  }
}
```

## Response Fields

### CustomField

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier |
| `uid` | String! | User-friendly unique ID |
| `name` | String! | Display name |
| `type` | CustomFieldType! | Field type |
| `description` | String | Field description |
| `position` | Float! | Display order position |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |
| `min` | Float | Minimum value (if applicable) |
| `max` | Float | Maximum value (if applicable) |
| `currency` | String | Currency code (CURRENCY type) |
| `prefix` | String | ID prefix (UNIQUE_ID type) |
| `isDueDate` | Boolean | Due date flag (DATE type) |
| `formula` | JSON | Formula config (FORMULA type) |
| `referenceProjectId` | String | Referenced project (REFERENCE type) |
| `customFieldLookupOption` | CustomFieldLookupOption | Lookup config (LOOKUP type) |

## Required Permissions

Creating custom fields requires project access:

| Role | Can Create Custom Fields |
|------|-------------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ❌ No |

Note: Custom roles may have additional restrictions on field management.

## Error Responses

### Invalid Field Type
```json
{
  "errors": [{
    "message": "Variable \"$input\" got invalid value \"INVALID\" at \"input.type\"; Value \"INVALID\" does not exist in \"CustomFieldType\" enum.",
    "extensions": {
      "code": "GRAPHQL_VALIDATION_FAILED"
    }
  }]
}
```

### Reference Project Not Found
```json
{
  "errors": [{
    "message": "Reference project not found or access denied",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```

### Missing Required Configuration
```json
{
  "errors": [{
    "message": "REFERENCE fields require referenceProjectId",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Important Notes

- **Field Position**: Automatically calculated to appear at the end of existing fields
- **Field Limits**: Projects may have limits on the number of custom fields
- **Immediate Availability**: Created fields are immediately available for use
- **Side Effects**: Creating a field triggers:
  - Activity log entry
  - Real-time updates to connected users
  - Webhook notifications
  - Background jobs for FORMULA, LOOKUP, and UNIQUE_ID fields
- **Special Considerations**:
  - **REFERENCE** fields require access to the target project
  - **LOOKUP** fields depend on existing REFERENCE fields
  - **FORMULA** fields cannot reference themselves
  - **UNIQUE_ID** sequences process asynchronously
  - **SELECT** fields need options created separately
- **Naming**: Field names should be clear and descriptive as they appear in the UI

## Related Endpoints

- [List Custom Fields](/api/custom-fields/list-custom-fields) - View existing custom fields
- [Update Custom Field](/api/custom-fields/update-custom-field) - Modify field properties
- [Delete Custom Field](/api/custom-fields/delete-custom-field) - Remove a custom field
- [Create Field Options](/api/custom-fields/create-field-options) - Add options to select fields
- [Set Custom Field Values](/api/custom-fields/custom-field-values) - Set values on records

### /api/custom-fields/currency-conversion

Source: https://blue.cc/api/custom-fields/currency-conversion

Currency Conversion custom fields automatically convert values from a source CURRENCY field to different target currencies using real-time exchange rates. These fields update automatically whenever the source currency value changes.

The conversion rates are provided by the [Frankfurter API](https://github.com/hakanensari/frankfurter), an open-source service that tracks reference exchange rates published by the [European Central Bank](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html). This ensures accurate, reliable, and up-to-date currency conversions for your international business needs.

## Basic Example

Create a simple currency conversion field:

```graphql
mutation CreateCurrencyConversionField {
  createCustomField(input: {
    name: "Price in EUR"
    type: CURRENCY_CONVERSION
    currencyFieldId: "source_currency_field_id"
    conversionDateType: "currentDate"
  }) {
    id
    name
    type
    currencyFieldId
    conversionDateType
  }
}
```

## Advanced Example

Create a conversion field with a specific date for historical rates:

```graphql
mutation CreateHistoricalConversionField {
  createCustomField(input: {
    name: "Q1 Budget in Local Currency"
    type: CURRENCY_CONVERSION
    currencyFieldId: "budget_field_id"
    conversionDateType: "specificDate"
    conversionDate: "2024-01-01T00:00:00Z"
    description: "Budget converted at Q1 exchange rates"
  }) {
    id
    name
    type
    currencyFieldId
    conversionDateType
    conversionDate
  }
}
```

## Complete Setup Process

Setting up a currency conversion field requires three steps:

### Step 1: Create a Source CURRENCY Field

```graphql
mutation CreateSourceCurrencyField {
  createCustomField(input: {
    name: "Contract Value"
    type: CURRENCY
    currency: "USD"
  }) {
    id  # Save this ID for Step 2
    name
    type
  }
}
```

### Step 2: Create the CURRENCY_CONVERSION Field

```graphql
mutation CreateConversionField {
  createCustomField(input: {
    name: "Contract Value (Local Currency)"
    type: CURRENCY_CONVERSION
    currencyFieldId: "source_field_id_from_step_1"
    conversionDateType: "currentDate"
  }) {
    id  # Save this ID for Step 3
    name
    type
  }
}
```

### Step 3: Create Conversion Options

```graphql
mutation CreateConversionOptions {
  createCustomFieldOptions(input: {
    customFieldId: "conversion_field_id_from_step_2"
    customFieldOptions: [
      {
        title: "USD to EUR"
        currencyConversionFrom: "USD"
        currencyConversionTo: "EUR"
      },
      {
        title: "USD to GBP"
        currencyConversionFrom: "USD"
        currencyConversionTo: "GBP"
      },
      {
        title: "Any to JPY"
        currencyConversionFrom: "Any"
        currencyConversionTo: "JPY"
      }
    ]
  }) {
    id
    title
    currencyConversionFrom
    currencyConversionTo
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the conversion field |
| `type` | CustomFieldType! | ✅ Yes | Must be `CURRENCY_CONVERSION` |
| `currencyFieldId` | String | No | ID of the source CURRENCY field to convert from |
| `conversionDateType` | String | No | Date strategy for exchange rates (see below) |
| `conversionDate` | String | No | Date string for conversion (based on conversionDateType) |
| `description` | String | No | Help text shown to users |

**Note**: Custom fields are automatically associated with the project based on the user's current project context. No `projectId` parameter is required.

### Conversion Date Types

| Type | Description | conversionDate Parameter |
|------|-------------|-------------------------|
| `currentDate` | Uses real-time exchange rates | Not required |
| `specificDate` | Uses rates from a fixed date | ISO date string (e.g., "2024-01-01T00:00:00Z") |
| `fromDateField` | Uses date from another field | "todoDueDate" or DATE field ID |

## Creating Conversion Options

Conversion options define which currency pairs can be converted:

### CreateCustomFieldOptionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customFieldId` | String! | ✅ Yes | ID of the CURRENCY_CONVERSION field |
| `title` | String! | ✅ Yes | Display name for this conversion option |
| `currencyConversionFrom` | String! | ✅ Yes | Source currency code or "Any" |
| `currencyConversionTo` | String! | ✅ Yes | Target currency code |

### Using "Any" as Source

The special value "Any" as `currencyConversionFrom` creates a fallback option:

```graphql
mutation CreateUniversalConversion {
  createCustomFieldOption(input: {
    customFieldId: "conversion_field_id"
    title: "Any currency to EUR"
    currencyConversionFrom: "Any"
    currencyConversionTo: "EUR"
  }) {
    id
  }
}
```

This option will be used when no specific currency pair match is found.

## How Automatic Conversion Works

1. **Value Update**: When a value is set in the source CURRENCY field
2. **Option Matching**: System finds matching conversion option based on source currency
3. **Rate Fetching**: Retrieves exchange rate from Frankfurter API
4. **Calculation**: Multiplies source amount by exchange rate
5. **Storage**: Saves converted value with target currency code

### Example Flow

```graphql
# 1. Set value in source CURRENCY field
mutation SetSourceValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "source_currency_field_id"
    number: 1000
    currency: "USD"
  })
}

# 2. CURRENCY_CONVERSION fields automatically update
# If you have USD→EUR and USD→GBP options configured,
# both conversion fields will calculate and store their values
```

## Date-Based Conversions

### Using Current Date

```graphql
mutation CreateRealtimeConversion {
  createCustomField(input: {
    name: "Current EUR Value"
    type: CURRENCY_CONVERSION
    currencyFieldId: "source_field_id"
    conversionDateType: "currentDate"
  })
}
```

Conversions update with current exchange rates each time the source value changes.

### Using Specific Date

```graphql
mutation CreateFixedDateConversion {
  createCustomField(input: {
    name: "Year-End 2023 Value"
    type: CURRENCY_CONVERSION
    currencyFieldId: "source_field_id"
    conversionDateType: "specificDate"
    conversionDate: "2023-12-31T00:00:00Z"
  })
}
```

Always uses exchange rates from the specified date.

### Using Date from Field

```graphql
mutation CreateDateFieldConversion {
  createCustomField(input: {
    name: "Value at Contract Date"
    type: CURRENCY_CONVERSION
    currencyFieldId: "source_field_id"
    conversionDateType: "fromDateField"
    conversionDate: "contract_date_field_id"  # ID of a DATE custom field
  })
}
```

Uses the date from another field (either todo due date or a DATE custom field).

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The conversion field definition |
| `number` | Float | The converted amount |
| `currency` | String | The target currency code |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last updated |

## Exchange Rate Source

Blue uses the **Frankfurter API** for exchange rates:
- Open-source API hosted by the European Central Bank
- Updates daily with official exchange rates
- Supports historical rates back to 1999
- Free and reliable for business use

## Error Handling

### Conversion Failures

When conversion fails (API error, invalid currency, etc.):
- The converted value is set to `0`
- The target currency is still stored
- No error is thrown to the user

### Common Scenarios

| Scenario | Result |
|----------|---------|
| Same currency (USD→USD) | Value copied without API call |
| Invalid currency code | Conversion returns 0 |
| API unavailable | Conversion returns 0 |
| No matching option | Uses "Any" option if available |
| Missing source value | No conversion performed |

## Required Permissions

Custom field management requires project-level access:

| Role | Can Create/Update Fields |
|------|-------------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |
| `CLIENT` | ❌ No |

View permissions for converted values follow standard record access rules.

## Best Practices

### Option Configuration
- Create specific currency pairs for common conversions
- Add an "Any" fallback option for flexibility
- Use descriptive titles for options

### Date Strategy Selection
- Use `currentDate` for live financial tracking
- Use `specificDate` for historical reporting
- Use `fromDateField` for transaction-specific rates

### Performance Considerations
- Multiple conversion fields update in parallel
- API calls are made only when source value changes
- Same-currency conversions skip API calls

## Common Use Cases

1. **Multi-Currency Projects**
   - Track project costs in local currencies
   - Report total budget in company currency
   - Compare values across regions

2. **International Sales**
   - Convert deal values to reporting currency
   - Track revenue in multiple currencies
   - Historical conversion for closed deals

3. **Financial Reporting**
   - Period-end currency conversions
   - Consolidated financial statements
   - Budget vs. actual in local currency

4. **Contract Management**
   - Convert contract values at signing date
   - Track payment schedules in multiple currencies
   - Currency risk assessment

## Limitations

- No support for cryptocurrency conversions
- Cannot set converted values manually (always calculated)
- Fixed 2 decimal places precision for all converted amounts
- No support for custom exchange rates
- No caching of exchange rates (fresh API call for each conversion)
- Depends on Frankfurter API availability

## Related Resources

- [Currency Fields](/api/custom-fields/currency) - Source fields for conversions
- [Date Fields](/api/custom-fields/date) - For date-based conversions
- [Formula Fields](/api/custom-fields/formula) - Alternative calculations
- [Custom Fields Overview](/custom-fields/list-custom-fields) - General concepts

### /api/custom-fields/currency

Source: https://blue.cc/api/custom-fields/currency

Currency custom fields allow you to store and manage monetary values with associated currency codes. The field supports 72 different currencies including major fiat currencies and cryptocurrencies, with automatic formatting and optional min/max constraints.

## Basic Example

Create a simple currency field:

```graphql
mutation CreateCurrencyField {
  createCustomField(input: {
    name: "Budget"
    type: CURRENCY
    projectId: "proj_123"
    currency: "USD"
  }) {
    id
    name
    type
    currency
  }
}
```

## Advanced Example

Create a currency field with validation constraints:

```graphql
mutation CreateConstrainedCurrencyField {
  createCustomField(input: {
    name: "Deal Value"
    type: CURRENCY
    projectId: "proj_123"
    currency: "EUR"
    min: 0
    max: 1000000
    description: "Estimated deal value in euros"
    isActive: true
  }) {
    id
    name
    type
    currency
    min
    max
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the currency field |
| `type` | CustomFieldType! | ✅ Yes | Must be `CURRENCY` |
| `currency` | String | No | Default currency code (3-letter ISO code) |
| `min` | Float | No | Minimum allowed value (stored but not enforced on updates) |
| `max` | Float | No | Maximum allowed value (stored but not enforced on updates) |
| `description` | String | No | Help text shown to users |

**Note**: The project context is automatically determined from your authentication. You must have access to the project where you're creating the field.

## Setting Currency Values

To set or update a currency value on a record:

```graphql
mutation SetCurrencyValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    number: 1500.50
    currency: "USD"
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the currency custom field |
| `number` | Float! | ✅ Yes | The monetary amount |
| `currency` | String! | ✅ Yes | 3-letter currency code |

## Creating Records with Currency Values

When creating a new record with currency values:

```graphql
mutation CreateRecordWithCurrency {
  createTodo(input: {
    title: "Q4 Marketing Campaign"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "currency_field_id"
      value: "25000.00"
      currency: "GBP"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      number
      currency
    }
  }
}
```

### Input Format for Create

When creating records, currency values are passed differently:

| Parameter | Type | Description |
|-----------|------|-------------|
| `customFieldId` | String! | ID of the currency field |
| `value` | String! | Amount as a string (e.g., "1500.50") |
| `currency` | String! | 3-letter currency code |

## Supported Currencies

Blue supports 72 currencies including 70 fiat currencies and 2 cryptocurrencies:

### Fiat Currencies

#### Americas
| Currency | Code | Name |
|----------|------|------|
| US Dollar | `USD` | US Dollar |
| Canadian Dollar | `CAD` | Canadian Dollar |
| Mexican Peso | `MXN` | Mexican Peso |
| Brazilian Real | `BRL` | Brazilian Real |
| Argentine Peso | `ARS` | Argentine Peso |
| Chilean Peso | `CLP` | Chilean Peso |
| Colombian Peso | `COP` | Colombian Peso |
| Peruvian Sol | `PEN` | Peruvian Sol |
| Uruguayan Peso | `UYU` | Uruguayan Peso |
| Venezuelan Bolívar | `VES` | Venezuelan Bolívar Soberano |
| Bolivian Boliviano | `BOB` | Bolivian Boliviano |
| Costa Rican Colón | `CRC` | Costa Rican Colón |
| Dominican Peso | `DOP` | Dominican Peso |
| Guatemalan Quetzal | `GTQ` | Guatemalan Quetzal |
| Jamaican Dollar | `JMD` | Jamaican Dollar |

#### Europe
| Currency | Code | Name |
|----------|------|------|
| Euro | `EUR` | Euro |
| British Pound | `GBP` | Pound Sterling |
| Swiss Franc | `CHF` | Swiss Franc |
| Swedish Krona | `SEK` | Swedish Krona |
| Norwegian Krone | `NOK` | Norwegian Krone |
| Danish Krone | `DKK` | Danish Krone |
| Polish Złoty | `PLN` | Polish Złoty |
| Czech Koruna | `CZK` | Czech Koruna |
| Hungarian Forint | `HUF` | Hungarian Forint |
| Romanian Leu | `RON` | Romanian Leu |
| Bulgarian Lev | `BGN` | Bulgarian Lev |
| Turkish Lira | `TRY` | Turkish Lira |
| Ukrainian Hryvnia | `UAH` | Ukrainian Hryvnia |
| Russian Ruble | `RUB` | Russian Ruble |
| Georgian Lari | `GEL` | Georgian Lari |
| Icelandic króna | `ISK` | Icelandic króna |
| Bosnia-Herzegovina Mark | `BAM` | Bosnia-Herzegovina Convertible Mark |

#### Asia-Pacific
| Currency | Code | Name |
|----------|------|------|
| Japanese Yen | `JPY` | Yen |
| Chinese Yuan | `CNY` | Yuan |
| Hong Kong Dollar | `HKD` | Hong Kong Dollar |
| Singapore Dollar | `SGD` | Singapore Dollar |
| Australian Dollar | `AUD` | Australian Dollar |
| New Zealand Dollar | `NZD` | New Zealand Dollar |
| South Korean Won | `KRW` | South Korean Won |
| Indian Rupee | `INR` | Indian Rupee |
| Indonesian Rupiah | `IDR` | Indonesian Rupiah |
| Thai Baht | `THB` | Thai Baht |
| Malaysian Ringgit | `MYR` | Malaysian Ringgit |
| Philippine Peso | `PHP` | Philippine Peso |
| Vietnamese Dong | `VND` | Vietnamese Dong |
| Taiwanese Dollar | `TWD` | New Taiwan Dollar |
| Pakistani Rupee | `PKR` | Pakistani Rupee |
| Sri Lankan Rupee | `LKR` | Sri Lankan Rupee |
| Cambodian Riel | `KHR` | Cambodian Riel |
| Kazakhstani Tenge | `KZT` | Kazakhstani Tenge |

#### Middle East & Africa
| Currency | Code | Name |
|----------|------|------|
| UAE Dirham | `AED` | UAE Dirham |
| Saudi Riyal | `SAR` | Saudi Riyal |
| Kuwaiti Dinar | `KWD` | Kuwaiti Dinar |
| Bahraini Dinar | `BHD` | Bahraini Dinar |
| Qatari Riyal | `QAR` | Qatari Riyal |
| Israeli Shekel | `ILS` | Israeli New Shekel |
| Egyptian Pound | `EGP` | Egyptian Pound |
| Moroccan Dirham | `MAD` | Moroccan Dirham |
| Tunisian Dinar | `TND` | Tunisian Dinar |
| South African Rand | `ZAR` | South African Rand |
| Kenyan Shilling | `KES` | Kenyan Shilling |
| Nigerian Naira | `NGN` | Nigerian Naira |
| Ghanaian Cedi | `GHS` | Ghanaian Cedi |
| Zambian Kwacha | `ZMW` | Zambian Kwacha |
| Malagasy Ariary | `MGA` | Malagasy Ariary |

### Cryptocurrencies
| Currency | Code |
|----------|------|
| Bitcoin | `BTC` |
| Ethereum | `ETH` |

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `number` | Float | The monetary amount |
| `currency` | String | The 3-letter currency code |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

## Currency Formatting

The system automatically formats currency values based on locale:

- **Symbol placement**: Correctly positions currency symbols (before/after)
- **Decimal separators**: Uses locale-specific separators (. or ,)
- **Thousand separators**: Applies appropriate grouping
- **Decimal places**: Shows 0-2 decimal places based on the amount
- **Special handling**: USD/CAD show currency code prefix for clarity

### Formatting Examples

| Value | Currency | Display |
|-------|----------|---------|
| 1500.50 | USD | USD $1,500.50 |
| 1500.50 | EUR | €1.500,50 |
| 1500 | JPY | ¥1,500 |
| 1500.99 | GBP | £1,500.99 |

## Validation

### Amount Validation
- Must be a valid number
- Min/max constraints are stored with the field definition but not enforced during value updates
- Supports up to 2 decimal places for display (full precision stored internally)

### Currency Code Validation
- Must be one of the 72 supported currency codes
- Case-sensitive (use uppercase)
- Invalid codes return an error

## Integration Features

### Formulas
Currency fields can be used in FORMULA custom fields for calculations:
- Sum multiple currency fields
- Calculate percentages
- Perform arithmetic operations

### Currency Conversion
Use CURRENCY_CONVERSION fields to automatically convert between currencies (see [Currency Conversion Fields](/api/custom-fields/currency-conversion))

### Automations
Currency values can trigger automations based on:
- Amount thresholds
- Currency type
- Value changes

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create currency field | Must be a member of the project (any role) |
| Update currency field | Must be a member of the project (any role) |
| Set currency value | Must have edit permissions based on project role |
| View currency value | Standard record view permissions |

**Note**: While any project member can create custom fields, the ability to set values depends on role-based permissions configured for each field.

## Error Responses

### Invalid Currency Value
```json
{
  "errors": [{
    "message": "Unable to parse custom field value.",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

This error occurs when:
- The currency code is not one of the 72 supported codes
- The number format is invalid
- The value cannot be parsed correctly

### Custom Field Not Found
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

## Best Practices

### Currency Selection
- Set a default currency that matches your primary market
- Use ISO 4217 currency codes consistently
- Consider user location when choosing defaults

### Value Constraints
- Set reasonable min/max values to prevent data entry errors
- Use 0 as minimum for fields that shouldn't be negative
- Consider your use case when setting maximums

### Multi-Currency Projects
- Use consistent base currency for reporting
- Implement CURRENCY_CONVERSION fields for automatic conversion
- Document which currency should be used for each field

## Common Use Cases

1. **Project Budgeting**
   - Project budget tracking
   - Cost estimates
   - Expense tracking

2. **Sales & Deals**
   - Deal values
   - Contract amounts
   - Revenue tracking

3. **Financial Planning**
   - Investment amounts
   - Funding rounds
   - Financial targets

4. **International Business**
   - Multi-currency pricing
   - Foreign exchange tracking
   - Cross-border transactions

## Limitations

- Maximum 2 decimal places for display (though more precision is stored)
- No built-in currency conversion in standard CURRENCY fields
- Cannot mix currencies in a single field value
- No automatic exchange rate updates (use CURRENCY_CONVERSION for this)
- Currency symbols are not customizable

## Related Resources

- [Currency Conversion Fields](/api/custom-fields/currency-conversion) - Automatic currency conversion
- [Number Fields](/api/custom-fields/number) - For non-monetary numeric values
- [Formula Fields](/api/custom-fields/formula) - Calculate with currency values
- [List Custom Fields](/api/custom-fields/list-custom-fields) - Query all custom fields in a project

### /api/custom-fields/custom-field-values

Source: https://blue.cc/api/custom-fields/custom-field-values

## Set Custom Field Values

Custom fields extend Blue's standard record structure with business-specific data. This endpoint allows you to set or update values for any custom field on a record. Each field type requires specific parameters to ensure data integrity and proper validation.

### Basic Example

```graphql
mutation SetTextFieldValue {
  setTodoCustomField(input: {
    todoId: "todo_abc123"
    customFieldId: "field_xyz789"
    text: "Project specification document"
  })
}
```

### Advanced Example

```graphql
mutation SetMultipleFieldTypes {
  # Set a date range field
  dateField: setTodoCustomField(input: {
    todoId: "todo_abc123"
    customFieldId: "field_date_001"
    startDate: "2024-01-15T09:00:00Z"
    endDate: "2024-01-31T17:00:00Z"
    timezone: "America/New_York"
  })
  
  # Set a multi-select field
  selectField: setTodoCustomField(input: {
    todoId: "todo_abc123"
    customFieldId: "field_select_002"
    customFieldOptionIds: ["option_high", "option_urgent", "option_client"]
  })
  
  # Set a location field
  locationField: setTodoCustomField(input: {
    todoId: "todo_abc123"
    customFieldId: "field_location_003"
    latitude: 40.7128
    longitude: -74.0060
  })
}
```

## Input Parameters

### SetTodoCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to update |
| `customFieldId` | String! | ✅ Yes | The ID of the custom field |
| `text` | String | No | For TEXT_SINGLE, TEXT_MULTI, PHONE, EMAIL, URL |
| `number` | Float | No | For NUMBER, PERCENT, RATING |
| `currency` | String | No | Currency code for CURRENCY type (e.g., "USD") |
| `checked` | Boolean | No | For CHECKBOX fields |
| `startDate` | DateTime | No | Start date for DATE fields |
| `endDate` | DateTime | No | End date for DATE range fields |
| `timezone` | String | No | Timezone for DATE fields (e.g., "America/New_York") |
| `latitude` | Float | No | Latitude for LOCATION fields |
| `longitude` | Float | No | Longitude for LOCATION fields |
| `regionCode` | String | No | Region code for PHONE fields |
| `countryCodes` | [String!] | No | ISO country codes for COUNTRY fields |
| `customFieldOptionId` | String | No | Option ID for SELECT_SINGLE fields |
| `customFieldOptionIds` | [String!] | No | Option IDs for SELECT_MULTI fields |
| `customFieldReferenceTodoIds` | [String!] | No | Record IDs for REFERENCE fields |

## Field Type Examples

### Text Fields
```graphql
mutation {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_description"
    text: "Detailed project requirements and specifications"
  })
}
```

### Number Fields
```graphql
mutation {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_budget"
    number: 15000.50
  })
}
```

### Select Fields
```graphql
# Single Select
mutation {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_priority"
    customFieldOptionId: "option_high"
  })
}

# Multi Select
mutation {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_tags"
    customFieldOptionIds: ["option_frontend", "option_urgent", "option_v2"]
  })
}
```

### Date Fields
```graphql
# Single Date
mutation {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_deadline"
    startDate: "2024-12-31T23:59:59Z"
  })
}

# Date Range
mutation {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_project_timeline"
    startDate: "2024-01-01T00:00:00Z"
    endDate: "2024-03-31T23:59:59Z"
    timezone: "UTC"
  })
}
```

### Location Fields
```graphql
mutation {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_office_location"
    latitude: 37.7749
    longitude: -122.4194
  })
}
```

### Currency Fields
```graphql
mutation {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_invoice_amount"
    number: 5000
    currency: "USD"
  })
}
```

### File Fields
File fields use separate mutations:

```graphql
# Add a file
mutation {
  createTodoCustomFieldFile(input: {
    todoId: "todo_123"
    customFieldId: "field_attachments"
    fileUid: "file_upload_789"
  })
}

# Remove a file
mutation {
  deleteTodoCustomFieldFile(input: {
    todoId: "todo_123"
    customFieldId: "field_attachments"
    fileUid: "file_upload_789"
  })
}
```

## Setting Values During Record Creation

You can set custom field values when creating a new record:

```graphql
mutation {
  createTodo(input: {
    todoListId: "list_project_123"
    title: "New Feature Development"
    customFields: [
      {
        customFieldId: "field_priority"
        value: "high"
      },
      {
        customFieldId: "field_estimate"
        value: "8"
      }
    ]
  }) {
    id
    customFields {
      customField {
        name
      }
      value
    }
  }
}
```

## Response Fields

The mutation returns a boolean indicating success:

| Field | Type | Description |
|-------|------|-------------|
| `setTodoCustomField` | Boolean! | True if the operation succeeded |

## Required Permissions

Users must have permission to edit both the record and the specific custom field:

| Role | Can Set Field Values |
|------|---------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes (unless restricted by custom role) |
| `CLIENT` | ✅ Yes (unless restricted by custom role) |

For users with custom project roles, the system performs a two-tier check:
1. First, it verifies the user has project-level access
2. Then, it checks if the specific field is marked as `editable` in their custom role configuration

This means a user might have general project access but still be restricted from editing certain fields based on their custom role.

## Error Responses

### Custom Field Not Found
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

### Unauthorized Access
```json
{
  "errors": [{
    "message": "You are not authorized.",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Invalid Field Value
```json
{
  "errors": [{
    "message": "Invalid value for field type NUMBER",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```


## Important Notes

- **Upsert Behavior**: The mutation creates a new field value if none exists, or updates the existing value
- **Type Safety**: Only provide parameters that match the field type (e.g., don't send `text` for a NUMBER field)
- **Side Effects**: Setting values triggers:
  - Formula field recalculations
  - Automation rules
  - Webhook notifications
  - Activity log entries
  - Chart updates
- **Special Behaviors**:
  - **CURRENCY** fields automatically handle conversion calculations
  - **REFERENCE** fields update bi-directional relationships
  - **FORMULA** fields are read-only and cannot be set directly (they're calculated automatically)
  - **LOOKUP** fields are read-only and cannot be set directly (they pull data from referenced records)
  - **BUTTON** fields trigger automation events when "clicked"
- **Validation**: The API validates that:
  - The record exists in the project
  - The custom field exists in the same project
  - The user has edit permissions
  - The value matches the field type requirements

## Value Format Reference

| Field Type | Parameter | Format | Example |
|------------|-----------|--------|---------|
| `TEXT_SINGLE` | `text` | String | `"Project Alpha"` |
| `TEXT_MULTI` | `text` | String with newlines | `"Line 1\nLine 2"` |
| `NUMBER` | `number` | Float | `42.5` |
| `CURRENCY` | `number` + `currency` | Float + ISO code | `1000.00` + `"USD"` |
| `PERCENT` | `number` | Float (0-100) | `75` |
| `RATING` | `number` | Float (within min/max) | `4.5` |
| `CHECKBOX` | `checked` | Boolean | `true` |
| `DATE` | `startDate` | ISO 8601 DateTime | `"2024-01-15T00:00:00Z"` |
| `DATE` (range) | `startDate` + `endDate` | ISO 8601 DateTimes | See example above |
| `SELECT_SINGLE` | `customFieldOptionId` | Option ID | `"option_123"` |
| `SELECT_MULTI` | `customFieldOptionIds` | Array of Option IDs | `["opt_1", "opt_2"]` |
| `PHONE` | `text` | String | `"+1-555-123-4567"` |
| `EMAIL` | `text` | String | `"user@example.com"` |
| `URL` | `text` | String | `"https://example.com"` |
| `LOCATION` | `latitude` + `longitude` | Floats | `40.7128, -74.0060` |
| `COUNTRY` | `countryCodes` | ISO 3166 codes | `["US", "CA"]` |
| `REFERENCE` | `customFieldReferenceTodoIds` | Array of record IDs | `["todo_1", "todo_2"]` |
| `FORMULA` | N/A | Read-only - calculated automatically | N/A |
| `LOOKUP` | N/A | Read-only - pulls from references | N/A |

## Related Endpoints

- [List Custom Fields](/api/custom-fields/list-custom-fields) - Get available custom fields
- [Create Custom Field](/api/custom-fields/create-custom-fields) - Add new custom fields
- [Get Record Details](/api/records/list-records) - Retrieve records with custom field values
- [Bulk Update Records](/api/records/bulk-update) - Update multiple records at once

### /api/custom-fields/date

Source: https://blue.cc/api/custom-fields/date

Date custom fields allow you to store single dates or date ranges for records. They support timezone handling, intelligent formatting, and can be used to track deadlines, event dates, or any time-based information.

## Basic Example

Create a simple date field:

```graphql
mutation CreateDateField {
  createCustomField(input: {
    name: "Deadline"
    type: DATE
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a due date field with description:

```graphql
mutation CreateDueDateField {
  createCustomField(input: {
    name: "Contract Expiration"
    type: DATE
    isDueDate: true
    description: "When the contract expires and needs renewal"
  }) {
    id
    name
    type
    isDueDate
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the date field |
| `type` | CustomFieldType! | ✅ Yes | Must be `DATE` |
| `isDueDate` | Boolean | No | Whether this field represents a due date |
| `description` | String | No | Help text shown to users |

**Note**: Custom fields are automatically associated with the project based on the user's current project context. No `projectId` parameter is required.

## Setting Date Values

Date fields can store either a single date or a date range:

### Single Date

```graphql
mutation SetSingleDate {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    startDate: "2025-01-15T10:00:00Z"
    endDate: "2025-01-15T10:00:00Z"
    timezone: "America/New_York"
  }) {
    id
    customField {
      value  # Contains { startDate, endDate, timezone }
    }
  }
}
```

### Date Range

```graphql
mutation SetDateRange {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    startDate: "2025-01-01T09:00:00Z"
    endDate: "2025-01-31T17:00:00Z"
    timezone: "Europe/London"
  }) {
    id
    customField {
      value  # Contains { startDate, endDate, timezone }
    }
  }
}
```

### All-Day Event

```graphql
mutation SetAllDayEvent {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    startDate: "2025-01-15T00:00:00Z"
    endDate: "2025-01-15T23:59:59Z"
    timezone: "Asia/Tokyo"
  }) {
    id
    customField {
      value  # Contains { startDate, endDate, timezone }
    }
  }
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the date custom field |
| `startDate` | DateTime | No | Start date/time in ISO 8601 format |
| `endDate` | DateTime | No | End date/time in ISO 8601 format |
| `timezone` | String | No | Timezone identifier (e.g., "America/New_York") |

**Note**: If only `startDate` is provided, `endDate` automatically defaults to the same value.

## Date Formats

### ISO 8601 Format
All dates must be provided in ISO 8601 format:
- `2025-01-15T14:30:00Z` - UTC time
- `2025-01-15T14:30:00+05:00` - With timezone offset
- `2025-01-15T14:30:00.123Z` - With milliseconds

### Timezone Identifiers
Use standard timezone identifiers:
- `America/New_York`
- `Europe/London`
- `Asia/Tokyo`
- `Australia/Sydney`

If no timezone is provided, the system defaults to the user's detected timezone.

## Creating Records with Date Values

When creating a new record with date values:

```graphql
mutation CreateRecordWithDate {
  createTodo(input: {
    title: "Project Milestone"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "date_field_id"
      value: "2025-02-15"  # Simple date format
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # Date values are accessed here
      }
    }
  }
}
```

### Supported Input Formats

When creating records, dates can be provided in various formats:

| Format | Example | Result |
|--------|---------|---------|
| ISO Date | `"2025-01-15"` | Single date (start and end same) |
| ISO DateTime | `"2025-01-15T10:00:00Z"` | Single date/time |
| Date Range | `"2025-01-01,2025-01-31"` | Start and end dates |

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the field value |
| `uid` | String! | Unique identifier string |
| `customField` | CustomField! | The custom field definition (contains the date values) |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

**Important**: Date values (`startDate`, `endDate`, `timezone`) are accessed through the `customField.value` field, not directly on TodoCustomField.

### Value Object Structure

Date values are returned through the `customField.value` field as a JSON object:

```json
{
  "customField": {
    "value": {
      "startDate": "2025-01-15T10:00:00.000Z",
      "endDate": "2025-01-15T17:00:00.000Z",
      "timezone": "America/New_York"
    }
  }
}
```

**Note**: The `value` field is on the `CustomField` type, not on `TodoCustomField`.

## Querying Date Values

When querying records with date custom fields, access the date values through the `customField.value` field:

```graphql
query GetRecordWithDateField {
  todo(id: "todo_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # For DATE type, contains { startDate, endDate, timezone }
      }
    }
  }
}
```

The response will include the date values in the `value` field:

```json
{
  "data": {
    "todo": {
      "customFields": [{
        "customField": {
          "name": "Deadline",
          "type": "DATE",
          "value": {
            "startDate": "2025-01-15T10:00:00.000Z",
            "endDate": "2025-01-15T10:00:00.000Z",
            "timezone": "America/New_York"
          }
        }
      }]
    }
  }
}
```

## Date Display Intelligence

The system automatically formats dates based on the range:

| Scenario | Display Format |
|----------|----------------|
| Single date | `Jan 15, 2025` |
| All-day event | `Jan 15, 2025` (no time shown) |
| Same day with times | `Jan 15, 2025 10:00 AM - 5:00 PM` |
| Multi-day range | `Jan 1 → Jan 31, 2025` |

**All-day detection**: Events from 00:00 to 23:59 are automatically detected as all-day events.

## Timezone Handling

### Storage
- All dates are stored in UTC in the database
- Timezone information is preserved separately
- Conversion happens on display

### Best Practices
- Always provide timezone for accuracy
- Use consistent timezones within a project
- Consider user locations for global teams

### Common Timezones

| Region | Timezone ID | UTC Offset |
|--------|-------------|------------|
| US Eastern | `America/New_York` | UTC-5/-4 |
| US Pacific | `America/Los_Angeles` | UTC-8/-7 |
| UK | `Europe/London` | UTC+0/+1 |
| EU Central | `Europe/Berlin` | UTC+1/+2 |
| Japan | `Asia/Tokyo` | UTC+9 |
| Australia Eastern | `Australia/Sydney` | UTC+10/+11 |

## Filtering and Querying

Date fields support complex filtering:

```graphql
query FilterByDateRange {
  todos(filter: {
    customFields: [{
      customFieldId: "date_field_id"
      dateRange: {
        startDate: "2025-01-01T00:00:00Z"
        endDate: "2025-12-31T23:59:59Z"
      }
      operator: EQ  # Returns todos whose dates overlap with this range
    }]
  }) {
    id
    title
  }
}
```

### Checking for Empty Date Fields

```graphql
query FilterEmptyDates {
  todos(filter: {
    customFields: [{
      customFieldId: "date_field_id"
      values: null
      operator: IS  # Returns todos with no date set
    }]
  }) {
    id
    title
  }
}
```

### Supported Operators

| Operator | Usage | Description |
|----------|-------|-------------|
| `EQ` | With dateRange | Date overlaps with specified range (any intersection) |
| `NE` | With dateRange | Date does not overlap with range |
| `IS` | With `values: null` | Date field is empty (startDate or endDate is null) |
| `NOT` | With `values: null` | Date field has a value (both dates are not null) |

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create date field | `OWNER` or `ADMIN` role at company or project level |
| Update date field | `OWNER` or `ADMIN` role at company or project level |
| Set date value | Standard record edit permissions |
| View date value | Standard record view permissions |

## Error Responses

### Invalid Date Format
```json
{
  "errors": [{
    "message": "Invalid date format. Use ISO 8601 format",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```


## Limitations

- No recurring date support (use automations for recurring events)
- Cannot set time without date
- No built-in working days calculation
- Date ranges don't validate end > start automatically
- Maximum precision is to the second (no millisecond storage)

## Related Resources

- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General custom field concepts
- [Automations API](/api/automations/index) - Create date-based automations

### /api/custom-fields/delete-custom-field

Source: https://blue.cc/api/custom-fields/delete-custom-field

## Delete a Custom Field

Permanently removes a custom field from a project along with all associated data, values, and configurations. This operation cannot be undone and will affect all records that use this field.

### Basic Example

```graphql
mutation DeleteCustomField {
  deleteCustomField(id: "field_abc123")
}
```

### Advanced Example

```graphql
mutation DeleteCustomFieldWithResponse {
  deleteCustomField(id: "field_abc123")
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | The unique identifier of the custom field to delete |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `deleteCustomField` | Boolean! | Always returns `true` when deletion succeeds |

## Required Permissions

Only project owners and administrators can delete custom fields.

| Role | Can Delete Custom Fields |
|------|-------------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |
| `CLIENT` | ❌ No |

## Cascading Effects

When a custom field is deleted, the following cleanup operations occur automatically:

### Data Cleanup
- **Custom field values** - All values for this field are removed from all records
- **Field options** - All dropdown options and configurations are deleted
- **Activity history** - All activity records related to this field are removed
- **Lookup configurations** - Any lookup field references are cleaned up

### Special Handling for Button Fields
If the deleted field is of type `BUTTON`, additional cleanup occurs:
- **Automations** - All automations triggered by this button are deleted
- **Automation history** - Related automation activity is removed

### Real-time Updates
- **Charts** - Project charts are marked for update to reflect the changes
- **Formulas** - All formula fields in the project are recalculated
- **Time tracking** - Time duration calculations are updated
- **Subscriptions** - Real-time notifications are sent to connected clients
- **Webhooks** - Integration webhooks are triggered with deletion events

## Error Responses

### Custom Field Not Found
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to perform this action",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```


## Important Notes

### Permanent Deletion
- **No undo** - Deleted custom fields cannot be recovered
- **Data loss** - All field values across all records are permanently removed
- **Immediate effect** - Changes take effect immediately across all project users

### Performance Considerations
- **Large projects** - Deletion may take longer in projects with many records
- **Formula recalculation** - Projects with complex formulas may experience brief processing delays
- **Chart updates** - Dashboard charts will refresh to reflect the changes

### Best Practices
1. **Backup data** - Export important field values before deletion
2. **Communicate changes** - Notify team members before deleting fields
3. **Check dependencies** - Verify no automations or formulas depend on the field
4. **Review reports** - Update any reports that reference the deleted field

### Related Operations
- Use [List Custom Fields](/api/custom-fields/list-custom-fields) to find field IDs
- Consider [Create Custom Field](/api/custom-fields/create-custom-fields) to recreate similar fields
- Review [Custom Field Values](/api/custom-fields/custom-field-values) to understand data impact

## Common Use Cases

### Removing Unused Fields
```graphql
# First, list fields to identify unused ones
query ListCustomFields {
  customFields(projectId: "project_123") {
    id
    name
    type
    createdAt
    # Check usage in records
  }
}

# Then delete the unused field
mutation DeleteUnusedField {
  deleteCustomField(id: "field_to_remove")
}
```

### Cleaning Up Test Fields
```graphql
# Remove fields created during testing
mutation CleanupTestFields {
  field1: deleteCustomField(id: "test_field_1")
  field2: deleteCustomField(id: "test_field_2")
  field3: deleteCustomField(id: "test_field_3")
}
```

### Restructuring Project Fields
```graphql
# When reorganizing field structure
mutation RestructureFields {
  # Delete old fields
  deleteOldPriorityField: deleteCustomField(id: "old_priority_field")
  deleteOldStatusField: deleteCustomField(id: "old_status_field")
  
  # Note: Create new fields in separate mutations
}
```

## Webhook Events

When a custom field is deleted, the following webhook event is triggered:

```json
{
  "event": "CUSTOM_FIELD_DELETED",
  "projectId": "project_123",
  "timestamp": "2024-01-15T10:30:00Z",
  "previousValue": {
    "id": "field_abc123",
    "name": "Priority Level",
    "type": "SELECT_SINGLE",
    "projectId": "project_123"
  },
  "currentValue": null
}
```

### /api/custom-fields/email

Source: https://blue.cc/api/custom-fields/email

Email custom fields allow you to store email addresses in records with built-in validation. They're ideal for tracking contact information, assignee emails, or any email-related data in your projects.

## Basic Example

Create a simple email field:

```graphql
mutation CreateEmailField {
  createCustomField(input: {
    name: "Contact Email"
    type: EMAIL
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create an email field with description:

```graphql
mutation CreateDetailedEmailField {
  createCustomField(input: {
    name: "Client Email"
    type: EMAIL
    description: "Primary email address for client communications"
  }) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the email field |
| `type` | CustomFieldType! | ✅ Yes | Must be `EMAIL` |
| `description` | String | No | Help text shown to users |

## Setting Email Values

To set or update an email value on a record:

```graphql
mutation SetEmailValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    text: "john.doe@example.com"
  }) {
    id
    customField {
      value  # Returns { text: "john.doe@example.com" }
    }
  }
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the email custom field |
| `text` | String | No | Email address to store |

## Creating Records with Email Values

When creating a new record with email values:

```graphql
mutation CreateRecordWithEmail {
  createTodo(input: {
    title: "Follow up with client"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "email_field_id"
      value: "client@company.com"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # Email is accessed here as { text: "client@company.com" }
      }
    }
  }
}
```

## Response Fields

### CustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the custom field |
| `name` | String! | Display name of the email field |
| `type` | CustomFieldType! | The field type (EMAIL) |
| `description` | String | Help text for the field |
| `value` | JSON | Contains the email value (see below) |
| `createdAt` | DateTime! | When the field was created |
| `updatedAt` | DateTime! | When the field was last modified |

**Important**: Email values are accessed through the `customField.value.text` field, not directly on the response.

## Querying Email Values

When querying records with email custom fields, access the email through the `customField.value.text` path:

```graphql
query GetRecordWithEmail {
  todo(id: "todo_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # For EMAIL type, contains { text: "email@example.com" }
      }
    }
  }
}
```

The response will include the email in the nested structure:

```json
{
  "data": {
    "todo": {
      "customFields": [{
        "customField": {
          "name": "Contact Email",
          "type": "EMAIL",
          "value": {
            "text": "john.doe@example.com"
          }
        }
      }]
    }
  }
}
```

## Email Validation

### Form Validation
When email fields are used in forms, they automatically validate the email format:
- Uses standard email validation rules
- Trims whitespace from input
- Rejects invalid email formats

### Validation Rules
- Must contain an `@` symbol
- Must have a valid domain format
- Leading/trailing whitespace is automatically removed
- Common email formats are accepted

### Valid Email Examples
```
user@example.com
john.doe@company.co.uk
test+tag@domain.org
first.last@sub.domain.com
```

### Invalid Email Examples
```
plainaddress          # Missing @ symbol
@domain.com          # Missing local part
user@                # Missing domain
user@domain          # Missing TLD
user name@domain.com # Spaces not allowed
```

## Important Notes

### Direct API vs Forms
- **Forms**: Automatic email validation is applied
- **Direct API**: No validation - any text can be stored
- **Recommendation**: Use forms for user input to ensure validation

### Storage Format
- Email addresses are stored as plain text
- No special formatting or parsing
- Case sensitivity: EMAIL custom fields are stored case-sensitively (unlike user authentication emails which are normalized to lowercase)
- No maximum length limitations beyond database constraints (16MB limit)

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create email field | `OWNER` or `ADMIN` project-level role |
| Update email field | `OWNER` or `ADMIN` project-level role |
| Delete email field | `OWNER` or `ADMIN` project-level role |
| Set email value | Any role except `VIEW_ONLY` and `COMMENT_ONLY` |
| View email value | Any project role with field access |

## Error Responses

### Invalid Email Format (Forms Only)
```json
{
  "errors": [{
    "message": "ValidationError",
    "extensions": {
      "code": "BAD_USER_INPUT",
      "data": {
        "errors": [{
          "field": "email",
          "message": "Email format is invalid"
        }]
      }
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

## Best Practices

### Data Entry
- Always validate email addresses in your application
- Use email fields only for actual email addresses
- Consider using forms for user input to get automatic validation

### Data Quality
- Trim whitespace before storing
- Consider case normalization (typically lowercase)
- Validate email format before important operations

### Privacy Considerations
- Email addresses are stored as plain text
- Consider data privacy regulations (GDPR, CCPA)
- Implement appropriate access controls

## Common Use Cases

1. **Contact Management**
   - Client email addresses
   - Vendor contact information
   - Team member emails
   - Support contact details

2. **Project Management**
   - Stakeholder emails
   - Approval contact emails
   - Notification recipients
   - External collaborator emails

3. **Customer Support**
   - Customer email addresses
   - Support ticket contacts
   - Escalation contacts
   - Feedback email addresses

4. **Sales & Marketing**
   - Lead email addresses
   - Campaign contact lists
   - Partner contact information
   - Referral source emails

## Integration Features

### With Automations
- Trigger actions when email fields are updated
- Send notifications to stored email addresses
- Create follow-up tasks based on email changes

### With Lookups
- Reference email data from other records
- Aggregate email lists from multiple sources
- Find records by email address

### With Forms
- Automatic email validation
- Email format checking
- Whitespace trimming

## Limitations

- No built-in email verification or validation beyond format checking
- No email-specific UI features (like clickable email links)
- Stored as plain text without encryption
- No email composition or sending capabilities
- No email metadata storage (display name, etc.)
- Direct API calls bypass validation (only forms validate)

## Related Resources

- [Text Fields](/api/custom-fields/text-single) - For non-email text data
- [URL Fields](/api/custom-fields/url) - For website addresses
- [Phone Fields](/api/custom-fields/phone) - For phone numbers
- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General concepts

### /api/custom-fields/file

Source: https://blue.cc/api/custom-fields/file

File custom fields allow you to attach multiple files to records. Files are stored securely in AWS S3 with comprehensive metadata tracking, file type validation, and proper access controls.

## Basic Example

Create a simple file field:

```graphql
mutation CreateFileField {
  createCustomField(input: {
    name: "Attachments"
    type: FILE
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a file field with description:

```graphql
mutation CreateDetailedFileField {
  createCustomField(input: {
    name: "Project Documents"
    type: FILE
    description: "Upload project-related documents, images, and files"
  }) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the file field |
| `type` | CustomFieldType! | ✅ Yes | Must be `FILE` |
| `description` | String | No | Help text shown to users |

**Note**: Custom fields are automatically associated with the project based on the user's current project context. No `projectId` parameter is required.

## File Upload Process

### Step 1: Upload File

First, upload the file to get a file UID:

```graphql
mutation UploadFile {
  uploadFile(input: {
    file: $file  # File upload variable
    companyId: "company_123"
    projectId: "proj_123"
  }) {
    id
    uid
    name
    size
    type
    extension
    status
  }
}
```

### Step 2: Attach File to Record

Then attach the uploaded file to a record:

```graphql
mutation AttachFileToRecord {
  createTodoCustomFieldFile(input: {
    todoId: "todo_123"
    customFieldId: "file_field_456"
    fileUid: "file_uid_from_upload"
  }) {
    id
    file {
      uid
      name
      size
      type
    }
  }
}
```

## Managing File Attachments

### Adding Single Files

```graphql
mutation AddFileToField {
  createTodoCustomFieldFile(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    fileUid: "file_uid_789"
  }) {
    id
    position
    file {
      uid
      name
      size
      type
      extension
    }
  }
}
```

### Removing Files

```graphql
mutation RemoveFileFromField {
  deleteTodoCustomFieldFile(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    fileUid: "file_uid_789"
  })
}
```

### Bulk File Operations

Update multiple files at once using customFieldOptionIds:

```graphql
mutation SetMultipleFiles {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    customFieldOptionIds: ["file_uid_1", "file_uid_2", "file_uid_3"]
  })
}
```

## File Upload Input Parameters

### UploadFileInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | Upload! | ✅ Yes | File to upload |
| `companyId` | String! | ✅ Yes | Company ID for file storage |
| `projectId` | String | No | Project ID for project-specific files |

### File Management Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record |
| `customFieldId` | String! | ✅ Yes | ID of the file custom field |
| `fileUid` | String! | ✅ Yes | Unique identifier of the uploaded file |

## File Storage and Limits

### File Size Limits

| Limit Type | Size |
|------------|------|
| Maximum file size | 256MB per file |
| Batch upload limit | 10 files max, 1GB total |
| GraphQL upload limit | 256MB |

### Supported File Types

#### Images
- `jpg`, `jpeg`, `png`, `gif`, `bmp`, `webp`, `svg`, `ico`, `tiff`, `tif`

#### Videos
- `mp4`, `avi`, `mov`, `wmv`, `flv`, `webm`, `mkv`, `3gp`

#### Audio
- `mp3`, `wav`, `flac`, `aac`, `ogg`, `wma`

#### Documents
- `pdf`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx`, `txt`, `rtf`

#### Archives
- `zip`, `rar`, `7z`, `tar`, `gz`

#### Code/Text
- `json`, `xml`, `csv`, `md`, `yaml`, `yml`

### Storage Architecture

- **Storage**: AWS S3 with organized folder structure
- **Path Format**: `companies/{companySlug}/projects/{projectSlug}/uploads/{year}/{month}/{username}/{fileUid}_{filename}`
- **Security**: Signed URLs for secure access
- **Backup**: Automatic S3 redundancy

## Response Fields

### File Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Database ID |
| `uid` | String! | Unique file identifier |
| `name` | String! | Original filename |
| `size` | Float! | File size in bytes |
| `type` | String! | MIME type |
| `extension` | String! | File extension |
| `status` | FileStatus | PENDING or CONFIRMED (nullable) |
| `shared` | Boolean! | Whether file is shared |
| `createdAt` | DateTime! | Upload timestamp |

### TodoCustomFieldFile Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Junction record ID |
| `uid` | String! | Unique identifier |
| `position` | Float! | Display order |
| `file` | File! | Associated file object |
| `todoCustomField` | TodoCustomField! | Parent custom field |
| `createdAt` | DateTime! | When file was attached |

## Creating Records with Files

When creating records, you can attach files using their UIDs:

```graphql
mutation CreateRecordWithFiles {
  createTodo(input: {
    title: "Project deliverables"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "file_field_id"
      customFieldOptionIds: ["file_uid_1", "file_uid_2"]
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      todoCustomFieldFiles {
        id
        position
        file {
          uid
          name
          size
          type
        }
      }
    }
  }
}
```

## File Validation and Security

### Upload Validation

- **MIME Type Checking**: Validates against allowed types
- **File Extension Validation**: Fallback for `application/octet-stream`
- **Size Limits**: Enforced at upload time
- **Filename Sanitization**: Removes special characters

### Access Control

- **Upload Permissions**: Project/company membership required
- **File Association**: ADMIN, OWNER, MEMBER, CLIENT roles
- **File Access**: Inherited from project/company permissions
- **Secure URLs**: Time-limited signed URLs for file access

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create file field | `OWNER` or `ADMIN` project-level role |
| Update file field | `OWNER` or `ADMIN` project-level role |
| Upload files | Project or company membership |
| Attach files | ADMIN, OWNER, MEMBER, or CLIENT role |
| View files | Standard record view permissions |
| Delete files | Same as attach permissions |

## Error Responses

### File Too Large
```json
{
  "errors": [{
    "message": "File \"filename.pdf\": Size exceeds maximum limit of 256MB",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

### File Not Found
```json
{
  "errors": [{
    "message": "File not found",
    "extensions": {
      "code": "FILE_NOT_FOUND"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

## Best Practices

### File Management
- Upload files before attaching to records
- Use descriptive filenames
- Organize files by project/purpose
- Clean up unused files periodically

### Performance
- Upload files in batches when possible
- Use appropriate file formats for content type
- Compress large files before upload
- Consider file preview requirements

### Security
- Validate file contents, not just extensions
- Use virus scanning for uploaded files
- Implement proper access controls
- Monitor file upload patterns

## Common Use Cases

1. **Document Management**
   - Project specifications
   - Contracts and agreements
   - Meeting notes and presentations
   - Technical documentation

2. **Asset Management**
   - Design files and mockups
   - Brand assets and logos
   - Marketing materials
   - Product images

3. **Compliance and Records**
   - Legal documents
   - Audit trails
   - Certificates and licenses
   - Financial records

4. **Collaboration**
   - Shared resources
   - Version-controlled documents
   - Feedback and annotations
   - Reference materials

## Integration Features

### With Automations
- Trigger actions when files are added/removed
- Process files based on type or metadata
- Send notifications for file changes
- Archive files based on conditions

### With Cover Images
- Use file fields as cover image sources
- Automatic image processing and thumbnails
- Dynamic cover updates when files change

### With Lookups
- Reference files from other records
- Aggregate file counts and sizes
- Find records by file metadata
- Cross-reference file attachments

## Limitations

- Maximum 256MB per file
- Dependent on S3 availability
- No built-in file versioning
- No automatic file conversion
- Limited file preview capabilities
- No real-time collaborative editing

## Related Resources

- [Upload Files API](/api/upload-files) - File upload endpoints
- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General concepts
- [Automations API](/api/automations) - File-based automations
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/) - Storage backend

### /api/custom-fields/formula

Source: https://blue.cc/api/custom-fields/formula

Formula custom fields are used for chart and dashboard calculations within Blue. They define aggregation functions (SUM, AVERAGE, COUNT, etc.) that operate on custom field data to display calculated metrics in charts. Formulas are not calculated at the individual todo level but rather aggregate data across multiple records for visualization purposes.

## Basic Example

Create a formula field for chart calculations:

```graphql
mutation CreateFormulaField {
  createCustomField(input: {
    name: "Budget Total"
    type: FORMULA
    projectId: "proj_123"
    formula: {
      logic: {
        text: "SUM(Budget)"
        html: "<span>SUM(Budget)</span>"
      }
      display: {
        type: NUMBER
        precision: 2
        function: SUM
      }
    }
  }) {
    id
    name
    type
    formula
  }
}
```

## Advanced Example

Create a currency formula with complex calculations:

```graphql
mutation CreateCurrencyFormula {
  createCustomField(input: {
    name: "Profit Margin"
    type: FORMULA
    projectId: "proj_123"
    formula: {
      logic: {
        text: "SUM(Revenue) - SUM(Costs)"
        html: "<span>SUM(Revenue) - SUM(Costs)</span>"
      }
      display: {
        type: CURRENCY
        currency: {
          code: "USD"
          name: "US Dollar"
        }
        precision: 2
      }
    }
    description: "Automatically calculates profit by subtracting costs from revenue"
  }) {
    id
    name
    type
    formula
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the formula field |
| `type` | CustomFieldType! | ✅ Yes | Must be `FORMULA` |
| `projectId` | String! | ✅ Yes | The project ID where this field will be created |
| `formula` | JSON | No | Formula definition for chart calculations |
| `description` | String | No | Help text shown to users |

### Formula Structure

```json
{
  "logic": {
    "text": "Display text for the formula",
    "html": "HTML formatted display text"
  },
  "display": {
    "type": "NUMBER|CURRENCY|PERCENTAGE",
    "currency": {
      "code": "USD",
      "name": "US Dollar"  
    },
    "precision": 2,
    "function": "SUM|AVERAGE|AVERAGEA|COUNT|COUNTA|MAX|MIN"
  }
}
```

## Supported Functions

### Chart Aggregation Functions

Formula fields support the following aggregation functions for chart calculations:

| Function | Description | ChartFunction Enum |
|----------|-------------|-------------------|
| `SUM` | Sum of all values | `SUM` |
| `AVERAGE` | Average of numeric values | `AVERAGE` |
| `AVERAGEA` | Average excluding zeros and nulls | `AVERAGEA` |
| `COUNT` | Count of values | `COUNT` |
| `COUNTA` | Count excluding zeros and nulls | `COUNTA` |
| `MAX` | Maximum value | `MAX` |
| `MIN` | Minimum value | `MIN` |

**Note**: These functions are used in the `display.function` field and operate on aggregated data for chart visualizations. Complex mathematical expressions or field-level calculations are not supported.

## Display Types

### Number Display

```json
{
  "display": {
    "type": "NUMBER",
    "precision": 2
  }
}
```

Result: `1250.75`

### Currency Display

```json
{
  "display": {
    "type": "CURRENCY",
    "currency": {
      "code": "USD",
      "name": "US Dollar"
    },
    "precision": 2
  }
}
```

Result: `$1,250.75`

### Percentage Display

```json
{
  "display": {
    "type": "PERCENTAGE",
    "precision": 1
  }
}
```

Result: `87.5%`

## Editing Formula Fields

Update existing formula fields:

```graphql
mutation EditFormulaField {
  editCustomField(input: {
    customFieldId: "field_456"
    formula: {
      logic: {
        text: "AVERAGE(Score)"
        html: "<span>AVERAGE(Score)</span>"
      }
      display: {
        type: PERCENTAGE
        precision: 1
      }
    }
  }) {
    id
    formula
  }
}
```

## Formula Processing

### Chart Calculation Context

Formula fields are processed in the context of chart segments and dashboards:
- Calculations happen when charts are rendered or updated
- Results are stored in `ChartSegment.formulaResult` as decimal values
- Processing is handled through a dedicated BullMQ queue named 'formula'
- Updates publish to dashboard subscribers for real-time updates

### Display Formatting

The `getFormulaDisplayValue` function formats the calculated results based on the display type:
- **NUMBER**: Displays as plain number with optional precision
- **PERCENTAGE**: Adds % suffix with optional precision  
- **CURRENCY**: Formats using the specified currency code

## Formula Result Storage

Results are stored in the `formulaResult` field:

```json
{
  "number": 1250.75,
  "formulaResult": {
    "number": 1250.75,
    "display": {
      "type": "CURRENCY",
      "currency": {
        "code": "USD",
        "name": "US Dollar"
      },
      "precision": 2
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The formula field definition |
| `number` | Float | Calculated numeric result |
| `formulaResult` | JSON | Full result with display formatting |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last calculated |

## Data Context

### Chart Data Source

Formula fields operate within the chart data source context:
- Formulas aggregate custom field values across todos in a project
- The aggregation function specified in `display.function` determines the calculation
- Results are computed using SQL aggregate functions (avg, sum, count, etc.)
- Calculations are performed at the database level for efficiency

## Common Formula Examples

### Total Budget (Chart Display)

```json
{
  "logic": {
    "text": "Total Budget",
    "html": "<span>Total Budget</span>"
  },
  "display": {
    "type": "CURRENCY",
    "currency": { "code": "USD", "name": "US Dollar" },
    "precision": 2,
    "function": "SUM"
  }
}
```

### Average Score (Chart Display)

```json
{
  "logic": {
    "text": "Average Quality Score",
    "html": "<span>Average Quality Score</span>"
  },
  "display": {
    "type": "NUMBER",
    "precision": 1,
    "function": "AVERAGE"
  }
}
```

### Task Count (Chart Display)

```json
{
  "logic": {
    "text": "Total Tasks",
    "html": "<span>Total Tasks</span>"
  },
  "display": {
    "type": "NUMBER",
    "precision": 0,
    "function": "COUNT"
  }
}
```

## Required Permissions

Custom field operations follow standard role-based permissions:

| Action | Required Role |
|--------|---------------|
| Create formula field | Project member with appropriate role |
| Update formula field | Project member with appropriate role |
| View formula results | Project member with view permissions |
| Delete formula field | Project member with appropriate role |

**Note**: The specific roles required depend on your project's custom role configuration. There are no special permission constants like CUSTOM_FIELDS_CREATE.

## Error Handling

### Validation Error
```json
{
  "errors": [{
    "message": "Validation error message",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

### Custom Field Not Found
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

## Best Practices

### Formula Design
- Use clear, descriptive names for formula fields
- Add descriptions explaining the calculation logic
- Test formulas with sample data before deployment
- Keep formulas simple and readable

### Performance Optimization
- Avoid deeply nested formula dependencies
- Use specific field references rather than wildcards
- Consider caching strategies for complex calculations
- Monitor formula performance in large projects

### Data Quality
- Validate source data before using in formulas
- Handle empty or null values appropriately
- Use appropriate precision for display types
- Consider edge cases in calculations

## Common Use Cases

1. **Financial Tracking**
   - Budget calculations
   - Profit/loss statements
   - Cost analysis
   - Revenue projections

2. **Project Management**
   - Completion percentages
   - Resource utilization
   - Timeline calculations
   - Performance metrics

3. **Quality Control**
   - Average scores
   - Pass/fail rates
   - Quality metrics
   - Compliance tracking

4. **Business Intelligence**
   - KPI calculations
   - Trend analysis
   - Comparative metrics
   - Dashboard values

## Limitations

- Formulas are for chart/dashboard aggregations only, not todo-level calculations
- Limited to the seven supported aggregation functions (SUM, AVERAGE, etc.)
- No complex mathematical expressions or field-to-field calculations
- Cannot reference multiple fields in a single formula
- Results are only visible in charts and dashboards
- The `logic` field is for display text only, not actual calculation logic

## Related Resources

- [Number Fields](/api/5.custom%20fields/number) - For static numeric values
- [Currency Fields](/api/5.custom%20fields/currency) - For monetary values
- [Reference Fields](/api/5.custom%20fields/reference) - For cross-project data
- [Lookup Fields](/api/5.custom%20fields/lookup) - For aggregated data
- [Custom Fields Overview](/api/5.custom%20fields/2.list-custom-fields) - General concepts

### /api/custom-fields/index

Source: https://blue.cc/api/custom-fields/index

## Overview

Custom fields allow you to extend Blue's standard record structure with additional data fields specific to your business needs. They provide a powerful way to capture structured data beyond the built-in fields like title, description, and due date.

Custom fields are defined at the workspace level and can be used across all records (todos) within that workspace. Each field has a specific type that determines its validation rules, input format, and display behavior.

## Available Operations

### Core Field Management

| Operation | Description | Link |
|-----------|-------------|------|
| **List Custom Fields** | Query and filter custom fields | [View Details →](/api/custom-fields/list-custom-fields) |
| **Create Custom Field** | Add new custom fields to workspaces | [View Details →](/api/custom-fields/create-custom-fields) |
| **Delete Custom Field** | Remove custom fields with proper cleanup | [View Details →](/api/custom-fields/delete-custom-field) |

### Field Values

| Operation | Description | Link |
|-----------|-------------|------|
| **Set Field Values** | Set and update custom field values on records | [View Details →](/api/custom-fields/custom-field-values) |

## Custom Field Types

### Text Fields

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **TEXT_SINGLE** | Single line text input | Names, titles, short descriptions | [View Details →](/api/custom-fields/text-single) |
| **TEXT_MULTI** | Multi-line text area | Long descriptions, notes, comments | [View Details →](/api/custom-fields/text-multi) |

### Selection Fields

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **SELECT_SINGLE** | Single selection dropdown | Status, priority, category | [View Details →](/api/custom-fields/select-single) |
| **SELECT_MULTI** | Multiple selection dropdown | Tags, skills, categories | [View Details →](/api/custom-fields/select-multi) |
| **CHECKBOX** | Boolean checkbox field | Flags, approvals, confirmations | [View Details →](/api/custom-fields/checkbox) |

### Numeric Fields

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **NUMBER** | Numeric input | Quantities, scores, measurements | [View Details →](/api/custom-fields/number) |
| **CURRENCY** | Currency amount | Budgets, costs, pricing | [View Details →](/api/custom-fields/currency) |
| **PERCENT** | Percentage value | Completion rates, discounts | [View Details →](/api/custom-fields/percent) |
| **RATING** | Star rating with custom scale | Performance ratings, satisfaction | [View Details →](/api/custom-fields/rating) |
| **FORMULA** | Calculated field based on other fields | Totals, computations, aggregations | [View Details →](/api/custom-fields/formula) |

### Contact Fields

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **EMAIL** | Email address with validation | Contact information, notifications | [View Details →](/api/custom-fields/email) |
| **PHONE** | Phone number with international formatting | Contact details, emergency contacts | [View Details →](/api/custom-fields/phone) |
| **URL** | Web URL with validation | Links, references, resources | [View Details →](/api/custom-fields/url) |

### Date and Time Fields

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **DATE** | Date picker | Deadlines, milestones, events | [View Details →](/api/custom-fields/date) |
| **TIME_DURATION** | Time tracking field | Work hours, duration estimates | [View Details →](/api/custom-fields/time-duration) |

### Location and Geography

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **LOCATION** | Geographic location (lat/lng) | Addresses, venues, service areas | [View Details →](/api/custom-fields/location) |
| **COUNTRY** | Country selector | Regional assignments, localization | [View Details →](/api/custom-fields/country) |

### File and Media

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **FILE** | File attachment | Documents, images, resources | [View Details →](/api/custom-fields/file) |

### System Fields

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **UNIQUE_ID** | Auto-generated unique identifier | Ticket numbers, order IDs | [View Details →](/api/custom-fields/unique-id) |
| **REFERENCE** | Link to records in another workspace | Cross-workspace relationships | [View Details →](/api/custom-fields/reference) |
| **LOOKUP** | Pull data from referenced records | Aggregate data from related records | [View Details →](/api/custom-fields/lookup) |

### Interactive Fields

| Type | Description | Use Cases | Link |
|------|-------------|-----------|------|
| **BUTTON** | Actionable button field | Triggers, actions, workflows | [View Details →](/api/custom-fields/button) |
| **CURRENCY_CONVERSION** | Currency conversion field | Multi-currency calculations | [View Details →](/api/custom-fields/currency-conversion) |

## Key Concepts

### Field Definition
- Custom fields are defined at the workspace level
- Each field has a unique name and type
- Fields can include validation rules and constraints
- Configuration options vary by field type

### Field Values
- Values are stored on individual records (todos)
- Each record can have different values for the same field
- Empty/null values are allowed for optional fields
- Values are validated according to field type rules

### Permissions Model
Custom fields respect workspace-level permissions:

| Role | Create Fields | Edit Fields* | Set Values | View Values |
|------|---------------|-------------|------------|-------------|
| **OWNER** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **ADMIN** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **MEMBER** | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **CLIENT** | ❌ No | ❌ No | ✅ Limited | ✅ Limited |

*Edit Fields refers to modifying field settings (name, type, options, validation rules) - not setting field values on records

### Custom Role Permissions
- Workspaces can have custom roles with field-specific permissions
- Fields can be marked as editable/non-editable per role
- Custom roles can restrict access to specific fields

## Common Patterns

### Creating a Basic Custom Field
```graphql
mutation CreateCustomField {
  createCustomField(input: {
    name: "Priority Level"
    type: SELECT_SINGLE
    description: "Task priority level"
    customFieldOptions: [
      { title: "Low", color: "#28a745" }
      { title: "Medium", color: "#ffc107" }
      { title: "High", color: "#fd7e14" }
      { title: "Critical", color: "#dc3545" }
    ]
  }) {
    id
    name
    type
    customFieldOptions {
      id
      title
      color
    }
  }
}
```

### Setting Field Values on Records
```graphql
mutation SetFieldValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    customFieldOptionId: "option_789"  # For SELECT_SINGLE
  })
}
```

### Querying Records with Custom Fields
```graphql
query GetTodosWithCustomFields {
  todos(projectId: "project_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      # Type-specific value fields
      text           # TEXT_SINGLE, TEXT_MULTI, EMAIL, etc.
      number         # NUMBER, CURRENCY, PERCENT, RATING
      selectedOption # SELECT_SINGLE
      selectedOptions # SELECT_MULTI
      checked        # CHECKBOX
      date           # DATE
    }
  }
}
```

### Creating Records with Custom Field Values
```graphql
mutation CreateTodoWithCustomFields {
  createTodo(input: {
    title: "New task"
    todoListId: "list_123"
    customFields: [
      { customFieldId: "priority_field", value: "high_priority_option" }
      { customFieldId: "budget_field", value: "5000" }
      { customFieldId: "notes_field", value: "Additional context here" }
    ]
  }) {
    id
    title
    customFields {
      customField { name }
      value
    }
  }
}
```

## Best Practices

### Field Design
1. **Use descriptive names** - Make field purposes clear
2. **Choose appropriate types** - Match field type to data requirements
3. **Set validation rules** - Use min/max values, required fields
4. **Organize logically** - Group related fields together

### Performance Considerations
1. **Limit field count** - Too many fields can impact performance
2. **Use pagination** - When querying large datasets
3. **Index key fields** - For fields used in filtering/sorting
4. **Avoid deep nesting** - Keep field relationships simple

### Data Quality
1. **Validate input** - Use appropriate field types with validation
2. **Provide defaults** - Set sensible default values where appropriate
3. **Use consistent formats** - Standardize data entry patterns
4. **Regular cleanup** - Remove unused fields and options

### User Experience
1. **Clear descriptions** - Provide helpful field descriptions
2. **Logical ordering** - Position fields in natural workflow order
3. **Visual hierarchy** - Use colors and formatting effectively
4. **Progressive disclosure** - Show fields when relevant

## Error Handling

Common errors when working with custom fields:

| Error Code | Description | Solution |
|------------|-------------|----------|
| `CUSTOM_FIELD_NOT_FOUND` | Field doesn't exist | Verify field ID and workspace access |
| `VALIDATION_ERROR` | Value doesn't match field type | Check format and validation rules |
| `UNAUTHORIZED` | Insufficient permissions | Ensure proper role level |
| `CUSTOM_FIELD_VALUE_PARSE_ERROR` | Invalid value format | Review field type requirements |



## Related Resources

- [Records API](/api/records) - Working with records that contain custom fields
- [Workspaces API](/api/workspaces) - Managing workspaces that contain custom fields
- [Automations API](/api/automations) - Automating workflows with custom field triggers
- [User Management API](/api/user-management) - Managing custom field permissions

### /api/custom-fields/list-custom-fields

Source: https://blue.cc/api/custom-fields/list-custom-fields

## List all Custom Fields

Custom fields allow you to extend Blue's standard record structure with additional data fields specific to your business needs. This endpoint retrieves custom fields available in your projects, with filtering by field type and pagination support.

### Basic Example

```graphql
query ListCustomFields {
  customFields(
    filter: { projectId: "project_123" }
    sort: position_ASC
    take: 20
  ) {
    items {
      id
      uid
      name
      type
      position
    }
    pageInfo {
      totalItems
      hasNextPage
    }
  }
}
```

### Advanced Example

```graphql
query ListCustomFieldsAdvanced {
  customFields(
    filter: {
      projectId: "project_123"
      types: [TEXT_SINGLE, NUMBER, SELECT_SINGLE]
    }
    sort: name_ASC
    skip: 20
    take: 50
  ) {
    items {
      id
      uid
      name
      type
      position
      description
      
      # Type-specific fields
      min              # For NUMBER, RATING, PERCENT
      max              # For NUMBER, RATING, PERCENT
      currency         # For CURRENCY type
      prefix           # For UNIQUE_ID type
      isDueDate        # For DATE type
      formula          # For FORMULA type
      
      # Validation settings
      editable
      metadata
      
      # For SELECT types
      customFieldOptions {
        id
        title
        color
        position
      }
    }
    pageInfo {
      totalItems
      hasNextPage
      hasPreviousPage
    }
  }
}
```

## Input Parameters

### CustomFieldFilterInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String | No | Filter by specific project ID |
| `types` | [CustomFieldType!] | No | Filter by custom field types |

### CustomFieldSort Values

| Value | Description |
|-------|-------------|
| `name_ASC` | Sort by name ascending (A-Z) |
| `name_DESC` | Sort by name descending (Z-A) |
| `createdAt_ASC` | Sort by creation date (oldest first) |
| `createdAt_DESC` | Sort by creation date (newest first) |
| `position_ASC` | Sort by position (default) |
| `position_DESC` | Sort by position descending |

### CustomFieldType Values

| Value | Description |
|-------|-------------|
| `TEXT_SINGLE` | Single line text input |
| `TEXT_MULTI` | Multi-line text area |
| `SELECT_SINGLE` | Single selection dropdown |
| `SELECT_MULTI` | Multiple selection dropdown |
| `CHECKBOX` | Boolean checkbox field |
| `RATING` | Star rating (1-5 or custom range) |
| `PHONE` | Phone number with validation |
| `NUMBER` | Numeric input |
| `CURRENCY` | Currency amount |
| `PERCENT` | Percentage value |
| `EMAIL` | Email address with validation |
| `URL` | Web URL with validation |
| `UNIQUE_ID` | Auto-generated unique identifier |
| `LOCATION` | Geographic location (lat/lng) |
| `FILE` | File attachment |
| `DATE` | Date picker |
| `COUNTRY` | Country selector |
| `FORMULA` | Calculated field based on other fields |
| `REFERENCE` | Link to records in another project |
| `LOOKUP` | Pull data from referenced records |
| `TIME_DURATION` | Time tracking field |
| `BUTTON` | Actionable button field |
| `CURRENCY_CONVERSION` | Currency conversion field |

### Pagination Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `skip` | Int | No | Number of items to skip (default: 0) |
| `take` | Int | No | Number of items to return (default: 20, max: 500) |

## Response Fields

### CustomField

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier |
| `uid` | String! | Unique user-friendly ID |
| `name` | String! | Display name of the field |
| `type` | CustomFieldType! | Type of the custom field |
| `position` | Float! | Sort order position |
| `description` | String | Optional field description |
| `min` | Float | Minimum value (NUMBER, RATING, PERCENT) |
| `max` | Float | Maximum value (NUMBER, RATING, PERCENT) |
| `currency` | String | Currency code (CURRENCY type) |
| `prefix` | String | Prefix for UNIQUE_ID generation |
| `isDueDate` | Boolean | Whether DATE field represents a due date |
| `formula` | JSON | Formula configuration (FORMULA type) |
| `editable` | Boolean | Whether current user can edit this field |
| `metadata` | JSON | Additional field configuration |
| `customFieldOptions` | [CustomFieldOption!] | Available options for SELECT types |

### CustomFieldOption

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier |
| `title` | String! | Display text for the option |
| `color` | String! | Hex color code |
| `position` | Float! | Sort order position |

### PageInfo

| Field | Type | Description |
|-------|------|-------------|
| `totalItems` | Int | Total number of custom fields |
| `hasNextPage` | Boolean! | Whether more pages exist |
| `hasPreviousPage` | Boolean! | Whether previous pages exist |
| `endCursor` | String | Cursor for pagination (deprecated - use offset-based pagination) |

## Required Permissions

Custom fields are accessible based on your project role. If you have a custom role with restricted field access, only fields marked as editable for your role will be returned.

| Role | Can List Custom Fields |
|------|----------------------|
| `OWNER` | ✅ Yes (all fields) |
| `ADMIN` | ✅ Yes (all fields) |
| `MEMBER` | ✅ Yes (based on role permissions) |
| `CLIENT` | ✅ Yes (based on role permissions) |

## Error Responses

### Project Not Found
```json
{
  "errors": [{
    "message": "Project not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```

### Invalid Field Type
```json
{
  "errors": [{
    "message": "Variable \"$filter\" got invalid value \"INVALID_TYPE\" at \"filter.types[0]\"; Value \"INVALID_TYPE\" does not exist in \"CustomFieldType\" enum.",
    "extensions": {
      "code": "GRAPHQL_VALIDATION_FAILED"
    }
  }]
}
```

## Important Notes

- Custom fields are scoped to projects - you must specify a `projectId` in the filter
- The `take` parameter is capped at 500 items per request for performance
- Fields are returned based on user permissions - custom roles may have restricted access
- The default sort order is by `position` ascending, which reflects the order shown in the UI
- This query supports single project filtering - for multi-project queries, use the nested CustomFieldQueries interface
- Some field types (like FORMULA and REFERENCE) may include additional nested data structures
- The `editable` field indicates whether the current user can modify values for this custom field

## Related Endpoints

- [Create a Custom Field](/api/custom-fields/create-custom-field) - Add new custom fields to a project
- [Update a Custom Field](/api/custom-fields/update-custom-field) - Modify existing custom field properties
- [Delete a Custom Field](/api/custom-fields/delete-custom-field) - Remove a custom field from a project
- [Set Custom Field Value](/api/custom-fields/set-custom-field-value) - Set values on records

### /api/custom-fields/location

Source: https://blue.cc/api/custom-fields/location

Location custom fields store geographic coordinates (latitude and longitude) for records. They support precise coordinate storage, geospatial queries, and efficient location-based filtering.

## Basic Example

Create a simple location field:

```graphql
mutation CreateLocationField {
  createCustomField(input: {
    name: "Meeting Location"
    type: LOCATION
    projectId: "proj_123"
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a location field with description:

```graphql
mutation CreateDetailedLocationField {
  createCustomField(input: {
    name: "Office Location"
    type: LOCATION
    projectId: "proj_123"
    description: "Primary office location coordinates"
  }) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the location field |
| `type` | CustomFieldType! | ✅ Yes | Must be `LOCATION` |
| `description` | String | No | Help text shown to users |

## Setting Location Values

Location fields store latitude and longitude coordinates:

```graphql
mutation SetLocationValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    latitude: 40.7128
    longitude: -74.0060
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the location custom field |
| `latitude` | Float | No | Latitude coordinate (-90 to 90) |
| `longitude` | Float | No | Longitude coordinate (-180 to 180) |

**Note**: While both parameters are optional in the schema, both coordinates are required for a valid location. If only one is provided, the location will be invalid.

## Coordinate Validation

### Valid Ranges

| Coordinate | Range | Description |
|------------|-------|-------------|
| Latitude | -90 to 90 | North/South position |
| Longitude | -180 to 180 | East/West position |

### Example Coordinates

| Location | Latitude | Longitude |
|----------|----------|-----------|
| New York City | 40.7128 | -74.0060 |
| London | 51.5074 | -0.1278 |
| Sydney | -33.8688 | 151.2093 |
| Tokyo | 35.6762 | 139.6503 |
| São Paulo | -23.5505 | -46.6333 |

## Creating Records with Location Values

When creating a new record with location data:

```graphql
mutation CreateRecordWithLocation {
  createTodo(input: {
    title: "Site Visit"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "location_field_id"
      value: "40.7128,-74.0060"  # Format: "latitude,longitude"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      latitude
      longitude
    }
  }
}
```

### Input Format for Creation

When creating records, location values use comma-separated format:

| Format | Example | Description |
|--------|---------|-------------|
| `"latitude,longitude"` | `"40.7128,-74.0060"` | Standard coordinate format |
| `"51.5074,-0.1278"` | London coordinates | No spaces around comma |
| `"-33.8688,151.2093"` | Sydney coordinates | Negative values allowed |

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `latitude` | Float | Latitude coordinate |
| `longitude` | Float | Longitude coordinate |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

## Important Limitations

### No Built-in Geocoding

Location fields store only coordinates - they do **not** include:
- Address-to-coordinates conversion
- Reverse geocoding (coordinates-to-address)
- Address validation or search
- Integration with mapping services
- Place name lookup

### External Services Required

For address functionality, you'll need to integrate external services:
- **Google Maps API** for geocoding
- **OpenStreetMap Nominatim** for free geocoding
- **MapBox** for mapping and geocoding
- **Here API** for location services

### Example Integration

```javascript
// Client-side geocoding example (not part of Blue API)
async function geocodeAddress(address) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  );
  const data = await response.json();
  
  if (data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry.location;
    
    // Now set the location field in Blue
    await setTodoCustomField({
      todoId: "todo_123",
      customFieldId: "location_field_456",
      latitude: lat,
      longitude: lng
    });
  }
}
```

## Required Permissions

| Action | Required Role |
|--------|---------------|
| Create location field | `OWNER`, `ADMIN`, or `MEMBER` in the project |
| Update location field | `OWNER`, `ADMIN`, or `MEMBER` in the project |
| Set location value | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` with edit permissions on the record |
| View location value | Any project member with read access to the record |

## Error Responses

### Invalid Coordinates
```json
{
  "errors": [{
    "message": "Invalid coordinates: latitude must be between -90 and 90",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

### Invalid Longitude
```json
{
  "errors": [{
    "message": "Invalid coordinates: longitude must be between -180 and 180",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

## Best Practices

### Data Collection
- Use GPS coordinates for precise locations
- Validate coordinates before storing
- Consider coordinate precision needs (6 decimal places ≈ 10cm accuracy)
- Store coordinates in decimal degrees (not degrees/minutes/seconds)

### User Experience
- Provide map interfaces for coordinate selection
- Show location previews when displaying coordinates
- Validate coordinates client-side before API calls
- Consider timezone implications for location data

### Performance
- Use spatial indexes for efficient queries
- Limit coordinate precision to needed accuracy
- Consider caching for frequently accessed locations
- Batch location updates when possible

## Common Use Cases

1. **Field Operations**
   - Equipment locations
   - Service call addresses
   - Inspection sites
   - Delivery locations

2. **Event Management**
   - Event venues
   - Meeting locations
   - Conference sites
   - Workshop locations

3. **Asset Tracking**
   - Equipment positions
   - Facility locations
   - Vehicle tracking
   - Inventory locations

4. **Geographic Analysis**
   - Service coverage areas
   - Customer distribution
   - Market analysis
   - Territory management

## Integration Features

### With Lookups
- Reference location data from other records
- Find records by geographic proximity
- Aggregate location-based data
- Cross-reference coordinates

### With Automations
- Trigger actions based on location changes
- Create geofenced notifications
- Update related records when locations change
- Generate location-based reports

### With Formulas
- Calculate distances between locations
- Determine geographic centers
- Analyze location patterns
- Create location-based metrics

## Limitations

- No built-in geocoding or address conversion
- No mapping interface provided
- Requires external services for address functionality
- Limited to coordinate storage only
- No automatic location validation beyond range checking

## Related Resources

- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General concepts
- [Google Maps API](https://developers.google.com/maps) - Geocoding services
- [OpenStreetMap Nominatim](https://nominatim.org/) - Free geocoding
- [MapBox API](https://docs.mapbox.com/) - Mapping and geocoding services

### /api/custom-fields/lookup

Source: https://blue.cc/api/custom-fields/lookup

Lookup custom fields automatically pull data from records referenced by [Reference fields](/api/custom-fields/reference), displaying information from linked records without manual copying. They update automatically when referenced data changes.

## Basic Example

Create a lookup field to display tags from referenced records:

```graphql
mutation CreateLookupField {
  createCustomField(input: {
    name: "Related Todo Tags"
    type: LOOKUP
    lookupOption: {
      referenceId: "reference_field_id"
      lookupType: TODO_TAG
    }
    description: "Tags from related todos"
  }) {
    id
    name
    type
    lookupOption
  }
}
```

## Advanced Example

Create a lookup field to extract custom field values from referenced records:

```graphql
mutation CreateCustomFieldLookup {
  createCustomField(input: {
    name: "Referenced Budget Values"
    type: LOOKUP
    lookupOption: {
      referenceId: "project_reference_field_id"
      lookupId: "budget_custom_field_id"
      lookupType: TODO_CUSTOM_FIELD
    }
    description: "Budget values from referenced todos"
  }) {
    id
    name
    type
    lookupOption
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the lookup field |
| `type` | CustomFieldType! | ✅ Yes | Must be `LOOKUP` |
| `lookupOption` | CustomFieldLookupOptionInput! | ✅ Yes | Lookup configuration |
| `description` | String | No | Help text shown to users |

## Lookup Configuration

### CustomFieldLookupOptionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `referenceId` | String! | ✅ Yes | ID of the reference field to pull data from |
| `lookupId` | String | No | ID of the specific custom field to lookup (required for TODO_CUSTOM_FIELD type) |
| `lookupType` | CustomFieldLookupType! | ✅ Yes | Type of data to extract from referenced records |

## Lookup Types

### CustomFieldLookupType Values

| Type | Description | Returns |
|------|-------------|---------|
| `TODO_DUE_DATE` | Due dates from referenced todos | Array of date objects with start/end dates and timezone |
| `TODO_CREATED_AT` | Creation dates from referenced todos | Array of creation timestamps |
| `TODO_UPDATED_AT` | Last updated dates from referenced todos | Array of update timestamps |
| `TODO_TAG` | Tags from referenced todos | Array of tag objects with id, name, and color |
| `TODO_ASSIGNEE` | Assignees from referenced todos | Array of user objects |
| `TODO_DESCRIPTION` | Descriptions from referenced todos | Array of text descriptions (empty values filtered out) |
| `TODO_LIST` | Todo list names from referenced todos | Array of list titles |
| `TODO_CUSTOM_FIELD` | Custom field values from referenced todos | Array of values based on the field type |

## Response Fields

### CustomField Response (for lookup fields)

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field |
| `name` | String! | Display name of the lookup field |
| `type` | CustomFieldType! | Will be `LOOKUP` |
| `customFieldLookupOption` | CustomFieldLookupOption | Lookup configuration and results |
| `createdAt` | DateTime! | When the field was created |
| `updatedAt` | DateTime! | When the field was last updated |

### CustomFieldLookupOption Structure

| Field | Type | Description |
|-------|------|-------------|
| `lookupType` | CustomFieldLookupType! | Type of lookup being performed |
| `lookupResult` | JSON | The extracted data from referenced records |
| `reference` | CustomField | The reference field being used as source |
| `lookup` | CustomField | The specific field being looked up (for TODO_CUSTOM_FIELD) |
| `parentCustomField` | CustomField | The parent lookup field |
| `parentLookup` | CustomField | Parent lookup in chain (for nested lookups) |

## How Lookups Work

1. **Data Extraction**: Lookups extract specific data from all records linked through a reference field
2. **Automatic Updates**: When referenced records change, lookup values update automatically
3. **Read-Only**: Lookup fields cannot be edited directly - they always reflect current referenced data
4. **No Calculations**: Lookups extract and display data as-is without aggregations or calculations

## TODO_CUSTOM_FIELD Lookups

When using `TODO_CUSTOM_FIELD` type, you must specify which custom field to extract using the `lookupId` parameter:

```graphql
mutation CreateCustomFieldValueLookup {
  createCustomField(input: {
    name: "Project Status Values"
    type: LOOKUP
    lookupOption: {
      referenceId: "linked_projects_reference_field"
      lookupId: "status_custom_field_id"
      lookupType: TODO_CUSTOM_FIELD
    }
  }) {
    id
  }
}
```

This extracts the values of the specified custom field from all referenced records.

## Querying Lookup Data

```graphql
query GetLookupValues {
  todo(id: "todo_123") {
    customFields {
      id
      customField {
        name
        type
        customFieldLookupOption {
          lookupType
          lookupResult
          reference {
            id
            name
          }
          lookup {
            id
            name
            type
          }
        }
      }
    }
  }
}
```

## Example Lookup Results

### Tag Lookup Result
```json
{
  "lookupResult": [
    {
      "id": "tag_123",
      "title": "urgent",
      "color": "#ff0000"
    },
    {
      "id": "tag_456",
      "title": "development",
      "color": "#00ff00"
    }
  ]
}
```

### Assignee Lookup Result
```json
{
  "lookupResult": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

### Custom Field Lookup Result
Results vary based on the custom field type being looked up. For example, a currency field lookup might return:
```json
{
  "lookupResult": [
    {
      "value": 1000,
      "currency": "USD"
    },
    {
      "value": 2500,
      "currency": "EUR"
    }
  ]
}
```

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create lookup field | `OWNER` or `ADMIN` role at project level |
| Update lookup field | `OWNER` or `ADMIN` role at project level |
| View lookup results | Standard record view permissions |
| Access source data | View permissions on referenced project required |

**Important**: Users must have view permissions on both the current project and the referenced project to see lookup results.

## Error Responses

### Invalid Reference Field
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

### Circular Lookup Detected
```json
{
  "errors": [{
    "message": "Circular lookup detected",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

### Missing Lookup ID for TODO_CUSTOM_FIELD
```json
{
  "errors": [{
    "message": "lookupId is required when lookupType is TODO_CUSTOM_FIELD",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

## Best Practices

1. **Clear Naming**: Use descriptive names that indicate what data is being looked up
2. **Appropriate Types**: Choose the lookup type that matches your data needs
3. **Performance**: Lookups process all referenced records, so be mindful of reference fields with many links
4. **Permissions**: Ensure users have access to referenced projects for lookups to work

## Common Use Cases

### Cross-Project Visibility
Display tags, assignees, or statuses from related projects without manual synchronization.

### Dependency Tracking
Show due dates or completion status of tasks that current work depends on.

### Resource Overview
Display all team members assigned to referenced tasks for resource planning.

### Status Aggregation
Collect all unique statuses from related tasks to see project health at a glance.

## Limitations

- Lookup fields are read-only and cannot be edited directly
- No aggregation functions (SUM, COUNT, AVG) - lookups only extract data
- No filtering options - all referenced records are included
- Circular lookup chains are prevented to avoid infinite loops
- Results reflect current data and update automatically

## Related Resources

- [Reference Fields](/api/custom-fields/reference) - Create links to records for lookup sources
- [Custom Field Values](/api/custom-fields/custom-field-values) - Set values on editable custom fields
- [List Custom Fields](/api/custom-fields/list-custom-fields) - Query all custom fields in a project

### /api/custom-fields/number

Source: https://blue.cc/api/custom-fields/number

Number custom fields allow you to store numeric values for records. They support validation constraints, decimal precision, and can be used for quantities, scores, measurements, or any numeric data that doesn't require special formatting.

## Basic Example

Create a simple number field:

```graphql
mutation CreateNumberField {
  createCustomField(input: {
    name: "Priority Score"
    type: NUMBER
    projectId: "proj_123"
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a number field with constraints and prefix:

```graphql
mutation CreateConstrainedNumberField {
  createCustomField(input: {
    name: "Team Size"
    type: NUMBER
    projectId: "proj_123"
    min: 1
    max: 100
    prefix: "#"
    description: "Number of team members assigned to this project"
  }) {
    id
    name
    type
    min
    max
    prefix
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the number field |
| `type` | CustomFieldType! | ✅ Yes | Must be `NUMBER` |
| `projectId` | String! | ✅ Yes | ID of the project to create the field in |
| `min` | Float | No | Minimum value constraint (UI guidance only) |
| `max` | Float | No | Maximum value constraint (UI guidance only) |
| `prefix` | String | No | Display prefix (e.g., "#", "~", "$") |
| `description` | String | No | Help text shown to users |

## Setting Number Values

Number fields store decimal values with optional validation:

### Simple Number Value

```graphql
mutation SetNumberValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    number: 42.5
  })
}
```

### Integer Value

```graphql
mutation SetIntegerValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    number: 100
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the number custom field |
| `number` | Float | No | Numeric value to store |

## Value Constraints

### Min/Max Constraints (UI Guidance)

**Important**: Min/max constraints are stored but NOT enforced server-side. They serve as UI guidance for frontend applications.

```graphql
mutation CreateConstrainedField {
  createCustomField(input: {
    name: "Rating"
    type: NUMBER
    projectId: "proj_123"
    min: 1
    max: 10
    description: "Rating from 1 to 10"
  }) {
    id
    name
    min
    max
  }
}
```

**Client-Side Validation Required**: Frontend applications must implement validation logic to enforce min/max constraints.

### Supported Value Types

| Type | Example | Description |
|------|---------|-------------|
| Integer | `42` | Whole numbers |
| Decimal | `42.5` | Numbers with decimal places |
| Negative | `-10` | Negative values (if no min constraint) |
| Zero | `0` | Zero value |

**Note**: Min/max constraints are NOT validated server-side. Values outside the specified range will be accepted and stored.

## Creating Records with Number Values

When creating a new record with number values:

```graphql
mutation CreateRecordWithNumber {
  createTodo(input: {
    title: "Performance Review"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "score_field_id"
      number: 85.5
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        min
        max
        prefix
      }
      number
      value
    }
  }
}
```

### Supported Input Formats

When creating records, use the `number` parameter (not `value`) in the custom fields array:

```graphql
customFields: [{
  customFieldId: "field_id"
  number: 42.5  # Use number parameter, not value
}]
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `number` | Float | The numeric value |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

### CustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field definition |
| `name` | String! | Display name of the field |
| `type` | CustomFieldType! | Always `NUMBER` |
| `min` | Float | Minimum allowed value |
| `max` | Float | Maximum allowed value |
| `prefix` | String | Display prefix |
| `description` | String | Help text |

**Note**: If the number value is not set, the `number` field will be `null`.

## Filtering and Querying

Number fields support comprehensive numeric filtering:

```graphql
query FilterByNumberRange {
  todos(filter: {
    customFields: [{
      customFieldId: "score_field_id"
      operator: GTE
      number: 80
    }]
  }) {
    id
    title
    customFields {
      number
    }
  }
}
```

### Supported Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `EQ` | Equal to | `number = 42` |
| `NE` | Not equal to | `number ≠ 42` |
| `GT` | Greater than | `number > 42` |
| `GTE` | Greater than or equal | `number ≥ 42` |
| `LT` | Less than | `number < 42` |
| `LTE` | Less than or equal | `number ≤ 42` |
| `IN` | In array | `number in [1, 2, 3]` |
| `NIN` | Not in array | `number not in [1, 2, 3]` |
| `IS` | Is null/not null | `number is null` |

### Range Filtering

```graphql
query FilterByRange {
  todos(filter: {
    customFields: [{
      customFieldId: "priority_field_id"
      operator: GTE
      number: 5
    }]
  }) {
    id
    title
  }
}
```

## Display Formatting

### With Prefix

If a prefix is set, it will be displayed:

| Value | Prefix | Display |
|-------|--------|---------|
| `42` | `"#"` | `#42` |
| `100` | `"~"` | `~100` |
| `3.14` | `"π"` | `π3.14` |

### Decimal Precision

Numbers maintain their decimal precision:

| Input | Stored | Displayed |
|-------|--------|-----------|
| `42` | `42.0` | `42` |
| `42.5` | `42.5` | `42.5` |
| `42.123` | `42.123` | `42.123` |

## Required Permissions

| Action | Required Permission |
|--------|--------------------|
| Create number field | Company role: `OWNER` or `ADMIN` |
| Update number field | Company role: `OWNER` or `ADMIN` |
| Set number value | Any company role (`OWNER`, `ADMIN`, `MEMBER`, `CLIENT`) or custom project role with edit permission |
| View number value | Standard record view permissions |
| Use in filtering | Standard record view permissions |

## Error Responses

### Invalid Number Format
```json
{
  "errors": [{
    "message": "Invalid number format",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

**Note**: Min/max validation errors do NOT occur server-side. Constraint validation must be implemented in your frontend application.

### Not a Number
```json
{
  "errors": [{
    "message": "Value is not a valid number",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

## Best Practices

### Constraint Design
- Set realistic min/max values for UI guidance
- Implement client-side validation to enforce constraints
- Use constraints to provide user feedback in forms
- Consider if negative values are valid for your use case

### Value Precision
- Use appropriate decimal precision for your needs
- Consider rounding for display purposes
- Be consistent with precision across related fields

### Display Enhancement
- Use meaningful prefixes for context
- Consider units in field names (e.g., "Weight (kg)")
- Provide clear descriptions for validation rules

## Common Use Cases

1. **Scoring Systems**
   - Performance ratings
   - Quality scores
   - Priority levels
   - Customer satisfaction ratings

2. **Measurements**
   - Quantities and amounts
   - Dimensions and sizes
   - Durations (in numeric format)
   - Capacities and limits

3. **Business Metrics**
   - Revenue figures
   - Conversion rates
   - Budget allocations
   - Target numbers

4. **Technical Data**
   - Version numbers
   - Configuration values
   - Performance metrics
   - Threshold settings

## Integration Features

### With Charts and Dashboards
- Use NUMBER fields in chart calculations
- Create numerical visualizations
- Track trends over time

### With Automations
- Trigger actions based on number thresholds
- Update related fields based on number changes
- Send notifications for specific values

### With Lookups
- Aggregate numbers from related records
- Calculate totals and averages
- Find min/max values across relationships

### With Charts
- Create numerical visualizations
- Track trends over time
- Compare values across records

## Limitations

- **No server-side validation** of min/max constraints
- **Client-side validation required** for constraint enforcement
- No built-in currency formatting (use CURRENCY type instead)
- No automatic percentage symbol (use PERCENT type instead)
- No unit conversion capabilities
- Decimal precision limited by database Decimal type
- No mathematical formula evaluation in the field itself

## Related Resources

- [Custom Fields Overview](/api/custom-fields/1.index) - General custom field concepts
- [Currency Custom Field](/api/custom-fields/currency) - For monetary values
- [Percent Custom Field](/api/custom-fields/percent) - For percentage values
- [Automations API](/api/automations/1.index) - Create number-based automations

### /api/custom-fields/percent

Source: https://blue.cc/api/custom-fields/percent

Percent custom fields allow you to store percentage values for records. They automatically handle the % symbol for input and display, while storing the raw numeric value internally. Perfect for completion rates, success rates, or any percentage-based metrics.

## Basic Example

Create a simple percent field:

```graphql
mutation CreatePercentField {
  createCustomField(input: {
    name: "Completion Rate"
    type: PERCENT
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a percent field with description:

```graphql
mutation CreatePercentField {
  createCustomField(input: {
    name: "Success Rate"
    type: PERCENT
    description: "Percentage of successful outcomes for this process"
  }) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the percent field |
| `type` | CustomFieldType! | ✅ Yes | Must be `PERCENT` |
| `description` | String | No | Help text shown to users |

**Note**: Project context is automatically determined from your authentication headers. No `projectId` parameter is needed.

**Note**: PERCENT fields do not support min/max constraints or prefix formatting like NUMBER fields.

## Setting Percent Values

Percent fields store numeric values with automatic % symbol handling:

### With Percent Symbol

```graphql
mutation SetPercentWithSymbol {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    number: 75.5
  }) {
    id
    customField {
      value  # Returns { number: 75.5 }
    }
  }
}
```

### Direct Numeric Value

```graphql
mutation SetPercentNumeric {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    number: 100
  }) {
    id
    customField {
      value  # Returns { number: 100.0 }
    }
  }
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the percent custom field |
| `number` | Float | No | Numeric percentage value (e.g., 75.5 for 75.5%) |

## Value Storage and Display

### Storage Format
- **Internal storage**: Raw numeric value (e.g., 75.5)
- **Database**: Stored as `Decimal` in `number` column
- **GraphQL**: Returned as `Float` type

### Display Format
- **User interface**: Client applications must append % symbol (e.g., "75.5%")
- **Charts**: Displays with % symbol when output type is PERCENTAGE
- **API responses**: Raw numeric value without % symbol (e.g., 75.5)

## Creating Records with Percent Values

When creating a new record with percent values:

```graphql
mutation CreateRecordWithPercent {
  createTodo(input: {
    title: "Marketing Campaign"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "success_rate_field_id"
      value: "85.5%"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # Percent is accessed here as { number: 85.5 }
      }
    }
  }
}
```

### Supported Input Formats

| Format | Example | Result |
|--------|---------|---------|
| With % symbol | `"75.5%"` | Stored as 75.5 |
| Without % symbol | `"75.5"` | Stored as 75.5 |
| Integer percentage | `"100"` | Stored as 100.0 |
| Decimal percentage | `"33.333"` | Stored as 33.333 |

**Note**: The % symbol is automatically stripped from input and added back during display.

## Querying Percent Values

When querying records with percent custom fields, access the value through the `customField.value.number` path:

```graphql
query GetRecordWithPercent {
  todo(id: "todo_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # For PERCENT type, contains { number: 75.5 }
      }
    }
  }
}
```

The response will include the percentage as a raw number:

```json
{
  "data": {
    "todo": {
      "customFields": [{
        "customField": {
          "name": "Completion Rate",
          "type": "PERCENT",
          "value": {
            "number": 75.5
          }
        }
      }]
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition (contains the percent value) |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

**Important**: Percent values are accessed through the `customField.value.number` field. The % symbol is not included in stored values and must be added by client applications for display.

## Filtering and Querying

Percent fields support the same filtering as NUMBER fields:

```graphql
query FilterByPercentRange {
  todos(filter: {
    customFields: [{
      customFieldId: "completion_rate_field_id"
      operator: GTE
      number: 80
    }]
  }) {
    id
    title
    customFields {
      number
    }
  }
}
```

### Supported Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `EQ` | Equal to | `percentage = 75` |
| `NE` | Not equal to | `percentage ≠ 75` |
| `GT` | Greater than | `percentage > 75` |
| `GTE` | Greater than or equal | `percentage ≥ 75` |
| `LT` | Less than | `percentage < 75` |
| `LTE` | Less than or equal | `percentage ≤ 75` |
| `IN` | Value in list | `percentage in [50, 75, 100]` |
| `NIN` | Value not in list | `percentage not in [0, 25]` |
| `IS` | Check for null with `values: null` | `percentage is null` |
| `NOT` | Check for not null with `values: null` | `percentage is not null` |

### Range Filtering

For range filtering, use multiple operators:

```graphql
query FilterHighPerformers {
  todos(filter: {
    customFields: [{
      customFieldId: "success_rate_field_id"
      operator: GTE
      number: 90
    }]
  }) {
    id
    title
    customFields {
      customField {
        value  # Returns { number: 95.5 } for example
      }
    }
  }
}
```

## Percentage Value Ranges

### Common Ranges

| Range | Description | Use Case |
|-------|-------------|----------|
| `0-100` | Standard percentage | Completion rates, success rates |
| `0-∞` | Unlimited percentage | Growth rates, performance metrics |
| `-∞-∞` | Any value | Change rates, variance |

### Example Values

| Input | Stored | Display |
|-------|--------|---------|
| `"50%"` | `50.0` | `50%` |
| `"100"` | `100.0` | `100%` |
| `"150.5"` | `150.5` | `150.5%` |
| `"-25"` | `-25.0` | `-25%` |

## Chart Aggregation

Percent fields support aggregation in dashboard charts and reports. Available functions include:

- `AVERAGE` - Mean percentage value
- `COUNT` - Number of records with values
- `MIN` - Lowest percentage value
- `MAX` - Highest percentage value 
- `SUM` - Total of all percentage values

These aggregations are available when creating charts and dashboards, not in direct GraphQL queries.

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create percent field | `OWNER` or `ADMIN` role at project level |
| Update percent field | `OWNER` or `ADMIN` role at project level |
| Set percent value | Standard record edit permissions |
| View percent value | Standard record view permissions |
| Use chart aggregation | Standard chart viewing permissions |

## Error Responses

### Invalid Percentage Format
```json
{
  "errors": [{
    "message": "Invalid percentage value",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

### Not a Number
```json
{
  "errors": [{
    "message": "Value is not a valid number",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

## Best Practices

### Value Entry
- Allow users to enter with or without % symbol
- Validate reasonable ranges for your use case
- Provide clear context about what 100% represents

### Display
- Always show % symbol in user interfaces
- Use appropriate decimal precision
- Consider color coding for ranges (red/yellow/green)

### Data Interpretation
- Document what 100% means in your context
- Handle values over 100% appropriately
- Consider whether negative values are valid

## Common Use Cases

1. **Project Management**
   - Task completion rates
   - Project progress
   - Resource utilization
   - Sprint velocity

2. **Performance Tracking**
   - Success rates
   - Error rates
   - Efficiency metrics
   - Quality scores

3. **Financial Metrics**
   - Growth rates
   - Profit margins
   - Discount amounts
   - Change percentages

4. **Analytics**
   - Conversion rates
   - Click-through rates
   - Engagement metrics
   - Performance indicators

## Integration Features

### With Formulas
- Reference PERCENT fields in calculations
- Automatic % symbol formatting in formula outputs
- Combine with other numeric fields

### With Automations
- Trigger actions based on percentage thresholds
- Send notifications for milestone percentages
- Update status based on completion rates

### With Lookups
- Aggregate percentages from related records
- Calculate average success rates
- Find highest/lowest performing items

### With Charts
- Create percentage-based visualizations
- Track progress over time
- Compare performance metrics

## Differences from NUMBER Fields

### What's Different
- **Input handling**: Automatically strips % symbol
- **Display**: Automatically adds % symbol
- **Constraints**: No min/max validation
- **Formatting**: No prefix support

### What's the Same
- **Storage**: Same database column and type
- **Filtering**: Same query operators
- **Aggregation**: Same aggregation functions
- **Permissions**: Same permission model

## Limitations

- No min/max value constraints
- No prefix formatting options
- No automatic validation of 0-100% range
- No conversion between percentage formats (e.g., 0.75 ↔ 75%)
- Values over 100% are allowed

## Related Resources

- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General custom field concepts
- [Number Custom Field](/api/custom-fields/number) - For raw numeric values
- [Automations API](/api/automations/index) - Create percentage-based automations

### /api/custom-fields/phone

Source: https://blue.cc/api/custom-fields/phone

Phone custom fields allow you to store phone numbers in records with built-in validation and international formatting. They're ideal for tracking contact information, emergency contacts, or any phone-related data in your projects.

## Basic Example

Create a simple phone field:

```graphql
mutation CreatePhoneField {
  createCustomField(input: {
    name: "Contact Phone"
    type: PHONE
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a phone field with description:

```graphql
mutation CreateDetailedPhoneField {
  createCustomField(input: {
    name: "Emergency Contact"
    type: PHONE
    description: "Emergency contact number with country code"
  }) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the phone field |
| `type` | CustomFieldType! | ✅ Yes | Must be `PHONE` |
| `description` | String | No | Help text shown to users |

**Note**: Custom fields are automatically associated with the project based on the user's current project context. No `projectId` parameter is required.

## Setting Phone Values

To set or update a phone value on a record:

```graphql
mutation SetPhoneValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    text: "+1 234 567 8900"
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the phone custom field |
| `text` | String | No | Phone number with country code |
| `regionCode` | String | No | Country code (automatically detected) |

**Note**: While `text` is optional in the schema, a phone number is required for the field to be meaningful. When using `setTodoCustomField`, no validation is performed - you can store any text value and regionCode. The automatic detection only happens during record creation.

## Creating Records with Phone Values

When creating a new record with phone values:

```graphql
mutation CreateRecordWithPhone {
  createTodo(input: {
    title: "Call client"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "phone_field_id"
      value: "+1-555-123-4567"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      text
      regionCode
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `text` | String | The formatted phone number (international format) |
| `regionCode` | String | The country code (e.g., "US", "GB", "CA") |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

## Phone Number Validation

**Important**: Phone number validation and formatting only occurs when creating new records via `createTodo`. When updating existing phone values using `setTodoCustomField`, no validation is performed and the values are stored as provided.

### Accepted Formats (During Record Creation)
Phone numbers must include a country code in one of these formats:

- **E.164 format (preferred)**: `+12345678900`
- **International format**: `+1 234 567 8900`
- **International with punctuation**: `+1 (234) 567-8900`
- **Country code with dashes**: `+1-234-567-8900`

**Note**: National formats without country code (like `(234) 567-8900`) will be rejected during record creation.

### Validation Rules (During Record Creation)
- Uses libphonenumber-js for parsing and validation
- Accepts various international phone number formats
- Automatically detects country from the number
- Formats number in international display format (e.g., `+1 234 567 8900`)
- Extracts and stores country code separately (e.g., `US`)

### Valid Phone Examples
```
+12345678900           # E.164 format
+1 234 567 8900        # International format
+1 (234) 567-8900      # With parentheses
+1-234-567-8900        # With dashes
+44 20 7946 0958       # UK number
+33 1 42 86 83 26      # French number
```

### Invalid Phone Examples
```
(234) 567-8900         # Missing country code
234-567-8900           # Missing country code
123                    # Too short
invalid-phone          # Not a number
+1 234                 # Incomplete number
```

## Storage Format

When creating records with phone numbers:
- **text**: Stored in international format (e.g., `+1 234 567 8900`) after validation
- **regionCode**: Stored as ISO country code (e.g., `US`, `GB`, `CA`) automatically detected

When updating via `setTodoCustomField`:
- **text**: Stored exactly as provided (no formatting)
- **regionCode**: Stored exactly as provided (no validation)

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create phone field | `OWNER` or `ADMIN` role at project level |
| Update phone field | `OWNER` or `ADMIN` role at project level |
| Set phone value | Standard record edit permissions |
| View phone value | Standard record view permissions |

## Error Responses

### Invalid Phone Format
```json
{
  "errors": [{
    "message": "Invalid phone number format.",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

### Missing Country Code
```json
{
  "errors": [{
    "message": "Invalid phone number format.",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

## Best Practices

### Data Entry
- Always include country code in phone numbers
- Use E.164 format for consistency
- Validate numbers before storing for important operations
- Consider regional preferences for display formatting

### Data Quality
- Store numbers in international format for global compatibility
- Use regionCode for country-specific features
- Validate phone numbers before critical operations (SMS, calls)
- Consider time zone implications for contact timing

### International Considerations
- Country code is automatically detected and stored
- Numbers are formatted in international standard
- Regional display preferences can use regionCode
- Consider local dialing conventions when displaying

## Common Use Cases

1. **Contact Management**
   - Client phone numbers
   - Vendor contact information
   - Team member phone numbers
   - Support contact details

2. **Emergency Contacts**
   - Emergency contact numbers
   - On-call contact information
   - Crisis response contacts
   - Escalation phone numbers

3. **Customer Support**
   - Customer phone numbers
   - Support callback numbers
   - Verification phone numbers
   - Follow-up contact numbers

4. **Sales & Marketing**
   - Lead phone numbers
   - Campaign contact lists
   - Partner contact information
   - Referral source phones

## Integration Features

### With Automations
- Trigger actions when phone fields are updated
- Send SMS notifications to stored phone numbers
- Create follow-up tasks based on phone changes
- Route calls based on phone number data

### With Lookups
- Reference phone data from other records
- Aggregate phone lists from multiple sources
- Find records by phone number
- Cross-reference contact information

### With Forms
- Automatic phone validation
- International format checking
- Country code detection
- Real-time format feedback

## Limitations

- Requires country code for all numbers
- No built-in SMS or calling capabilities
- No phone number verification beyond format checking
- No storage of phone metadata (carrier, type, etc.)
- National format numbers without country code are rejected
- No automatic phone number formatting in UI beyond international standard

## Related Resources

- [Text Fields](/api/custom-fields/text-single) - For non-phone text data
- [Email Fields](/api/custom-fields/email) - For email addresses
- [URL Fields](/api/custom-fields/url) - For website addresses
- [Custom Fields Overview](/custom-fields/list-custom-fields) - General concepts

### /api/custom-fields/rating

Source: https://blue.cc/api/custom-fields/rating

Rating custom fields allow you to store numeric ratings in records with configurable minimum and maximum values. They're ideal for performance ratings, satisfaction scores, priority levels, or any numeric scale-based data in your projects.

## Basic Example

Create a simple rating field with default 0-5 scale:

```graphql
mutation CreateRatingField {
  createCustomField(input: {
    name: "Performance Rating"
    type: RATING
    projectId: "proj_123"
    max: 5
  }) {
    id
    name
    type
    min
    max
  }
}
```

## Advanced Example

Create a rating field with custom scale and description:

```graphql
mutation CreateDetailedRatingField {
  createCustomField(input: {
    name: "Customer Satisfaction"
    type: RATING
    projectId: "proj_123"
    description: "Rate customer satisfaction from 1-10"
    min: 1
    max: 10
  }) {
    id
    name
    type
    description
    min
    max
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the rating field |
| `type` | CustomFieldType! | ✅ Yes | Must be `RATING` |
| `projectId` | String! | ✅ Yes | The project ID where this field will be created |
| `description` | String | No | Help text shown to users |
| `min` | Float | No | Minimum rating value (no default) |
| `max` | Float | No | Maximum rating value |

## Setting Rating Values

To set or update a rating value on a record:

```graphql
mutation SetRatingValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    value: "4.5"
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the rating custom field |
| `value` | String! | ✅ Yes | Rating value as string (within the configured range) |

## Creating Records with Rating Values

When creating a new record with rating values:

```graphql
mutation CreateRecordWithRating {
  createTodo(input: {
    title: "Review customer feedback"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "rating_field_id"
      value: "4.5"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        min
        max
      }
      value
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `value` | Float | The stored rating value (accessed via customField.value) |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

**Note**: The rating value is actually accessed via `customField.value.number` in queries.

### CustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field |
| `name` | String! | Display name of the rating field |
| `type` | CustomFieldType! | Always `RATING` |
| `min` | Float | Minimum allowed rating value |
| `max` | Float | Maximum allowed rating value |
| `description` | String | Help text for the field |

## Rating Validation

### Value Constraints
- Rating values must be numeric (Float type)
- Values must be within the configured min/max range
- If no minimum is specified, there is no default value
- Maximum value is optional but recommended

### Validation Rules
**Important**: Validation only occurs when submitting forms, not when using `setTodoCustomField` directly.

- Input is parsed as a float number (when using forms)
- Must be greater than or equal to the minimum value (when using forms)
- Must be less than or equal to the maximum value (when using forms)
- `setTodoCustomField` accepts any string value without validation

### Valid Rating Examples
For a field with min=1, max=5:
```
1       # Minimum value
5       # Maximum value
3.5     # Decimal values allowed
2.75    # Precise decimal ratings
```

### Invalid Rating Examples
For a field with min=1, max=5:
```
0       # Below minimum
6       # Above maximum
-1      # Negative value (below min)
abc     # Non-numeric value
```

## Configuration Options

### Rating Scale Setup
```graphql
# 1-5 star rating
mutation CreateStarRating {
  createCustomField(input: {
    name: "Star Rating"
    type: RATING
    projectId: "proj_123"
    min: 1
    max: 5
  }) {
    id
    min
    max
  }
}

# 0-100 percentage rating
mutation CreatePercentageRating {
  createCustomField(input: {
    name: "Completion Percentage"
    type: RATING
    projectId: "proj_123"
    min: 0
    max: 100
  }) {
    id
    min
    max
  }
}
```

### Common Rating Scales
- **1-5 Stars**: `min: 1, max: 5`
- **0-10 NPS**: `min: 0, max: 10`
- **1-10 Performance**: `min: 1, max: 10`
- **0-100 Percentage**: `min: 0, max: 100`
- **Custom Scale**: Any numeric range

## Required Permissions

Custom field operations follow standard role-based permissions:

| Action | Required Role |
|--------|---------------|
| Create rating field | Project member with appropriate role |
| Update rating field | Project member with appropriate role |
| Set rating value | Project member with field edit permissions |
| View rating value | Project member with view permissions |

**Note**: The specific roles required depend on your project's custom role configuration and field-level permissions.

## Error Responses

### Validation Error (Forms Only)
```json
{
  "errors": [{
    "message": "Validation error message",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

**Important**: Rating value validation (min/max constraints) only occurs when submitting forms, not when using `setTodoCustomField` directly.

### Custom Field Not Found
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

## Best Practices

### Scale Design
- Use consistent rating scales across similar fields
- Consider user familiarity (1-5 stars, 0-10 NPS)
- Set appropriate minimum values (0 vs 1)
- Define clear meaning for each rating level

### Data Quality
- Validate rating values before storing
- Use decimal precision appropriately
- Consider rounding for display purposes
- Provide clear guidance on rating meanings

### User Experience
- Display rating scales visually (stars, progress bars)
- Show current value and scale limits
- Provide context for rating meanings
- Consider default values for new records

## Common Use Cases

1. **Performance Management**
   - Employee performance ratings
   - Project quality scores
   - Task completion ratings
   - Skill level assessments

2. **Customer Feedback**
   - Satisfaction ratings
   - Product quality scores
   - Service experience ratings
   - Net Promoter Score (NPS)

3. **Priority and Importance**
   - Task priority levels
   - Urgency ratings
   - Risk assessment scores
   - Impact ratings

4. **Quality Assurance**
   - Code review ratings
   - Testing quality scores
   - Documentation quality
   - Process adherence ratings

## Integration Features

### With Automations
- Trigger actions based on rating thresholds
- Send notifications for low ratings
- Create follow-up tasks for high ratings
- Route work based on rating values

### With Lookups
- Calculate average ratings across records
- Find records by rating ranges
- Reference rating data from other records
- Aggregate rating statistics

### With Blue Frontend
- Automatic range validation in form contexts
- Visual rating input controls
- Real-time validation feedback
- Star or slider input options

## Activity Tracking

Rating field changes are automatically tracked:
- Old and new rating values are logged
- Activity shows numeric changes
- Timestamps for all rating updates
- User attribution for changes

## Limitations

- Only numeric values are supported
- No built-in visual rating display (stars, etc.)
- Decimal precision depends on database configuration
- No rating metadata storage (comments, context)
- No automatic rating aggregation or statistics
- No built-in rating conversion between scales
- **Critical**: Min/max validation only works in forms, not via `setTodoCustomField`

## Related Resources

- [Number Fields](/api/5.custom%20fields/number) - For general numeric data
- [Percent Fields](/api/5.custom%20fields/percent) - For percentage values
- [Select Fields](/api/5.custom%20fields/select-single) - For discrete choice ratings
- [Custom Fields Overview](/api/5.custom%20fields/2.list-custom-fields) - General concepts

### /api/custom-fields/reference

Source: https://blue.cc/api/custom-fields/reference

Reference custom fields allow you to create links between records in different projects, enabling cross-project relationships and data sharing. They provide a powerful way to connect related work across your organization's project structure.

## Basic Example

Create a simple reference field:

```graphql
mutation CreateReferenceField {
  createCustomField(input: {
    name: "Related Project"
    type: REFERENCE
    referenceProjectId: "proj_456"
    description: "Link to related project records"
  }) {
    id
    name
    type
    referenceProjectId
  }
}
```

## Advanced Example

Create a reference field with filtering and multiple selection:

```graphql
mutation CreateFilteredReferenceField {
  createCustomField(input: {
    name: "Dependencies"
    type: REFERENCE
    referenceProjectId: "proj_456"
    referenceMultiple: true
    referenceFilter: {
      status: ACTIVE
      tags: ["dependency"]
    }
    description: "Select multiple dependency records from the project"
  }) {
    id
    name
    type
    referenceProjectId
    referenceMultiple
    referenceFilter
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the reference field |
| `type` | CustomFieldType! | ✅ Yes | Must be `REFERENCE` |
| `referenceProjectId` | String | No | ID of the project to reference |
| `referenceMultiple` | Boolean | No | Allow multiple record selection (default: false) |
| `referenceFilter` | TodoFilterInput | No | Filter criteria for referenced records |
| `description` | String | No | Help text shown to users |

**Note**: Custom fields are automatically associated with the project based on the user's current project context.

## Reference Configuration

### Single vs Multiple References

**Single Reference (default):**
```graphql
{
  referenceMultiple: false  # or omit this field
}
```
- Users can select one record from the referenced project
- Returns a single Todo object

**Multiple References:**
```graphql
{
  referenceMultiple: true
}
```
- Users can select multiple records from the referenced project
- Returns an array of Todo objects

### Reference Filtering

Use `referenceFilter` to limit which records can be selected:

```graphql
{
  referenceFilter: {
    assigneeIds: ["user_123"]
    tagIds: ["tag_123"]
    dueStart: "2024-01-01"
    dueEnd: "2024-12-31"
    showCompleted: false
  }
}
```

## Setting Reference Values

### Single Reference

```graphql
mutation SetSingleReference {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    customFieldReferenceTodoIds: ["referenced_todo_789"]
  })
}
```

### Multiple References

```graphql
mutation SetMultipleReferences {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    customFieldReferenceTodoIds: [
      "referenced_todo_789",
      "referenced_todo_012",
      "referenced_todo_345"
    ]
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the reference custom field |
| `customFieldReferenceTodoIds` | [String!] | ✅ Yes | Array of referenced record IDs |

## Creating Records with References

```graphql
mutation CreateRecordWithReference {
  createTodo(input: {
    title: "Implementation Task"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "reference_field_id"
      value: "referenced_todo_789"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      selectedTodos {
        id
        title
        status
      }
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the field value |
| `customField` | CustomField! | The reference field definition |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

**Note**: Referenced todos are accessed via `customField.selectedTodos`, not directly on TodoCustomField.

### Referenced Todo Fields

Each referenced Todo includes:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier of the referenced record |
| `title` | String! | Title of the referenced record |
| `status` | TodoStatus! | Current status (ACTIVE, COMPLETED, etc.) |
| `description` | String | Description of the referenced record |
| `dueDate` | DateTime | Due date if set |
| `assignees` | [User!] | Assigned users |
| `tags` | [Tag!] | Associated tags |
| `project` | Project! | Project containing the referenced record |

## Querying Reference Data

### Basic Query

```graphql
query GetRecordsWithReferences {
  todos(projectId: "project_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
        selectedTodos {
          id
          title
          status
          project {
            id
            name
          }
        }
      }
    }
  }
}
```

### Advanced Query with Nested Data

```graphql
query GetDetailedReferences {
  todos(projectId: "project_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
        referenceProjectId
        referenceMultiple
      }
      selectedTodos {
        id
        title
        description
        status
        dueDate
        assignees {
          id
          name
          email
        }
        tags {
          id
          name
          color
        }
        project {
          id
          name
        }
      }
    }
  }
}
```

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create reference field | `OWNER` or `ADMIN` role at project level |
| Update reference field | `OWNER` or `ADMIN` role at project level |
| Set reference value | Standard record edit permissions |
| View reference value | Standard record view permissions |
| Access referenced records | View permissions on referenced project |

**Important**: Users must have view permissions on the referenced project to see the linked records.

## Cross-Project Access

### Project Visibility

- Users can only reference records from projects they have access to
- Referenced records respect the original project's permissions
- Changes to referenced records appear in real-time
- Deleting referenced records removes them from reference fields

### Permission Inheritance

- Reference fields inherit permissions from both projects
- Users need view access to the referenced project
- Edit permissions are based on the current project's rules
- Referenced data is read-only in the context of the reference field

## Error Responses

### Invalid Reference Project

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

### Referenced Record Not Found

```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

### Permission Denied

```json
{
  "errors": [{
    "message": "Forbidden",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

## Best Practices

### Field Design

1. **Clear naming** - Use descriptive names that indicate the relationship
2. **Appropriate filtering** - Set filters to show only relevant records
3. **Consider permissions** - Ensure users have access to referenced projects
4. **Document relationships** - Provide clear descriptions of the connection

### Performance Considerations

1. **Limit reference scope** - Use filters to reduce the number of selectable records
2. **Avoid deep nesting** - Don't create complex chains of references
3. **Consider caching** - Referenced data is cached for performance
4. **Monitor usage** - Track how references are being used across projects

### Data Integrity

1. **Handle deletions** - Plan for when referenced records are deleted
2. **Validate permissions** - Ensure users can access referenced projects
3. **Update dependencies** - Consider impact when changing referenced records
4. **Audit trails** - Track reference relationships for compliance

## Common Use Cases

### Project Dependencies

```graphql
# Link to prerequisite tasks in other projects
{
  name: "Prerequisites"
  type: REFERENCE
  referenceProjectId: "infrastructure_project"
  referenceMultiple: true
  referenceFilter: {
    showCompleted: true
    tagIds: ["prerequisite_tag_id"]
  }
}
```

### Client Requirements

```graphql
# Reference client requirements from a requirements project
{
  name: "Client Requirements"
  type: REFERENCE
  referenceProjectId: "requirements_project"
  referenceFilter: {
    assigneeIds: ["client_user_id"]
    showCompleted: false
  }
}
```

### Resource Allocation

```graphql
# Link to resource records in a resource management project
{
  name: "Assigned Resources"
  type: REFERENCE
  referenceProjectId: "resources_project"
  referenceMultiple: true
  referenceFilter: {
    tagIds: ["available_tag_id"]
  }
}
```

### Quality Assurance

```graphql
# Reference QA test cases from a testing project
{
  name: "Test Cases"
  type: REFERENCE
  referenceProjectId: "qa_project"
  referenceMultiple: true
  referenceFilter: {
    showCompleted: false
    tagIds: ["test_case_tag_id"]
  }
}
```

## Integration with Lookups

Reference fields work with [Lookup fields](/api/custom-fields/lookup) to pull data from referenced records. Lookup fields can extract values from records selected in reference fields, but they are data extractors only (no aggregation functions like SUM are supported).

```graphql
# Reference field links to records
{
  name: "Related Tasks"
  type: REFERENCE
  referenceProjectId: "other_project"
}

# Lookup field extracts data from referenced records
{
  name: "Task Status"
  type: LOOKUP
  lookupOption: {
    customFieldId: "related_tasks_field_id"
    targetField: "status"
  }
}
```

## Limitations

- Referenced projects must be accessible to the user
- Changes to referenced project permissions affect reference field access
- Deep nesting of references may impact performance
- No built-in validation for circular references
- No automatic restriction preventing same-project references
- Filter validation is not enforced when setting reference values

## Related Resources

- [Lookup Fields](/api/custom-fields/lookup) - Extract data from referenced records
- [Projects API](/api/projects) - Managing projects that contain references
- [Records API](/api/records) - Working with records that have references
- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General concepts

### /api/custom-fields/select-multi

Source: https://blue.cc/api/custom-fields/select-multi

Multi-select custom fields allow users to choose multiple options from a predefined list. They're ideal for categories, tags, skills, features, or any scenario where multiple selections are needed from a controlled set of options.

## Basic Example

Create a simple multi-select field:

```graphql
mutation CreateMultiSelectField {
  createCustomField(input: {
    name: "Project Categories"
    type: SELECT_MULTI
    projectId: "proj_123"
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a multi-select field and then add options separately:

```graphql
# Step 1: Create the multi-select field
mutation CreateMultiSelectField {
  createCustomField(input: {
    name: "Required Skills"
    type: SELECT_MULTI
    projectId: "proj_123"
    description: "Select all skills required for this task"
  }) {
    id
    name
    type
    description
  }
}

# Step 2: Add options to the field
mutation AddOptions {
  createCustomFieldOptions(input: [
    { customFieldId: "field_123", title: "JavaScript", color: "#f7df1e" }
    { customFieldId: "field_123", title: "React", color: "#61dafb" }
    { customFieldId: "field_123", title: "Node.js", color: "#339933" }
    { customFieldId: "field_123", title: "GraphQL", color: "#e10098" }
  ]) {
    id
    title
    color
    position
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the multi-select field |
| `type` | CustomFieldType! | ✅ Yes | Must be `SELECT_MULTI` |
| `description` | String | No | Help text shown to users |
| `projectId` | String! | ✅ Yes | ID of the project for this field |

### CreateCustomFieldOptionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customFieldId` | String! | ✅ Yes | ID of the custom field |
| `title` | String! | ✅ Yes | Display text for the option |
| `color` | String | No | Color for the option (any string) |
| `position` | Float | No | Sort order for the option |

## Adding Options to Existing Fields

Add new options to an existing multi-select field:

```graphql
mutation AddMultiSelectOption {
  createCustomFieldOption(input: {
    customFieldId: "field_123"
    title: "Python"
    color: "#3776ab"
  }) {
    id
    title
    color
    position
  }
}
```

## Setting Multi-Select Values

To set multiple selected options on a record:

```graphql
mutation SetMultiSelectValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    customFieldOptionIds: ["option_1", "option_2", "option_3"]
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the multi-select custom field |
| `customFieldOptionIds` | [String!] | ✅ Yes | Array of option IDs to select |

## Creating Records with Multi-Select Values

When creating a new record with multi-select values:

```graphql
mutation CreateRecordWithMultiSelect {
  createTodo(input: {
    title: "Develop new feature"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "skills_field_id"
      value: "option1,option2,option3"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      selectedOptions {
        id
        title
        color
      }
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `selectedOptions` | [CustomFieldOption!] | Array of selected options |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

### CustomFieldOption Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the option |
| `title` | String! | Display text for the option |
| `color` | String | Hex color code for visual representation |
| `position` | Float | Sort order for the option |
| `customField` | CustomField! | The custom field this option belongs to |

### CustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field |
| `name` | String! | Display name of the multi-select field |
| `type` | CustomFieldType! | Always `SELECT_MULTI` |
| `description` | String | Help text for the field |
| `customFieldOptions` | [CustomFieldOption!] | All available options |

## Value Format

### Input Format
- **API Parameter**: Array of option IDs (`["option1", "option2", "option3"]`)
- **String Format**: Comma-separated option IDs (`"option1,option2,option3"`)

### Output Format
- **GraphQL Response**: Array of CustomFieldOption objects
- **Activity Log**: Comma-separated option titles
- **Automation Data**: Array of option titles

## Managing Options

### Update Option Properties
```graphql
mutation UpdateOption {
  editCustomFieldOption(input: {
    id: "option_123"
    title: "Updated Title"
    color: "#ff0000"
  }) {
    id
    title
    color
  }
}
```

### Delete Option
```graphql
mutation DeleteOption {
  deleteCustomFieldOption(id: "option_123")
}
```

### Reorder Options
```graphql
# Update position values to reorder options
mutation UpdateOptionPosition {
  editCustomFieldOption(input: {
    id: "option_123"
    position: 1.5  # Position between 1.0 and 2.0
  }) {
    id
    position
  }
}
```

## Validation Rules

### Option Validation
- All provided option IDs must exist
- Options must belong to the specified custom field
- Only SELECT_MULTI fields can have multiple options selected
- Empty array is valid (no selections)

### Field Validation
- Must have at least one option defined to be usable
- Option titles must be unique within the field
- Color field accepts any string value (no hex validation)

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create multi-select field | `OWNER` or `ADMIN` role at project level |
| Update multi-select field | `OWNER` or `ADMIN` role at project level |
| Add/edit options | `OWNER` or `ADMIN` role at project level |
| Set selected values | Standard record edit permissions |
| View selected values | Standard record view permissions |

## Error Responses

### Invalid Option ID
```json
{
  "errors": [{
    "message": "Custom field option not found",
    "extensions": {
      "code": "CUSTOM_FIELD_OPTION_NOT_FOUND"
    }
  }]
}
```

### Option Doesn't Belong to Field
```json
{
  "errors": [{
    "message": "Option does not belong to this custom field",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "CustomField not found",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

### Multiple Options on Non-Multi Field
```json
{
  "errors": [{
    "message": "custom fields can only have one option",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Best Practices

### Option Design
- Use descriptive, concise option titles
- Apply consistent color coding schemes
- Keep option lists manageable (typically 3-20 options)
- Order options logically (alphabetically, by frequency, etc.)

### Data Management
- Review and clean up unused options periodically
- Use consistent naming conventions across projects
- Consider option reusability when creating fields
- Plan for option updates and migrations

### User Experience
- Provide clear field descriptions
- Use colors to improve visual distinction
- Group related options together
- Consider default selections for common cases

## Common Use Cases

1. **Project Management**
   - Task categories and tags
   - Priority levels and types
   - Team member assignments
   - Status indicators

2. **Content Management**
   - Article categories and topics
   - Content types and formats
   - Publication channels
   - Approval workflows

3. **Customer Support**
   - Issue categories and types
   - Affected products or services
   - Resolution methods
   - Customer segments

4. **Product Development**
   - Feature categories
   - Technical requirements
   - Testing environments
   - Release channels

## Integration Features

### With Automations
- Trigger actions when specific options are selected
- Route work based on selected categories
- Send notifications for high-priority selections
- Create follow-up tasks based on option combinations

### With Lookups
- Filter records by selected options
- Aggregate data across option selections
- Reference option data from other records
- Create reports based on option combinations

### With Forms
- Multi-select input controls
- Option validation and filtering
- Dynamic option loading
- Conditional field display

## Activity Tracking

Multi-select field changes are automatically tracked:
- Shows added and removed options
- Displays option titles in activity log
- Timestamps for all selection changes
- User attribution for modifications

## Limitations

- Maximum practical limit of options depends on UI performance
- No hierarchical or nested option structure
- Options are shared across all records using the field
- No built-in option analytics or usage tracking
- Color field accepts any string (no hex validation)
- Cannot set different permissions per option
- Options must be created separately, not inline with field creation
- No dedicated reorder mutation (use editCustomFieldOption with position)

## Related Resources

- [Single-Select Fields](/api/custom-fields/select-single) - For single-choice selections
- [Checkbox Fields](/api/custom-fields/checkbox) - For simple boolean choices
- [Text Fields](/api/custom-fields/text-single) - For free-form text input
- [Custom Fields Overview](/api/custom-fields/2.list-custom-fields) - General concepts

### /api/custom-fields/select-single

Source: https://blue.cc/api/custom-fields/select-single

Single-select custom fields allow users to choose exactly one option from a predefined list. They're ideal for status fields, categories, priorities, or any scenario where only one choice should be made from a controlled set of options.

## Basic Example

Create a simple single-select field:

```graphql
mutation CreateSingleSelectField {
  createCustomField(input: {
    name: "Project Status"
    type: SELECT_SINGLE
    projectId: "proj_123"
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a single-select field with predefined options:

```graphql
mutation CreateDetailedSingleSelectField {
  createCustomField(input: {
    name: "Priority Level"
    type: SELECT_SINGLE
    projectId: "proj_123"
    description: "Set the priority level for this task"
    customFieldOptions: [
      { title: "Low", color: "#28a745" }
      { title: "Medium", color: "#ffc107" }
      { title: "High", color: "#fd7e14" }
      { title: "Critical", color: "#dc3545" }
    ]
  }) {
    id
    name
    type
    description
    customFieldOptions {
      id
      title
      color
      position
    }
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the single-select field |
| `type` | CustomFieldType! | ✅ Yes | Must be `SELECT_SINGLE` |
| `description` | String | No | Help text shown to users |
| `customFieldOptions` | [CreateCustomFieldOptionInput!] | No | Initial options for the field |

### CreateCustomFieldOptionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | String! | ✅ Yes | Display text for the option |
| `color` | String | No | Hex color code for the option |

## Adding Options to Existing Fields

Add new options to an existing single-select field:

```graphql
mutation AddSingleSelectOption {
  createCustomFieldOption(input: {
    customFieldId: "field_123"
    title: "Urgent"
    color: "#6f42c1"
  }) {
    id
    title
    color
    position
  }
}
```

## Setting Single-Select Values

To set the selected option on a record:

```graphql
mutation SetSingleSelectValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    customFieldOptionId: "option_789"
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the single-select custom field |
| `customFieldOptionId` | String | No | ID of the option to select (preferred for single-select) |
| `customFieldOptionIds` | [String!] | No | Array of option IDs (uses first element for single-select) |

## Querying Single-Select Values

Query a record's single-select value:

```graphql
query GetRecordWithSingleSelect {
  todo(id: "todo_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      value  # For SELECT_SINGLE, contains: {"id": "opt_123", "title": "High", "color": "#dc3545", "position": 3}
    }
  }
}
```

The `value` field returns a JSON object with the selected option's details.

## Creating Records with Single-Select Values

When creating a new record with single-select values:

```graphql
mutation CreateRecordWithSingleSelect {
  createTodo(input: {
    title: "Review user feedback"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "priority_field_id"
      customFieldOptionId: "option_high_priority"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      value  # Contains the selected option object
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `value` | JSON | Contains the selected option object with id, title, color, position |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

### CustomFieldOption Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the option |
| `title` | String! | Display text for the option |
| `color` | String | Hex color code for visual representation |
| `position` | Float | Sort order for the option |
| `customField` | CustomField! | The custom field this option belongs to |

### CustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field |
| `name` | String! | Display name of the single-select field |
| `type` | CustomFieldType! | Always `SELECT_SINGLE` |
| `description` | String | Help text for the field |
| `customFieldOptions` | [CustomFieldOption!] | All available options |

## Value Format

### Input Format
- **API Parameter**: Use `customFieldOptionId` for single option ID
- **Alternative**: Use `customFieldOptionIds` array (takes first element)
- **Clearing Selection**: Omit both fields or pass empty values

### Output Format
- **GraphQL Response**: JSON object in `value` field containing {id, title, color, position}
- **Activity Log**: Option title as string
- **Automation Data**: Option title as string

## Selection Behavior

### Exclusive Selection
- Setting a new option automatically removes the previous selection
- Only one option can be selected at a time
- Setting `null` or empty value clears the selection

### Fallback Logic
- If `customFieldOptionIds` array is provided, only the first option is used
- This ensures compatibility with multi-select input formats
- Empty arrays or null values clear the selection

## Managing Options

### Update Option Properties
```graphql
mutation UpdateOption {
  editCustomFieldOption(input: {
    id: "option_123"
    title: "Updated Priority"
    color: "#ff6b6b"
  }) {
    id
    title
    color
  }
}
```

### Delete Option
```graphql
mutation DeleteOption {
  deleteCustomFieldOption(id: "option_123")
}
```

**Note**: Deleting an option will clear it from all records where it was selected.

### Reorder Options
```graphql
mutation ReorderOptions {
  reorderCustomFieldOptions(input: {
    customFieldId: "field_123"
    optionIds: ["option_1", "option_3", "option_2"]
  }) {
    id
    position
  }
}
```

## Validation Rules

### Option Validation
- The provided option ID must exist
- Option must belong to the specified custom field
- Only one option can be selected (enforced automatically)
- Null/empty values are valid (no selection)

### Field Validation
- Must have at least one option defined to be usable
- Option titles must be unique within the field
- Color codes must be valid hex format (if provided)

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create single-select field | Company role: `OWNER` or `ADMIN` |
| Update single-select field | Company role: `OWNER` or `ADMIN` |
| Add/edit options | Company role: `OWNER` or `ADMIN` |
| Set selected value | Any company role (`OWNER`, `ADMIN`, `MEMBER`, `CLIENT`) or custom project role with edit permission |
| View selected value | Standard record view permissions |

## Error Responses

### Invalid Option ID
```json
{
  "errors": [{
    "message": "Custom field option was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_OPTION_NOT_FOUND"
    }
  }]
}
```

### Option Doesn't Belong to Field
```json
{
  "errors": [{
    "message": "Option does not belong to this custom field",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

### Unable to Parse Value
```json
{
  "errors": [{
    "message": "Unable to parse custom field value.",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

## Best Practices

### Option Design
- Use clear, descriptive option titles
- Apply meaningful color coding
- Keep option lists focused and relevant
- Order options logically (by priority, frequency, etc.)

### Status Field Patterns
- Use consistent status workflows across projects
- Consider the natural progression of options
- Include clear final states (Done, Canceled, etc.)
- Use colors that reflect option meaning

### Data Management
- Review and clean up unused options periodically
- Use consistent naming conventions
- Consider the impact of option deletion on existing records
- Plan for option updates and migrations

## Common Use Cases

1. **Status and Workflow**
   - Task status (To Do, In Progress, Done)
   - Approval status (Pending, Approved, Rejected)
   - Project phase (Planning, Development, Testing, Released)
   - Issue resolution status

2. **Classification and Categorization**
   - Priority levels (Low, Medium, High, Critical)
   - Task types (Bug, Feature, Enhancement, Documentation)
   - Project categories (Internal, Client, Research)
   - Department assignments

3. **Quality and Assessment**
   - Review status (Not Started, In Review, Approved)
   - Quality ratings (Poor, Fair, Good, Excellent)
   - Risk levels (Low, Medium, High)
   - Confidence levels

4. **Assignment and Ownership**
   - Team assignments
   - Department ownership
   - Role-based assignments
   - Regional assignments

## Integration Features

### With Automations
- Trigger actions when specific options are selected
- Route work based on selected categories
- Send notifications for status changes
- Create conditional workflows based on selections

### With Lookups
- Filter records by selected options
- Reference option data from other records
- Create reports based on option selections
- Group records by selected values

### With Forms
- Dropdown input controls
- Radio button interfaces
- Option validation and filtering
- Conditional field display based on selections

## Activity Tracking

Single-select field changes are automatically tracked:
- Shows old and new option selections
- Displays option titles in activity log
- Timestamps for all selection changes
- User attribution for modifications

## Differences from Multi-Select

| Feature | Single-Select | Multi-Select |
|---------|---------------|--------------|
| **Selection Limit** | Exactly 1 option | Multiple options |
| **Input Parameter** | `customFieldOptionId` | `customFieldOptionIds` |
| **Response Field** | `value` (single option object) | `value` (array of option objects) |
| **Storage Behavior** | Replaces existing selection | Adds to existing selections |
| **Common Use Cases** | Status, category, priority | Tags, skills, categories |

## Limitations

- Only one option can be selected at a time
- No hierarchical or nested option structure
- Options are shared across all records using the field
- No built-in option analytics or usage tracking
- Color codes are for display only, no functional impact
- Cannot set different permissions per option

## Related Resources

- [Multi-Select Fields](/api/custom-fields/select-multi) - For multiple-choice selections
- [Checkbox Fields](/api/custom-fields/checkbox) - For simple boolean choices
- [Text Fields](/api/custom-fields/text-single) - For free-form text input
- [Custom Fields Overview](/api/custom-fields/1.index) - General concepts

### /api/custom-fields/text-multi

Source: https://blue.cc/api/custom-fields/text-multi

Multi-line text custom fields allow you to store longer text content with line breaks and formatting. They're ideal for descriptions, notes, comments, or any text data that needs multiple lines.

## Basic Example

Create a simple multi-line text field:

```graphql
mutation CreateTextMultiField($projectId: String!) {
  createCustomField(
    projectId: $projectId
    input: {
      name: "Description"
      type: TEXT_MULTI
    }
  ) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a multi-line text field with description:

```graphql
mutation CreateDetailedTextMultiField($projectId: String!) {
  createCustomField(
    projectId: $projectId
    input: {
      name: "Project Notes"
      type: TEXT_MULTI
      description: "Detailed notes and observations about the project"
    }
  ) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the text field |
| `type` | CustomFieldType! | ✅ Yes | Must be `TEXT_MULTI` |
| `description` | String | No | Help text shown to users |

**Note:** The `projectId` is passed as a separate argument to the mutation, not as part of the input object. Alternatively, the project context can be determined from the `X-Bloo-Project-ID` header in your GraphQL request.

## Setting Text Values

To set or update a multi-line text value on a record:

```graphql
mutation SetTextMultiValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    text: "This is a multi-line text value.\n\nIt can contain line breaks and longer content."
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the text custom field |
| `text` | String | No | Multi-line text content to store |

## Creating Records with Text Values

When creating a new record with multi-line text values:

```graphql
mutation CreateRecordWithTextMulti {
  createTodo(input: {
    title: "Project Planning"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "text_multi_field_id"
      value: "Project Overview:\n\n1. Research phase\n2. Design phase\n3. Implementation phase\n\nKey considerations:\n- Budget constraints\n- Timeline requirements\n- Resource allocation"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      text
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `text` | String | The stored multi-line text content |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

## Text Validation

### Form Validation
When multi-line text fields are used in forms:
- Leading and trailing whitespace is automatically trimmed
- Required validation is applied if the field is marked as required
- No specific format validation is applied

### Validation Rules
- Accepts any string content including line breaks
- No character length limits (up to database limits)
- Supports Unicode characters and special symbols
- Line breaks are preserved in storage

### Valid Text Examples
```
Single line text

Multi-line text with
line breaks

Text with special characters:
- Bullets
- Numbers: 123
- Symbols: @#$%
- Unicode: 🚀 ✅ ⭐

Code snippets:
function example() {
  return "hello world";
}
```

## Important Notes

### Storage Capacity
- Stored using MySQL `MediumText` type
- Supports up to 16MB of text content
- Line breaks and formatting are preserved
- UTF-8 encoding for international characters

### Direct API vs Forms
- **Forms**: Automatic whitespace trimming and required validation
- **Direct API**: Text is stored exactly as provided
- **Recommendation**: Use forms for user input to ensure consistent formatting

### TEXT_MULTI vs TEXT_SINGLE
- **TEXT_MULTI**: Multi-line textarea input, ideal for longer content
- **TEXT_SINGLE**: Single-line text input, ideal for short values
- **Backend**: Both types are identical - same storage field, validation, and processing
- **Frontend**: Different UI components for data entry (textarea vs input field)
- **Important**: The distinction between TEXT_MULTI and TEXT_SINGLE exists purely for UI purposes

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create text field | `OWNER` or `ADMIN` project-level role |
| Update text field | `OWNER` or `ADMIN` project-level role |
| Set text value | Any role except `VIEW_ONLY` or `COMMENT_ONLY` |
| View text value | Any project-level role |

## Error Responses

### Required Field Validation (Forms Only)
```json
{
  "errors": [{
    "message": "This field is required",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

## Best Practices

### Content Organization
- Use consistent formatting for structured content
- Consider using markdown-like syntax for readability
- Break long content into logical sections
- Use line breaks to improve readability

### Data Entry
- Provide clear field descriptions to guide users
- Use forms for user input to ensure validation
- Consider character limits based on your use case
- Validate content format in your application if needed

### Performance Considerations
- Very long text content may affect query performance
- Consider pagination for displaying large text fields
- Index considerations for search functionality
- Monitor storage usage for fields with large content

## Filtering and Search

### Contains Search
Multi-line text fields support substring searching through custom field filters:

```graphql
query SearchTextMulti {
  todos(
    customFieldFilters: [{
      customFieldId: "text_multi_field_id"
      operation: CONTAINS
      value: "project"
    }]
  ) {
    id
    title
    customFields {
      customField {
        name
        type
      }
      text
    }
  }
}
```

### Search Capabilities
- Substring matching within text fields using `CONTAINS` operator
- Case-insensitive search using `NCONTAINS` operator
- Exact match using `IS` operator
- Negative match using `NOT` operator
- Searches across all lines of text
- Supports partial word matching

## Common Use Cases

1. **Project Management**
   - Task descriptions
   - Project requirements
   - Meeting notes
   - Status updates

2. **Customer Support**
   - Issue descriptions
   - Resolution notes
   - Customer feedback
   - Communication logs

3. **Content Management**
   - Article content
   - Product descriptions
   - User comments
   - Review details

4. **Documentation**
   - Process descriptions
   - Instructions
   - Guidelines
   - Reference materials

## Integration Features

### With Automations
- Trigger actions when text content changes
- Extract keywords from text content
- Create summaries or notifications
- Process text content with external services

### With Lookups
- Reference text data from other records
- Aggregate text content from multiple sources
- Find records by text content
- Display related text information

### With Forms
- Automatic whitespace trimming
- Required field validation
- Multi-line textarea UI
- Character count display (if configured)

## Limitations

- No built-in text formatting or rich text editing
- No automatic link detection or conversion
- No spell checking or grammar validation
- No built-in text analysis or processing
- No versioning or change tracking
- Limited search capabilities (no full-text search)
- No content compression for very large text

## Related Resources

- [Single-Line Text Fields](/api/custom-fields/text-single) - For short text values
- [Email Fields](/api/custom-fields/email) - For email addresses
- [URL Fields](/api/custom-fields/url) - For website addresses
- [Custom Fields Overview](/api/custom-fields/2.list-custom-fields) - General concepts

### /api/custom-fields/text-single

Source: https://blue.cc/api/custom-fields/text-single

Single-line text custom fields allow you to store short text values intended for single-line input. They're ideal for names, titles, labels, or any text data that should be displayed on a single line.

## Basic Example

Create a simple single-line text field:

```graphql
mutation CreateTextSingleField {
  createCustomField(input: {
    name: "Client Name"
    type: TEXT_SINGLE
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a single-line text field with description:

```graphql
mutation CreateDetailedTextSingleField {
  createCustomField(input: {
    name: "Product SKU"
    type: TEXT_SINGLE
    description: "Unique product identifier code"
  }) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the text field |
| `type` | CustomFieldType! | ✅ Yes | Must be `TEXT_SINGLE` |
| `description` | String | No | Help text shown to users |

**Note**: Project context is automatically determined from your authentication headers. No `projectId` parameter is needed.

## Setting Text Values

To set or update a single-line text value on a record:

```graphql
mutation SetTextSingleValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    text: "ABC-123-XYZ"
  }) {
    id
    customField {
      value  # Returns { text: "ABC-123-XYZ" }
    }
  }
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the text custom field |
| `text` | String | No | Single-line text content to store |

## Creating Records with Text Values

When creating a new record with single-line text values:

```graphql
mutation CreateRecordWithTextSingle {
  createTodo(input: {
    title: "Process Order"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "text_single_field_id"
      value: "ORD-2024-001"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # Text is accessed here as { text: "ORD-2024-001" }
      }
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition (contains the text value) |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

**Important**: Text values are accessed through the `customField.value.text` field, not directly on TodoCustomField.

## Querying Text Values

When querying records with text custom fields, access the text through the `customField.value.text` path:

```graphql
query GetRecordWithText {
  todo(id: "todo_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # For TEXT_SINGLE type, contains { text: "your text value" }
      }
    }
  }
}
```

The response will include the text in the nested structure:

```json
{
  "data": {
    "todo": {
      "customFields": [{
        "customField": {
          "name": "Product SKU",
          "type": "TEXT_SINGLE",
          "value": {
            "text": "ABC-123-XYZ"
          }
        }
      }]
    }
  }
}
```

## Text Validation

### Form Validation
When single-line text fields are used in forms:
- Leading and trailing whitespace is automatically trimmed
- Required validation is applied if the field is marked as required
- No specific format validation is applied

### Validation Rules
- Accepts any string content including line breaks (though not recommended)
- No character length limits (up to database limits)
- Supports Unicode characters and special symbols
- Line breaks are preserved but not intended for this field type

### Typical Text Examples
```
Product Name
SKU-123-ABC
Client Reference #2024-001
Version 1.2.3
Project Alpha
Status: Active
```

## Important Notes

### Storage Capacity
- Stored using MySQL `MediumText` type
- Supports up to 16MB of text content
- Identical storage to multi-line text fields
- UTF-8 encoding for international characters

### Direct API vs Forms
- **Forms**: Automatic whitespace trimming and required validation
- **Direct API**: Text is stored exactly as provided
- **Recommendation**: Use forms for user input to ensure consistent formatting

### TEXT_SINGLE vs TEXT_MULTI
- **TEXT_SINGLE**: Single-line text input, ideal for short values
- **TEXT_MULTI**: Multi-line textarea input, ideal for longer content
- **Backend**: Both use identical storage and validation
- **Frontend**: Different UI components for data entry
- **Intent**: TEXT_SINGLE is semantically meant for single-line values

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create text field | `OWNER` or `ADMIN` role at project level |
| Update text field | `OWNER` or `ADMIN` role at project level |
| Set text value | Standard record edit permissions |
| View text value | Standard record view permissions |

## Error Responses

### Required Field Validation (Forms Only)
```json
{
  "errors": [{
    "message": "This field is required",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

## Best Practices

### Content Guidelines
- Keep text concise and single-line appropriate
- Avoid line breaks for intended single-line display
- Use consistent formatting for similar data types
- Consider character limits based on your UI requirements

### Data Entry
- Provide clear field descriptions to guide users
- Use forms for user input to ensure validation
- Validate content format in your application if needed
- Consider using dropdowns for standardized values

### Performance Considerations
- Single-line text fields are lightweight and performant
- Consider indexing for frequently searched fields
- Use appropriate display widths in your UI
- Monitor content length for display purposes

## Filtering and Search

### Contains Search
Single-line text fields support substring searching:

```graphql
query SearchTextSingle {
  todos(
    customFieldFilters: [{
      customFieldId: "text_single_field_id"
      operation: CONTAINS
      value: "SKU"
    }]
  ) {
    id
    title
    customFields {
      customField {
        value  # Access text via value.text
      }
    }
  }
}
```

### Search Capabilities
- Case-insensitive substring matching
- Supports partial word matching
- Exact value matching
- No full-text search or ranking

## Common Use Cases

1. **Identifiers and Codes**
   - Product SKUs
   - Order numbers
   - Reference codes
   - Version numbers

2. **Names and Titles**
   - Client names
   - Project titles
   - Product names
   - Category labels

3. **Short Descriptions**
   - Brief summaries
   - Status labels
   - Priority indicators
   - Classification tags

4. **External References**
   - Ticket numbers
   - Invoice references
   - External system IDs
   - Document numbers

## Integration Features

### With Lookups
- Reference text data from other records
- Find records by text content
- Display related text information
- Aggregate text values from multiple sources

### With Forms
- Automatic whitespace trimming
- Required field validation
- Single-line text input UI
- Character limit display (if configured)

### With Imports/Exports
- Direct CSV column mapping
- Automatic text value assignment
- Bulk data import support
- Export to spreadsheet formats

## Limitations

### Automation Restrictions
- Not directly available as automation trigger fields
- Cannot be used in automation field updates
- Can be referenced in automation conditions
- Available in email templates and webhooks

### General Limitations
- No built-in text formatting or styling
- No automatic validation beyond required fields
- No built-in uniqueness enforcement
- No content compression for very large text
- No versioning or change tracking
- Limited search capabilities (no full-text search)

## Related Resources

- [Multi-Line Text Fields](/api/custom-fields/text-multi) - For longer text content
- [Email Fields](/api/custom-fields/email) - For email addresses
- [URL Fields](/api/custom-fields/url) - For website addresses
- [Unique ID Fields](/api/custom-fields/unique-id) - For auto-generated identifiers
- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General concepts

### /api/custom-fields/time-duration

Source: https://blue.cc/api/custom-fields/time-duration

Time Duration custom fields automatically calculate and display the duration between two events in your workflow. They're ideal for tracking processing times, response times, cycle times, or any time-based metrics in your projects.

## Basic Example

Create a simple time duration field that tracks how long tasks take to complete:

```graphql
mutation CreateTimeDurationField {
  createCustomField(input: {
    name: "Processing Time"
    type: TIME_DURATION
    projectId: "proj_123"
    timeDurationDisplay: FULL_DATE_SUBSTRING
    timeDurationStartInput: {
      type: TODO_CREATED_AT
      condition: FIRST
    }
    timeDurationEndInput: {
      type: TODO_MARKED_AS_COMPLETE
      condition: FIRST
    }
  }) {
    id
    name
    type
    timeDurationDisplay
    timeDurationStart {
      type
      condition
    }
    timeDurationEnd {
      type
      condition
    }
  }
}
```

## Advanced Example

Create a complex time duration field that tracks time between custom field changes with an SLA target:

```graphql
mutation CreateAdvancedTimeDurationField {
  createCustomField(input: {
    name: "Review Cycle Time"
    type: TIME_DURATION
    projectId: "proj_123"
    description: "Time from review request to approval"
    timeDurationDisplay: FULL_DATE_STRING
    timeDurationTargetTime: 86400  # 24 hour SLA target
    timeDurationStartInput: {
      type: TODO_CUSTOM_FIELD
      condition: FIRST
      customFieldId: "status_field_id"
      customFieldOptionIds: ["review_requested_option_id"]
    }
    timeDurationEndInput: {
      type: TODO_CUSTOM_FIELD
      condition: FIRST
      customFieldId: "status_field_id"
      customFieldOptionIds: ["approved_option_id"]
    }
  }) {
    id
    name
    type
    description
    timeDurationDisplay
    timeDurationStart {
      type
      condition
      customField {
        name
      }
    }
    timeDurationEnd {
      type
      condition
      customField {
        name
      }
    }
  }
}
```

## Input Parameters

### CreateCustomFieldInput (TIME_DURATION)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the duration field |
| `type` | CustomFieldType! | ✅ Yes | Must be `TIME_DURATION` |
| `description` | String | No | Help text shown to users |
| `timeDurationDisplay` | CustomFieldTimeDurationDisplayType! | ✅ Yes | How to display the duration |
| `timeDurationStartInput` | CustomFieldTimeDurationInput! | ✅ Yes | Start event configuration |
| `timeDurationEndInput` | CustomFieldTimeDurationInput! | ✅ Yes | End event configuration |
| `timeDurationTargetTime` | Float | No | Target duration in seconds for SLA monitoring |

### CustomFieldTimeDurationInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | CustomFieldTimeDurationType! | ✅ Yes | Type of event to track |
| `condition` | CustomFieldTimeDurationCondition! | ✅ Yes | `FIRST` or `LAST` occurrence |
| `customFieldId` | String | Conditional | Required for `TODO_CUSTOM_FIELD` type |
| `customFieldOptionIds` | [String!] | Conditional | Required for select field changes |
| `todoListId` | String | Conditional | Required for `TODO_MOVED` type |
| `tagId` | String | Conditional | Required for `TODO_TAG_ADDED` type |
| `assigneeId` | String | Conditional | Required for `TODO_ASSIGNEE_ADDED` type |

### CustomFieldTimeDurationType Values

| Value | Description |
|-------|-------------|
| `TODO_CREATED_AT` | When the record was created |
| `TODO_CUSTOM_FIELD` | When a custom field value changed |
| `TODO_DUE_DATE` | When the due date was set |
| `TODO_MARKED_AS_COMPLETE` | When the record was marked complete |
| `TODO_MOVED` | When the record was moved to a different list |
| `TODO_TAG_ADDED` | When a tag was added to the record |
| `TODO_ASSIGNEE_ADDED` | When an assignee was added to the record |

### CustomFieldTimeDurationCondition Values

| Value | Description |
|-------|-------------|
| `FIRST` | Use the first occurrence of the event |
| `LAST` | Use the last occurrence of the event |

### CustomFieldTimeDurationDisplayType Values

| Value | Description | Example |
|-------|-------------|---------|
| `FULL_DATE` | Days:Hours:Minutes:Seconds format | `"01:02:03:04"` |
| `FULL_DATE_STRING` | Written out in full words | `"Two hours, two minutes, three seconds"` |
| `FULL_DATE_SUBSTRING` | Numeric with units | `"1 hour, 2 minutes, 3 seconds"` |
| `DAYS` | Duration in days only | `"2.5"` (2.5 days) |
| `HOURS` | Duration in hours only | `"60"` (60 hours) |
| `MINUTES` | Duration in minutes only | `"3600"` (3600 minutes) |
| `SECONDS` | Duration in seconds only | `"216000"` (216000 seconds) |

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `number` | Float | The duration in seconds |
| `value` | Float | Alias for number (duration in seconds) |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last updated |

### CustomField Response (TIME_DURATION)

| Field | Type | Description |
|-------|------|-------------|
| `timeDurationDisplay` | CustomFieldTimeDurationDisplayType | Display format for the duration |
| `timeDurationStart` | CustomFieldTimeDuration | Start event configuration |
| `timeDurationEnd` | CustomFieldTimeDuration | End event configuration |
| `timeDurationTargetTime` | Float | Target duration in seconds (for SLA monitoring) |

## Duration Calculation

### How It Works
1. **Start Event**: System monitors for the specified start event
2. **End Event**: System monitors for the specified end event
3. **Calculation**: Duration = End Time - Start Time
4. **Storage**: Duration stored in seconds as a number
5. **Display**: Formatted according to `timeDurationDisplay` setting

### Update Triggers
Duration values are automatically recalculated when:
- Records are created or updated
- Custom field values change
- Tags are added or removed
- Assignees are added or removed
- Records are moved between lists
- Records are marked complete/incomplete

## Reading Duration Values

### Query Duration Fields
```graphql
query GetTaskWithDuration {
  todo(id: "todo_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
        timeDurationDisplay
      }
      number    # Duration in seconds
      value     # Same as number
    }
  }
}
```

### Formatted Display Values
Duration values are automatically formatted based on the `timeDurationDisplay` setting:

```javascript
// FULL_DATE format
93784 seconds → "01:02:03:04" (1 day, 2 hours, 3 minutes, 4 seconds)

// FULL_DATE_STRING format
7323 seconds → "Two hours, two minutes, three seconds"

// FULL_DATE_SUBSTRING format
3723 seconds → "1 hour, 2 minutes, 3 seconds"

// DAYS format
216000 seconds → "2.5" (2.5 days)

// HOURS format
7200 seconds → "2" (2 hours)

// MINUTES format
180 seconds → "3" (3 minutes)

// SECONDS format
3661 seconds → "3661" (raw seconds)
```

## Common Configuration Examples

### Task Completion Time
```graphql
timeDurationStartInput: {
  type: TODO_CREATED_AT
  condition: FIRST
}
timeDurationEndInput: {
  type: TODO_MARKED_AS_COMPLETE
  condition: FIRST
}
```

### Status Change Duration
```graphql
timeDurationStartInput: {
  type: TODO_CUSTOM_FIELD
  condition: FIRST
  customFieldId: "status_field_id"
  customFieldOptionIds: ["in_progress_option_id"]
}
timeDurationEndInput: {
  type: TODO_CUSTOM_FIELD
  condition: FIRST
  customFieldId: "status_field_id"
  customFieldOptionIds: ["completed_option_id"]
}
```

### Time in Specific List
```graphql
timeDurationStartInput: {
  type: TODO_MOVED
  condition: FIRST
  todoListId: "review_list_id"
}
timeDurationEndInput: {
  type: TODO_MOVED
  condition: FIRST
  todoListId: "approved_list_id"
}
```

### Assignment Response Time
```graphql
timeDurationStartInput: {
  type: TODO_ASSIGNEE_ADDED
  condition: FIRST
  assigneeId: "user_123"
}
timeDurationEndInput: {
  type: TODO_CUSTOM_FIELD
  condition: FIRST
  customFieldId: "status_field_id"
  customFieldOptionIds: ["started_option_id"]
}
```

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create duration field | Project-level `OWNER` or `ADMIN` role |
| Update duration field | Project-level `OWNER` or `ADMIN` role |
| View duration value | Any project member role |

## Error Responses

### Invalid Configuration
```json
{
  "errors": [{
    "message": "Custom field is required for TODO_CUSTOM_FIELD type",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

### Referenced Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Missing Required Options
```json
{
  "errors": [{
    "message": "Custom field options are required for select field changes",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Important Notes

### Automatic Calculation
- Duration fields are **read-only** - values are automatically calculated
- You cannot manually set duration values via API
- Calculations happen asynchronously via background jobs
- Values update automatically when trigger events occur

### Performance Considerations
- Duration calculations are queued and processed asynchronously
- Large numbers of duration fields may impact performance
- Consider the frequency of trigger events when designing duration fields
- Use specific conditions to avoid unnecessary recalculations

### Null Values
Duration fields will show `null` when:
- Start event hasn't occurred yet
- End event hasn't occurred yet
- Configuration references non-existent entities
- Calculation encounters an error

## Best Practices

### Configuration Design
- Use specific event types rather than generic ones when possible
- Choose appropriate `FIRST` vs `LAST` conditions based on your workflow
- Test duration calculations with sample data before deployment
- Document your duration field logic for team members

### Display Formatting
- Use `FULL_DATE_SUBSTRING` for most readable format
- Use `FULL_DATE` for compact, consistent width display
- Use `FULL_DATE_STRING` for formal reports and documents
- Use `DAYS`, `HOURS`, `MINUTES`, or `SECONDS` for simple numeric displays
- Consider your UI space constraints when choosing format

### SLA Monitoring with Target Time
When using `timeDurationTargetTime`:
- Set the target duration in seconds
- Compare actual duration against target for SLA compliance
- Use in dashboards to highlight overdue items
- Example: 24-hour response SLA = 86400 seconds

### Workflow Integration
- Design duration fields to match your actual business processes
- Use duration data for process improvement and optimization
- Monitor duration trends to identify workflow bottlenecks
- Set up alerts for duration thresholds if needed

## Common Use Cases

1. **Process Performance**
   - Task completion times
   - Review cycle times
   - Approval processing times
   - Response times

2. **SLA Monitoring**
   - Time to first response
   - Resolution times
   - Escalation timeframes
   - Service level compliance

3. **Workflow Analytics**
   - Bottleneck identification
   - Process optimization
   - Team performance metrics
   - Quality assurance timing

4. **Project Management**
   - Phase durations
   - Milestone timing
   - Resource allocation time
   - Delivery timeframes

## Limitations

- Duration fields are **read-only** and cannot be manually set
- Values are calculated asynchronously and may not be immediately available
- Requires proper event triggers to be set up in your workflow
- Cannot calculate durations for events that haven't occurred
- Limited to tracking time between discrete events (not continuous time tracking)
- No built-in SLA alerts or notifications
- Cannot aggregate multiple duration calculations into a single field

## Related Resources

- [Number Fields](/api/custom-fields/number) - For manual numeric values
- [Date Fields](/api/custom-fields/date) - For specific date tracking
- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General concepts
- [Automations](/api/automations) - For triggering actions based on duration thresholds

### /api/custom-fields/unique-id

Source: https://blue.cc/api/custom-fields/unique-id

Unique ID custom fields automatically generate sequential, unique identifiers for your records. They're perfect for creating ticket numbers, order IDs, invoice numbers, or any sequential identifier system in your workflow.

## Basic Example

Create a simple unique ID field with auto-sequencing:

```graphql
mutation CreateUniqueIdField {
  createCustomField(input: {
    name: "Ticket Number"
    type: UNIQUE_ID
    useSequenceUniqueId: true
  }) {
    id
    name
    type
    useSequenceUniqueId
  }
}
```

## Advanced Example

Create a formatted unique ID field with prefix and zero-padding:

```graphql
mutation CreateFormattedUniqueIdField {
  createCustomField(input: {
    name: "Order ID"
    type: UNIQUE_ID
    description: "Auto-generated order identifier"
    useSequenceUniqueId: true
    prefix: "ORD-"
    sequenceDigits: 4
    sequenceStartingNumber: 1000
  }) {
    id
    name
    type
    description
    useSequenceUniqueId
    prefix
    sequenceDigits
    sequenceStartingNumber
  }
}
```

## Input Parameters

### CreateCustomFieldInput (UNIQUE_ID)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the unique ID field |
| `type` | CustomFieldType! | ✅ Yes | Must be `UNIQUE_ID` |
| `description` | String | No | Help text shown to users |
| `useSequenceUniqueId` | Boolean | No | Enable auto-sequencing (default: false) |
| `prefix` | String | No | Text prefix for generated IDs (e.g., "TASK-") |
| `sequenceDigits` | Int | No | Number of digits for zero-padding |
| `sequenceStartingNumber` | Int | No | Starting number for the sequence |

## Configuration Options

### Auto-Sequencing (`useSequenceUniqueId`)
- **true**: Automatically generates sequential IDs when records are created
- **false** or **undefined**: Manual entry required (functions like a text field)

### Prefix (`prefix`)
- Optional text prefix added to all generated IDs
- Examples: "TASK-", "ORD-", "BUG-", "REQ-"
- No length limit, but keep reasonable for display

### Sequence Digits (`sequenceDigits`)
- Number of digits for zero-padding the sequence number
- Example: `sequenceDigits: 3` produces `001`, `002`, `003`
- If not specified, no padding is applied

### Starting Number (`sequenceStartingNumber`)
- The first number in the sequence
- Example: `sequenceStartingNumber: 1000` starts at 1000, 1001, 1002...
- If not specified, starts at 1 (default behavior)

## Generated ID Format

The final ID format combines all configuration options:

```
{prefix}{paddedSequenceNumber}
```

### Format Examples

| Configuration | Generated IDs |
|---------------|---------------|
| No options | `1`, `2`, `3` |
| `prefix: "TASK-"` | `TASK-1`, `TASK-2`, `TASK-3` |
| `sequenceDigits: 3` | `001`, `002`, `003` |
| `prefix: "ORD-", sequenceDigits: 4` | `ORD-0001`, `ORD-0002`, `ORD-0003` |
| `prefix: "BUG-", sequenceStartingNumber: 500` | `BUG-500`, `BUG-501`, `BUG-502` |
| All options combined | `TASK-1001`, `TASK-1002`, `TASK-1003` |

## Reading Unique ID Values

### Query Records with Unique IDs
```graphql
query GetRecordsWithUniqueIds {
  todos(filter: { projectIds: ["proj_123"] }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        prefix
        sequenceDigits
      }
      sequenceId    # The generated sequence number
      text         # The text value for UNIQUE_ID fields
    }
  }
}
```

### Response Format
```json
{
  "data": {
    "todos": [
      {
        "id": "todo_123",
        "title": "Fix login issue",
        "customFields": [
          {
            "id": "field_value_456",
            "customField": {
              "name": "Ticket Number",
              "type": "UNIQUE_ID",
              "prefix": "TASK-",
              "sequenceDigits": 3
            },
            "sequenceId": 42,
            "text": "TASK-042"
          }
        ]
      }
    ]
  }
}
```

## Automatic ID Generation

### When IDs Are Generated
- **Record Creation**: IDs are automatically assigned when new records are created
- **Field Addition**: When adding a UNIQUE_ID field to existing records, a background job is queued (worker implementation pending)
- **Background Processing**: ID generation for new records happens synchronously via database triggers

### Generation Process
1. **Trigger**: New record is created or UNIQUE_ID field is added
2. **Sequence Lookup**: System finds the next available sequence number
3. **ID Assignment**: Sequence number is assigned to the record
4. **Counter Update**: Sequence counter is incremented for future records
5. **Formatting**: ID is formatted with prefix and padding when displayed

### Uniqueness Guarantees
- **Database Constraints**: Unique constraint on sequence IDs within each field
- **Atomic Operations**: Sequence generation uses database locks to prevent duplicates
- **Project Scoping**: Sequences are independent per project
- **Race Condition Protection**: Concurrent requests are handled safely

## Manual vs Automatic Mode

### Automatic Mode (`useSequenceUniqueId: true`)
- IDs are automatically generated via database triggers
- Sequential numbering is guaranteed
- Atomic sequence generation prevents duplicates
- Formatted IDs combine prefix + padded sequence number

### Manual Mode (`useSequenceUniqueId: false` or `undefined`)
- Functions like a regular text field
- Users can input custom values via `setTodoCustomField` with `text` parameter
- No automatic generation
- No uniqueness enforcement beyond database constraints

## Setting Manual Values (Manual Mode Only)

When `useSequenceUniqueId` is false, you can set values manually:

```graphql
mutation SetUniqueIdValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    text: "CUSTOM-ID-001"
  })
}
```

## Response Fields

### TodoCustomField Response (UNIQUE_ID)

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `sequenceId` | Int | The generated sequence number (populated for UNIQUE_ID fields) |
| `text` | String | The formatted text value (combines prefix + padded sequence) |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last updated |

### CustomField Response (UNIQUE_ID)

| Field | Type | Description |
|-------|------|-------------|
| `useSequenceUniqueId` | Boolean | Whether auto-sequencing is enabled |
| `prefix` | String | Text prefix for generated IDs |
| `sequenceDigits` | Int | Number of digits for zero-padding |
| `sequenceStartingNumber` | Int | Starting number for the sequence |

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create unique ID field | `OWNER` or `ADMIN` role at project level |
| Update unique ID field | `OWNER` or `ADMIN` role at project level |
| Set manual value | Standard record edit permissions |
| View unique ID value | Standard record view permissions |

## Error Responses

### Field Configuration Error
```json
{
  "errors": [{
    "message": "Invalid sequence configuration",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

### Permission Error
```json
{
  "errors": [{
    "message": "CustomField not found",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

## Important Notes

### Auto-Generated IDs
- **Read-Only**: Auto-generated IDs cannot be manually edited
- **Permanent**: Once assigned, sequence IDs don't change
- **Chronological**: IDs reflect creation order
- **Scoped**: Sequences are independent per project

### Performance Considerations
- ID generation for new records is synchronous via database triggers
- Sequence generation uses `FOR UPDATE` locks for atomic operations
- Background job system exists but worker implementation is pending
- Consider sequence starting numbers for high-volume projects

### Migration and Updates
- Adding auto-sequencing to existing records queues background job (worker pending)
- Changing sequence settings affects only future records
- Existing IDs remain unchanged when configuration updates
- Sequence counters continue from current maximum

## Best Practices

### Configuration Design
- Choose descriptive prefixes that won't conflict with other systems
- Use appropriate digit padding for your expected volume
- Set reasonable starting numbers to avoid conflicts
- Test configuration with sample data before deployment

### Prefix Guidelines
- Keep prefixes short and memorable (2-5 characters)
- Use uppercase for consistency
- Include separators (hyphens, underscores) for readability
- Avoid special characters that might cause issues in URLs or systems

### Sequence Planning
- Estimate your record volume to choose appropriate digit padding
- Consider future growth when setting starting numbers
- Plan for different sequence ranges for different record types
- Document your ID schemes for team reference

## Common Use Cases

1. **Support Systems**
   - Ticket numbers: `TICK-001`, `TICK-002`
   - Case IDs: `CASE-2024-001`
   - Support requests: `SUP-001`

2. **Project Management**
   - Task IDs: `TASK-001`, `TASK-002`
   - Sprint items: `SPRINT-001`
   - Deliverable numbers: `DEL-001`

3. **Business Operations**
   - Order numbers: `ORD-2024-001`
   - Invoice IDs: `INV-001`
   - Purchase orders: `PO-001`

4. **Quality Management**
   - Bug reports: `BUG-001`
   - Test case IDs: `TEST-001`
   - Review numbers: `REV-001`

## Integration Features

### With Automations
- Trigger actions when unique IDs are assigned
- Use ID patterns in automation rules
- Reference IDs in email templates and notifications

### With Lookups
- Reference unique IDs from other records
- Find records by unique ID
- Display related record identifiers

### With Reporting
- Group and filter by ID patterns
- Track ID assignment trends
- Monitor sequence usage and gaps

## Limitations

- **Sequential Only**: IDs are assigned in chronological order
- **No Gaps**: Deleted records leave gaps in sequences
- **No Reuse**: Sequence numbers are never reused
- **Project Scoped**: Cannot share sequences across projects
- **Format Constraints**: Limited formatting options
- **No Bulk Updates**: Cannot bulk update existing sequence IDs
- **No Custom Logic**: Cannot implement custom ID generation rules

## Related Resources

- [Text Fields](/api/custom-fields/text-single) - For manual text identifiers
- [Number Fields](/api/custom-fields/number) - For numeric sequences
- [Custom Fields Overview](/api/custom-fields/2.list-custom-fields) - General concepts
- [Automations](/api/automations) - For ID-based automation rules

### /api/custom-fields/url

Source: https://blue.cc/api/custom-fields/url

URL custom fields allow you to store website addresses and links in your records. They're ideal for tracking project websites, reference links, documentation URLs, or any web-based resources related to your work.

## Basic Example

Create a simple URL field:

```graphql
mutation CreateUrlField($projectId: String!) {
  createCustomField(
    projectId: $projectId
    input: {
      name: "Project Website"
      type: URL
    }
  ) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a URL field with description:

```graphql
mutation CreateDetailedUrlField($projectId: String!) {
  createCustomField(
    projectId: $projectId
    input: {
      name: "Reference Link"
      type: URL
      description: "Link to external documentation or resources"
    }
  ) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the URL field |
| `type` | CustomFieldType! | ✅ Yes | Must be `URL` |
| `description` | String | No | Help text shown to users |

**Note:** The `projectId` is passed as a separate argument to the mutation, not as part of the input object.

## Setting URL Values

To set or update a URL value on a record:

```graphql
mutation SetUrlValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    text: "https://example.com/documentation"
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the URL custom field |
| `text` | String! | ✅ Yes | URL address to store |

## Creating Records with URL Values

When creating a new record with URL values:

```graphql
mutation CreateRecordWithUrl {
  createTodo(input: {
    title: "Review documentation"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "url_field_id"
      value: "https://docs.example.com/api"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
      }
      text
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `text` | String | The stored URL address |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

## URL Validation

### Current Implementation
- **Direct API**: No URL format validation is currently enforced
- **Forms**: URL validation is planned but not currently active
- **Storage**: Any string value can be stored in URL fields

### Planned Validation
Future versions will include:
- HTTP/HTTPS protocol validation
- Valid URL format checking
- Domain name validation
- Automatic protocol prefix addition

### Recommended URL Formats
While not currently enforced, use these standard formats:

```
https://example.com
https://www.example.com
https://subdomain.example.com
https://example.com/path
https://example.com/path?param=value
http://localhost:3000
https://docs.example.com/api/v1
```

## Important Notes

### Storage Format
- URLs are stored as plain text without modification
- No automatic protocol addition (http://, https://)
- Case sensitivity preserved as entered
- No URL encoding/decoding performed

### Direct API vs Forms
- **Forms**: Planned URL validation (not currently active)
- **Direct API**: No validation - any text can be stored
- **Recommendation**: Validate URLs in your application before storing

### URL vs Text Fields
- **URL**: Semantically intended for web addresses
- **TEXT_SINGLE**: General single-line text
- **Backend**: Currently identical storage and validation
- **Frontend**: Different UI components for data entry

## Required Permissions

Custom field operations use role-based permissions:

| Action | Required Role |
|--------|-------------------|
| Create URL field | `OWNER` or `ADMIN` role in the project |
| Update URL field | `OWNER` or `ADMIN` role in the project |
| Set URL value | User must have edit permissions for the record |
| View URL value | User must have view permissions for the record |

**Note:** Permissions are checked based on user roles in the project, not specific permission constants.

## Error Responses

### Field Not Found
```json
{
  "errors": [{
    "message": "Custom field not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Required Field Validation (Forms Only)
```json
{
  "errors": [{
    "message": "This field is required",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Best Practices

### URL Format Standards
- Always include protocol (http:// or https://)
- Use HTTPS when possible for security
- Test URLs before storing to ensure they're accessible
- Consider using shortened URLs for display purposes

### Data Quality
- Validate URLs in your application before storing
- Check for common typos (missing protocols, incorrect domains)
- Standardize URL formats across your organization
- Consider URL accessibility and availability

### Security Considerations
- Be cautious with user-provided URLs
- Validate domains if restricting to specific sites
- Consider URL scanning for malicious content
- Use HTTPS URLs when handling sensitive data

## Filtering and Search

### Contains Search
URL fields support substring searching:

```graphql
query SearchUrls {
  todos(
    customFieldFilters: [{
      customFieldId: "url_field_id"
      operation: CONTAINS
      value: "docs.example.com"
    }]
  ) {
    id
    title
    customFields {
      text
    }
  }
}
```

### Search Capabilities
- Case-insensitive substring matching
- Partial domain matching
- Path and parameter searching
- No protocol-specific filtering

## Common Use Cases

1. **Project Management**
   - Project websites
   - Documentation links
   - Repository URLs
   - Demo sites

2. **Content Management**
   - Reference materials
   - Source links
   - Media resources
   - External articles

3. **Customer Support**
   - Customer websites
   - Support documentation
   - Knowledge base articles
   - Video tutorials

4. **Sales & Marketing**
   - Company websites
   - Product pages
   - Marketing materials
   - Social media profiles

## Integration Features

### With Lookups
- Reference URLs from other records
- Find records by domain or URL pattern
- Display related web resources
- Aggregate links from multiple sources

### With Forms
- URL-specific input components
- Planned validation for proper URL format
- Link preview capabilities (frontend)
- Clickable URL display

### With Reporting
- Track URL usage and patterns
- Monitor broken or inaccessible links
- Categorize by domain or protocol
- Export URL lists for analysis

## Limitations

### Current Limitations
- No active URL format validation
- No automatic protocol addition
- No link verification or accessibility checking
- No URL shortening or expansion
- No favicon or preview generation

### Automation Restrictions
- Not available as automation trigger fields
- Cannot be used in automation field updates
- Can be referenced in automation conditions
- Available in email templates and webhooks

### General Constraints
- No built-in link preview functionality
- No automatic URL shortening
- No click tracking or analytics
- No URL expiration checking
- No malicious URL scanning

## Future Enhancements

### Planned Features
- HTTP/HTTPS protocol validation
- Custom regex validation patterns
- Automatic protocol prefix addition
- URL accessibility checking

### Potential Improvements
- Link preview generation
- Favicon display
- URL shortening integration
- Click tracking capabilities
- Broken link detection

## Related Resources

- [Text Fields](/api/custom-fields/text-single) - For non-URL text data
- [Email Fields](/api/custom-fields/email) - For email addresses
- [Custom Fields Overview](/api/custom-fields/2.list-custom-fields) - General concepts

## Migration from Text Fields

If you're migrating from text fields to URL fields:

1. **Create URL field** with the same name and configuration
2. **Export existing text values** to verify they're valid URLs
3. **Update records** to use the new URL field
4. **Delete old text field** after successful migration
5. **Update applications** to use URL-specific UI components

### Migration Example
```graphql
# Step 1: Create URL field
mutation CreateUrlField {
  createCustomField(input: {
    name: "Website Link"
    type: URL
    projectId: "proj_123"
  }) {
    id
  }
}

# Step 2: Update records (repeat for each record)
mutation MigrateToUrlField {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "new_url_field_id"
    text: "https://example.com"  # Value from old text field
  })
}
```

## dashboards

### /api/dashboards/copy-dashboard

Source: https://blue.cc/api/dashboards/copy-dashboard

The `copyDashboard` mutation creates a complete copy of an existing dashboard, including all charts, chart segments, values, and user permissions. This operation performs a deep copy with new unique identifiers for all copied elements.

## Basic Example

Create a copy of a dashboard with a custom title:

```graphql
mutation CopyDashboard {
  copyDashboard(input: {
    dashboardId: "dashboard_123"
    title: "Q4 Sales Dashboard Copy"
  }) {
    id
    title
    createdAt
    charts {
      id
      title
      chartType
    }
    dashboardUsers {
      id
      role
      user {
        id
        email
      }
    }
  }
}
```

## Advanced Example

Copy a dashboard without specifying a title (automatically appends "(Copy)"):

```graphql
mutation CopyDashboardAuto {
  copyDashboard(input: {
    dashboardId: "dashboard_456"
  }) {
    id
    uid
    title
    createdBy {
      id
      email
    }
    company {
      id
      name
    }
    charts {
      id
      title
      chartType
      position
      chartSegments {
        id
        title
        formula
        chartValues {
          id
          value
        }
      }
    }
    dashboardUsers {
      id
      role
      user {
        id
        email
        fullName
      }
    }
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### CopyDashboardInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `dashboardId` | String! | ✅ Yes | ID of the dashboard to copy |
| `title` | String | No | Custom title for the copied dashboard. If not provided, appends "(Copy)" to the original title |

## Response Fields

### Dashboard Response

The mutation returns a complete `Dashboard` object with all copied data:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the new dashboard |
| `uid` | String! | Unique identifier used for URL routing |
| `title` | String! | Title of the copied dashboard |
| `createdBy` | User! | The user who performed the copy operation |
| `company` | Company! | The company the dashboard belongs to (same as original) |
| `project` | Project | Project association (same as original, if any) |
| `charts` | [Chart!]! | All charts copied from the original dashboard |
| `dashboardUsers` | [DashboardUser!]! | User permissions copied from original (excluding copying user) |
| `createdAt` | DateTime! | When the copy was created |
| `updatedAt` | DateTime! | When the copy was last modified |

## Dashboard Copying Behavior

### Deep Copy Process

The `copyDashboard` operation performs a complete deep copy including:

1. **Dashboard Metadata**
   - Creates new dashboard with new ID and UID
   - Copies title (or appends "(Copy)" if no custom title)
   - Sets creator to the user performing the copy
   - Maintains company and project associations

2. **Charts and Structure**
   - Copies all charts with new IDs and UIDs
   - Preserves chart types, titles, and positions
   - Maintains chart configuration and metadata

3. **Chart Segments and Values**
   - Copies all chart segments with new IDs and UIDs
   - Preserves segment titles, formulas, and configurations
   - Copies all chart values and their data

4. **Formula References**
   - Updates formula references to use new UIDs
   - Maintains formula logic and calculations
   - Ensures copied formulas reference copied data

5. **User Permissions**
   - Copies all dashboard user permissions from original
   - Excludes the copying user (they become the creator)
   - Preserves VIEWER and EDITOR role assignments

### Post-Copy Operations

After creating the copy, the system automatically:
- Publishes dashboard creation events for real-time updates
- Triggers chart result recalculation for all copied charts
- Updates any dependent systems or integrations

## Required Permissions

Dashboard copying requires specific permissions:

| Role | Can Copy Dashboard |
|------|-------------------|
| Dashboard Creator | ✅ Yes |
| Dashboard EDITOR | ✅ Yes |
| Dashboard VIEWER | ❌ No |
| Non-dashboard User | ❌ No |

**Permission Check**: The user must have EDITOR access to the original dashboard through either:
- Being the original dashboard creator
- Having an explicit EDITOR role assignment on the dashboard

## Error Responses

### Dashboard Not Found

```json
{
  "errors": [{
    "message": "Dashboard was not found.",
    "extensions": {
      "code": "DASHBOARD_NOT_FOUND"
    }
  }]
}
```

### Insufficient Permissions

```json
{
  "errors": [{
    "message": "You don't have permission to access this dashboard",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Invalid Input

```json
{
  "errors": [{
    "message": "Dashboard ID is required",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Use Cases

### 1. Template Dashboards
Create template dashboards that can be copied for new projects or teams:

```graphql
mutation CreateProjectDashboard {
  copyDashboard(input: {
    dashboardId: "template_dashboard_id"
    title: "Project Alpha - Sales Dashboard"
  }) {
    id
    title
  }
}
```

### 2. Backup and Versioning
Create backups before making significant changes:

```graphql
mutation BackupDashboard {
  copyDashboard(input: {
    dashboardId: "production_dashboard"
    title: "Production Dashboard - Backup 2024-01-15"
  }) {
    id
    title
    createdAt
  }
}
```

### 3. Cross-Team Sharing
Copy dashboards between teams while maintaining data structure:

```graphql
mutation ShareDashboardWithTeam {
  copyDashboard(input: {
    dashboardId: "marketing_dashboard"
    title: "Marketing Dashboard - Sales Team Copy"
  }) {
    id
    title
    dashboardUsers {
      role
      user {
        email
      }
    }
  }
}
```

## Best Practices

### Naming Conventions
- Use descriptive titles that indicate the copy's purpose
- Include team names, dates, or version numbers for clarity
- Avoid generic names like "Copy" or "New Dashboard"

### Permission Management
- Review copied dashboard permissions after creation
- Add or remove users as needed for the specific use case
- Consider whether viewers need to become editors on the copy

### Data Integrity
- Verify that formulas and calculations work correctly after copying
- Check that chart data sources are appropriate for the new context
- Test any automated reports or integrations

## Performance Considerations

- Copying large dashboards with many charts may take several seconds
- Chart recalculation happens asynchronously after the copy
- Consider copying during off-peak hours for very large dashboards
- Monitor system resources when copying multiple dashboards simultaneously

## Limitations

- Cannot copy dashboards across different companies
- Formula references are limited to data within the same company
- Some external integrations may need reconfiguration
- Custom permissions or roles may need manual adjustment
- Historical data and analytics are not preserved in the copy

## Related Resources

- [Dashboard Overview](/api/9.dashboards/1.index) - General dashboard concepts
- [Rename Dashboard](/api/9.dashboards/3.rename-dashboard) - Change dashboard titles
- [Dashboard Users](/api/dashboard-users) - Manage dashboard permissions
- [Charts API](/api/charts) - Work with individual charts

### /api/dashboards/create-dashboard

Source: https://blue.cc/api/dashboards/create-dashboard

## Create a Dashboard

The `createDashboard` mutation allows you to create a new dashboard within your organization or project. Dashboards are powerful visualization tools that help teams track metrics, monitor progress, and make data-driven decisions.

### Basic Example

```graphql
mutation CreateDashboard {
  createDashboard(
    input: {
      companyId: "comp_abc123"
      title: "Sales Performance Dashboard"
    }
  ) {
    id
    title
    createdBy {
      id
      email
      firstName
      lastName
    }
    createdAt
  }
}
```

### Project-Specific Dashboard

Create a dashboard associated with a specific project:

```graphql
mutation CreateProjectDashboard {
  createDashboard(
    input: {
      companyId: "comp_abc123"
      projectId: "proj_xyz789"
      title: "Q4 Project Metrics"
    }
  ) {
    id
    title
    project {
      id
      name
    }
    createdBy {
      id
      email
    }
    dashboardUsers {
      id
      user {
        id
        email
      }
      role
    }
    createdAt
  }
}
```

## Input Parameters

### CreateDashboardInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | String! | ✅ Yes | The ID of the organization where the dashboard will be created |
| `title` | String! | ✅ Yes | The name of the dashboard. Must be a non-empty string |
| `projectId` | String | No | Optional ID of a project to associate with this dashboard |

## Response Fields

The mutation returns a complete `Dashboard` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the created dashboard |
| `title` | String! | The dashboard title as provided |
| `companyId` | String! | The organization this dashboard belongs to |
| `projectId` | String | The associated project ID (if provided) |
| `project` | Project | The associated project object (if projectId was provided) |
| `createdBy` | User! | The user who created the dashboard (you) |
| `dashboardUsers` | [DashboardUser!]! | List of users with access (initially just the creator) |
| `createdAt` | DateTime! | Timestamp of when the dashboard was created |
| `updatedAt` | DateTime! | Timestamp of last modification (same as createdAt for new dashboards) |

### DashboardUser Fields

When a dashboard is created, the creator is automatically added as a dashboard user:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the dashboard user relationship |
| `user` | User! | The user object with access to the dashboard |
| `role` | DashboardRole! | The user's role (creator gets full access) |
| `dashboard` | Dashboard! | Reference back to the dashboard |

## Required Permissions

Any authenticated user who belongs to the specified organization can create dashboards. There are no special role requirements.

| User Status | Can Create Dashboard |
|-------------|-------------------|
| Organization Member | ✅ Yes |
| Non-Organization Member | ❌ No |
| Unauthenticated | ❌ No |

## Error Responses

### Invalid Organization
```json
{
  "errors": [{
    "message": "Organization not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### User Not in Organization
```json
{
  "errors": [{
    "message": "You don't have access to this organization",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Invalid Project
```json
{
  "errors": [{
    "message": "Project not found or doesn't belong to the specified organization",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Empty Title
```json
{
  "errors": [{
    "message": "Dashboard title cannot be empty",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Important Notes

- **Automatic ownership**: The user creating the dashboard automatically becomes its owner with full permissions
- **Project association**: If you provide a `projectId`, it must belong to the same organization
- **Initial permissions**: Only the creator has access initially. Use `editDashboard` to add more users
- **Title requirements**: Dashboard titles must be non-empty strings. There's no uniqueness requirement
- **Organization membership**: You must be a member of the organization to create dashboards in it

## Dashboard Creation Workflow

1. **Create the dashboard** using this mutation
2. **Configure charts and widgets** using the dashboard builder UI
3. **Add team members** using the `editDashboard` mutation with `dashboardUsers`
4. **Set up filters and date ranges** through the dashboard interface
5. **Share or embed** the dashboard using its unique ID

## Use Cases

1. **Executive dashboards**: Create high-level overviews of organization metrics
2. **Project tracking**: Build project-specific dashboards to monitor progress
3. **Team performance**: Track team productivity and achievement metrics
4. **Client reporting**: Create dashboards for client-facing reports
5. **Real-time monitoring**: Set up dashboards for live operational data

## Best Practices

1. **Naming conventions**: Use clear, descriptive titles that indicate the dashboard's purpose
2. **Project association**: Link dashboards to projects when they're project-specific
3. **Access management**: Add team members immediately after creation for collaboration
4. **Organization**: Create a dashboard hierarchy using consistent naming patterns

## Related Operations

- [List Dashboards](/api/dashboards/) - Retrieve all dashboards for an organization or project
- [Edit Dashboard](/api/dashboards/rename-dashboard) - Rename dashboard or manage users
- [Copy Dashboard](/api/dashboards/copy-dashboard) - Duplicate an existing dashboard
- [Delete Dashboard](/api/dashboards/delete-dashboard) - Remove a dashboard

### /api/dashboards/delete-dashboard

Source: https://blue.cc/api/dashboards/delete-dashboard

## Delete Dashboard

Permanently delete a dashboard that you created. This operation cannot be undone and will remove all charts, chart segments, and dashboard sharing configurations.

## Basic Example

```graphql
mutation DeleteDashboard {
  deleteDashboard(id: "dashboard_123") {
    success
    message
  }
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | Unique identifier of the dashboard to delete |

## Response Fields

### MutationResult

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Whether the deletion was successful |
| `message` | String | Status message about the operation |

## Required Permissions

### Creator Only
- **Only the dashboard creator** can delete a dashboard
- Users with EDITOR access cannot delete dashboards
- Company administrators cannot delete dashboards created by others

### Authentication
- Must be authenticated and have access to the dashboard's company

## What Gets Deleted

When you delete a dashboard, the following data is permanently removed:

### Dashboard Data
- Dashboard title and metadata
- Creation and modification timestamps
- Dashboard user sharing configurations

### Chart Data
- All charts within the dashboard
- Chart segments and their configurations
- Chart segment values and calculations
- Chart display settings and formatting

### Related Data
- Dashboard user role assignments
- Any dashboard subscriptions or real-time connections

## Error Responses

### Dashboard Not Found
```json
{
  "errors": [{
    "message": "Dashboard not found",
    "extensions": {
      "code": "DASHBOARD_NOT_FOUND"
    }
  }]
}
```

### Permission Denied
```json
{
  "errors": [{
    "message": "Only the creator of a dashboard can delete it",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Authentication Required
```json
{
  "errors": [{
    "message": "You must be authenticated to perform this action",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```

## Important Considerations

### Permanent Action
- **Cannot be undone**: Once deleted, the dashboard and all its data cannot be recovered
- **No soft delete**: The dashboard is permanently removed from the database
- **Immediate effect**: The deletion takes place immediately

### Impact on Other Users
- **Shared users lose access**: Users who had VIEWER or EDITOR access will no longer be able to access the dashboard
- **Active sessions**: Users currently viewing the dashboard will lose connection
- **Subscriptions**: Any real-time subscriptions to the dashboard will be terminated

### Data Dependencies
- **No external dependencies**: Deleting a dashboard does not affect projects, todos, or other company data
- **Self-contained**: Only dashboard-specific data is removed

## Best Practices

### Before Deletion
- **Export important data**: Save any critical chart configurations or insights
- **Notify shared users**: Inform team members who have access to the dashboard
- **Consider copying**: Use the copy dashboard feature to create a backup if needed
- **Document insights**: Save any important business insights or findings

### Alternative Actions
- **Remove sharing**: Consider removing dashboard users instead of deleting
- **Archive approach**: There is no built-in archive feature, but you could rename the dashboard to indicate it's archived

## Common Use Cases

### Cleanup Unused Dashboards
```graphql
# First, list dashboards to identify unused ones
query FindUnusedDashboards {
  dashboards(filter: { companyId: "company_123" }) {
    items {
      id
      title
      updatedAt
      dashboardUsers {
        id
      }
    }
  }
}

# Then delete specific dashboard
mutation CleanupDashboard {
  deleteDashboard(id: "old_dashboard_id") {
    success
    message
  }
}
```

### Remove Test Dashboards
```graphql
mutation RemoveTestDashboard {
  deleteDashboard(id: "test_dashboard_123") {
    success
    message
  }
}
```

## Security Notes

### Creator Verification
- The system verifies that the requesting user is the original creator
- User ID is checked against the dashboard's `createdById` field
- No role-based overrides are allowed (even company owners cannot delete others' dashboards)

### Audit Trail
- Dashboard deletion events are logged for audit purposes
- Deletion timestamp and requesting user are recorded
- Company administrators can view deletion logs

## Related Operations

- [List Dashboards](/api/dashboards/1.index) - View available dashboards
- [Copy Dashboard](/api/dashboards/2.copy-dashboard) - Create backup before deletion
- [Create Dashboard](/api/dashboards/create-dashboard) - Create new dashboard (documentation pending)
- [Edit Dashboard](/api/dashboards/edit-dashboard) - Modify dashboard instead of deleting (documentation pending)

### /api/dashboards/index

Source: https://blue.cc/api/dashboards/index

## List Dashboards

Retrieve dashboards that you have access to view. This includes dashboards you created and dashboards that have been shared with you.

## Basic Example

```graphql
query ListDashboards {
  dashboards(filter: { companyId: "company_123" }) {
    items {
      id
      title
      createdBy {
        id
        name
        email
      }
      createdAt
      updatedAt
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

## Advanced Example

```graphql
query ListDashboardsAdvanced {
  dashboards(
    filter: { 
      companyId: "company_123"
      projectId: "proj_456"  # Optional: filter by project
    }
    sort: [updatedAt_DESC, title_ASC]
    skip: 0
    take: 10
  ) {
    items {
      id
      title
      createdBy {
        id
        name
        email
      }
      dashboardUsers {
        id
        role
        user {
          id
          name
          email
        }
      }
      createdAt
      updatedAt
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

## Input Parameters

### DashboardFilterInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | String! | ✅ Yes | Organization ID to filter dashboards |
| `projectId` | String | No | Optional project ID to filter dashboards |

### Sorting Options

| Sort Value | Description |
|------------|-------------|
| `title_ASC` | Sort by title ascending |
| `title_DESC` | Sort by title descending |
| `createdBy_ASC` | Sort by creator ascending |
| `createdBy_DESC` | Sort by creator descending |
| `updatedAt_ASC` | Sort by update time ascending |
| `updatedAt_DESC` | Sort by update time descending (default) |

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Int | 0 | Number of items to skip |
| `take` | Int | 20 | Number of items to return (max 100) |

## Response Fields

### DashboardPagination

| Field | Type | Description |
|-------|------|-------------|
| `items` | [Dashboard!]! | Array of dashboard objects |
| `pageInfo` | PageInfo! | Pagination information |

### Dashboard

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the dashboard |
| `title` | String! | Display name of the dashboard |
| `createdBy` | User! | User who created the dashboard |
| `dashboardUsers` | [DashboardUser!] | Users with access to this dashboard |
| `createdAt` | DateTime! | When the dashboard was created |
| `updatedAt` | DateTime! | When the dashboard was last modified |

### DashboardUser

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the dashboard user |
| `role` | DashboardRole! | User's role (VIEWER or EDITOR) |
| `user` | User! | User information |

## Access Control

### Dashboard Visibility
You can only see dashboards where you are:
- The creator of the dashboard
- Explicitly granted access via dashboard sharing

### Required Permissions
- **Authentication Required**: You must be logged in
- **Organization Access**: You must have access to the specified organization
- **Project Access**: If filtering by project, you must have access to that project

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

## Common Use Cases

### List All Organization Dashboards
```graphql
query CompanyDashboards {
  dashboards(filter: { companyId: "company_123" }) {
    items {
      id
      title
      createdBy { name }
    }
  }
}
```

### List Project-Specific Dashboards
```graphql
query ProjectDashboards {
  dashboards(filter: { 
    companyId: "company_123"
    projectId: "proj_456"
  }) {
    items {
      id
      title
    }
  }
}
```

### Paginated Dashboard List
```graphql
query PaginatedDashboards {
  dashboards(
    filter: { companyId: "company_123" }
    skip: 20
    take: 10
  ) {
    items {
      id
      title
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```

## Best Practices

### Performance
- Use pagination for better performance with large dashboard lists
- Only request fields you need in your application
- Consider caching dashboard lists for frequently accessed data

### Filtering
- Always filter by organization to ensure proper data isolation
- Use project filtering when working with project-specific dashboards
- Combine filters to narrow down results efficiently

### Sorting
- Default sorting is by `updatedAt_DESC` (most recently updated first)
- Use title sorting for alphabetical organization
- Combine multiple sort criteria for complex ordering needs

## Related Operations

- [Create Dashboard](/api/dashboards/create-dashboard) - Create new dashboards
- [Copy Dashboard](/api/dashboards/copy-dashboard) - Duplicate existing dashboards
- [Rename Dashboard](/api/dashboards/rename-dashboard) - Rename dashboards or manage users
- [Delete Dashboard](/api/dashboards/delete-dashboard) - Permanently remove dashboards

### /api/dashboards/rename-dashboard

Source: https://blue.cc/api/dashboards/rename-dashboard

## Rename a Dashboard

The `editDashboard` mutation allows you to rename a dashboard by updating its title. Only the dashboard creator has permission to rename a dashboard.

### Basic Example

```graphql
mutation RenameDashboard {
  editDashboard(
    input: {
      id: "dash_abc123"
      title: "Q4 Sales Dashboard"
    }
  ) {
    id
    title
    updatedAt
  }
}
```

### Advanced Example with User Management

The `editDashboard` mutation can also update dashboard users while renaming:

```graphql
mutation RenameAndUpdateUsers {
  editDashboard(
    input: {
      id: "dash_abc123"
      title: "Updated Sales Dashboard"
      dashboardUsers: [
        {
          userId: "user_123"
          role: EDITOR
        }
        {
          userId: "user_456"
          role: VIEWER
        }
      ]
    }
  ) {
    id
    title
    dashboardUsers {
      id
      user {
        id
        email
        firstName
        lastName
      }
      role
    }
    updatedAt
  }
}
```

## Input Parameters

### EditDashboardInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | The unique identifier of the dashboard to rename |
| `title` | String | No | The new title for the dashboard. If not provided, title remains unchanged |
| `dashboardUsers` | [EditDashboardUserInput!] | No | Optional array to update dashboard user permissions |

### EditDashboardUserInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | String! | ✅ Yes | The ID of the user to add or update |
| `role` | DashboardRole! | ✅ Yes | The role to assign to the user |

### DashboardRole Values

| Value | Description |
|-------|-------------|
| `EDITOR` | Can view and edit dashboard content (charts, filters, layout) |
| `VIEWER` | Can only view the dashboard |

## Response Fields

The mutation returns a complete `Dashboard` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique dashboard identifier |
| `title` | String! | The updated dashboard title |
| `createdBy` | User! | The user who created the dashboard |
| `dashboardUsers` | [DashboardUser!]! | List of users with access to the dashboard |
| `createdAt` | DateTime! | When the dashboard was created |
| `updatedAt` | DateTime! | When the dashboard was last modified |

## Required Permissions

Only the **dashboard creator** can rename a dashboard. Other users with EDITOR or VIEWER roles cannot change the dashboard title.

| User Type | Can Rename Dashboard |
|-----------|-------------------|
| Dashboard Creator | ✅ Yes |
| Dashboard Editor | ❌ No |
| Dashboard Viewer | ❌ No |
| Other Company Users | ❌ No |

## Error Responses

### Dashboard Not Found
```json
{
  "errors": [{
    "message": "Dashboard not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to edit this dashboard",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Validation Error
```json
{
  "errors": [{
    "message": "Dashboard title cannot be empty",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

## Important Notes

- **No separate rename mutation**: There is no `renameDashboard` mutation. Renaming is handled through the `editDashboard` mutation
- **Creator-only permission**: Only the dashboard creator can rename it, even if other users have EDITOR role
- **Title validation**: Dashboard titles must be non-empty strings
- **Atomic operation**: When updating both title and users, either all changes succeed or none are applied
- **User management**: You can add, update, or remove dashboard users in the same operation as renaming

## Use Cases

1. **Rebranding dashboards**: Update dashboard names to reflect new company terminology or branding
2. **Seasonal updates**: Rename dashboards to reflect current time periods (e.g., "Q3 2024 Sales" → "Q4 2024 Sales")
3. **Project evolution**: Update dashboard titles as projects change scope or focus
4. **Clarity improvements**: Rename dashboards to be more descriptive or follow naming conventions

## Related Operations

- [List Dashboards](/api/dashboards/) - Retrieve all dashboards for a company or project
- [Create Dashboard](/api/dashboards/create-dashboard) - Create a new dashboard
- [Delete Dashboard](/api/dashboards/delete-dashboard) - Remove a dashboard
- [Copy Dashboard](/api/dashboards/copy-dashboard) - Duplicate an existing dashboard

## import-export

### /api/import-export/export-csv-template

Source: https://blue.cc/api/import-export/export-csv-template

## Export CSV Template

The `exportCSVTemplate` mutation generates a blank CSV file pre-populated with the correct column headers for a given workspace, including all custom field names. This template can be filled out and then uploaded via the `importTodos` mutation.

### Basic Example

```graphql
mutation DownloadImportTemplate {
  exportCSVTemplate(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  )
}
```

### Advanced Example

Use the returned signed URL to trigger a browser download:

```graphql
mutation DownloadImportTemplate {
  exportCSVTemplate(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  )
}

# Response:
# {
#   "data": {
#     "exportCSVTemplate": "https://storage.example.com/org-slug/workspace-slug/workspace-template-301520032025.csv?X-Amz-Expires=86400&..."
#   }
# }
```

## Input Parameters

### ExportCSVTemplateInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID of the workspace to generate the template for |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `exportCSVTemplate` | String! | A signed download URL for the generated CSV template file. The URL expires after **24 hours**. |

## Template Columns

The generated CSV contains a header row with the following columns, followed by one empty data row:

| Column | Description |
|--------|-------------|
| `Title` | Record title |
| `List` | Name of the list to place the record in |
| `Done` | Completion status (`true` / `false`) |
| `Start Date` | Start date of the record |
| `Due Date` | Due date of the record |
| `Description` | Record description |
| `Assignees` | Comma-separated assignee names or emails |
| `Created At` | Original creation timestamp |
| `Updated At` | Original last-updated timestamp |
| `Created By` | Original creator name or email |
| `Color` | Record color |
| `Project` | Workspace name |
| `Tags` | Comma-separated tag names |
| *Custom field columns* | One column per custom field in the workspace, ordered by position. Currency-type fields include an additional `Currency Types` column immediately after. |

## Required Permissions

| Access Level | Can Export Template |
|--------------|-------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | Yes |
| `CLIENT` | Yes |
| `COMMENT_ONLY` | Yes |
| `VIEW_ONLY` | Yes |

Any user with access to the workspace can generate a CSV template. Creating records from the template still requires record-creation permission.

## Error Responses

### ProjectNotFoundError
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `projectId` does not exist.

## Important Notes

- **Signed URL**: The returned URL is a pre-signed storage URL that expires after **24 hours**. Download the file promptly or request a new URL.
- **Custom Fields Included**: The template automatically includes columns for every custom field configured in the workspace, ordered by their position. This ensures CSV imports can set custom field values.
- **Currency Fields**: If the workspace has a currency-type custom field, an additional `Currency Types` column is inserted immediately after the currency column for specifying the currency code (e.g., `USD`, `EUR`).
- **Workflow**: The typical bulk-import workflow is:
  1. Call `exportCSVTemplate` to download the template
  2. Fill in record data in the CSV
  3. Upload the CSV file using the file upload API
  4. Call `importTodos` with the `s3Key`, `headers`, and `projectId`
  5. Subscribe to `subscribeToImportExportProgress` to track progress

### /api/import-export/export-records

Source: https://blue.cc/api/import-export/export-records

## Export Records

The `exportTodos` mutation starts an asynchronous CSV export of records from a workspace. When the export finishes, a download link is emailed to the requesting user. Progress can be tracked in real time through the `subscribeToImportExportProgress` subscription.

For cross-workspace exports from a report, use the `exportReport` mutation instead.

### Basic Example

Export all records from a workspace:

```graphql
mutation ExportRecords {
  exportTodos(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  )
}
```

### Advanced Example

Export filtered records using the optimized Rust-based exporter:

```graphql
mutation ExportFilteredRecords {
  exportTodos(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
      useRustExport: true
      filter: {
        companyIds: ["org_abc123"]
        done: false
        assigneeIds: ["user_123", "user_456"]
        tagIds: ["tag_789"]
        dueStart: "2025-01-01T00:00:00Z"
        dueEnd: "2025-03-31T23:59:59Z"
        q: "launch"
        fields: [{ id: "cf_status_456", values: ["In Progress"] }]
        op: AND
      }
    }
  )
}
```

## Input Parameters

### ExportTodosInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID of the workspace to export records from |
| `useRustExport` | Boolean | No | Use the optimized Rust-based export pipeline (recommended for large workspaces) |
| `filter` | TodosFilter | No | Filter criteria to limit which records are exported. If omitted, all records are exported |

### TodosFilter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyIds` | [String!]! | Yes | Organization IDs to scope the export |
| `projectIds` | [String!] | No | Additional workspace IDs to include |
| `todoIds` | [String!] | No | Export only these specific record IDs |
| `assigneeIds` | [String!] | No | Filter by assigned user IDs |
| `unassigned` | Boolean | No | When `true`, include only unassigned records |
| `tagIds` | [String!] | No | Filter by tag IDs |
| `tagColors` | [String!] | No | Filter by tag hex colors |
| `tagTitles` | [String!] | No | Filter by tag titles |
| `todoListIds` | [String!] | No | Filter by list IDs |
| `todoListTitles` | [String!] | No | Filter by list titles |
| `done` | Boolean | No | Filter by completion status |
| `showCompleted` | Boolean | No | Include completed records |
| `startedAt` | DateTime | No | Filter records with a start date on or after this value |
| `duedAt` | DateTime | No | Filter records with a due date on or before this value |
| `dueStart` | DateTime | No | Due date range start |
| `dueEnd` | DateTime | No | Due date range end |
| `duedAtStart` | DateTime | No | Alternative due date range start |
| `duedAtEnd` | DateTime | No | Alternative due date range end |
| `updatedAt_gt` | DateTime | No | Records updated after this timestamp |
| `updatedAt_gte` | DateTime | No | Records updated at or after this timestamp |
| `search` | String | No | Full-text search query |
| `q` | String | No | Quick search query |
| `excludeArchivedProjects` | Boolean | No | Exclude records from archived workspaces |
| `fields` | JSON | No | Custom field filter conditions (array of `{ id, values }` objects) |
| `op` | FilterLogicalOperator | No | Logical operator for combining filters: `AND` (default) or `OR` |
| `coordinates` | JSON | No | Geographic bounding box for map-view filtering |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `exportTodos` | Boolean! | Returns `true` when the export job has been queued |

The actual CSV file is delivered by email once the export completes. The email contains a download link that expires after **24 hours**.

## Export a Report

The `exportReport` mutation exports records across multiple workspaces that belong to a report.

### Example

```graphql
mutation ExportReport {
  exportReport(
    input: {
      reportId: "report_abc123"
    }
  )
}
```

### ExportReportInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reportId` | String! | Yes | ID of the report to export |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `exportReport` | Boolean! | Returns `true` when the export job has been queued |

## Export a Chart

The `exportChartCSV` mutation exports the data behind a dashboard chart as a CSV file.

### Example

```graphql
mutation ExportChart {
  exportChartCSV(
    chartId: "chart_xyz789"
    filter: {
      assigneeIds: ["user_123"]
      done: false
    }
  )
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chartId` | ID! | Yes | ID of the chart to export |
| `filter` | TodoFilterInput | No | Optional filter to scope the chart data |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `exportChartCSV` | Boolean! | Returns `true` when the chart export job has been queued |

## Tracking Export Progress

Subscribe to real-time progress updates:

```graphql
subscription TrackExportProgress {
  subscribeToImportExportProgress(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    userId: "user_123"
  )
}
```

See the [Import/Export overview](/api/import-export) for the full subscription payload shape.

## Required Permissions

| Operation | Access Level | Notes |
|-----------|-------------|-------|
| `exportTodos` | `MEMBER` or above | User must be a member of the workspace |
| `exportReport` | Report member or org member | User must have access to the report |
| `exportChartCSV` | Org member | User must belong to the organization that owns the dashboard |

## Error Responses

### ProjectNotFoundError
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
**When**: The workspace does not exist or the user is not a member.

### ReportNotFoundError
```json
{
  "errors": [{
    "message": "Report was not found.",
    "extensions": {
      "code": "REPORT_NOT_FOUND"
    }
  }]
}
```
**When**: The report does not exist or the user does not have access.

### ChartNotFoundError
```json
{
  "errors": [{
    "message": "Chart was not found.",
    "extensions": {
      "code": "CHART_NOT_FOUND"
    }
  }]
}
```
**When**: The chart does not exist or the user is not a member of the owning organization.

### ChartAlreadyExportingError
```json
{
  "errors": [{
    "message": "Chart is already being exported.",
    "extensions": {
      "code": "CHART_ALREADY_EXPORTING"
    }
  }]
}
```
**When**: A chart export for the same chart and user is already in progress. Chart exports are deduplicated for up to 6 hours.

## Important Notes

- **Asynchronous Delivery**: All export mutations return immediately. The CSV file is generated in the background and a download link is sent to the user's email.
- **Download Link Expiry**: Export download links expire after **24 hours**.
- **Chart Export Deduplication**: Only one chart export per chart per user can run at a time. Subsequent requests within 6 hours will be rejected.
- **Report Exports**: Report exports combine records from all workspaces referenced by the report's data sources, applying any report-level filters.
- **Large Exports**: For workspaces with many records, enable `useRustExport: true` for significantly faster export times.

### /api/import-export/index

Source: https://blue.cc/api/import-export/index

## Overview

The Import/Export API lets you bulk-import records from CSV files into a workspace, export records as CSV, and download pre-formatted CSV templates. Long-running import and export operations publish real-time progress through the `subscribeToImportExportProgress` subscription.

## Available Operations

| Operation | Description | Link |
|-----------|-------------|------|
| **Import Records** | Bulk-import records from a CSV file | [See below](#import-records) |
| **Cancel Import** | Cancel an in-progress import | [See below](#cancel-import) |
| **Export Records** | Export workspace records to CSV | [View Details →](/api/import-export/export-records) |
| **Export CSV Template** | Download a blank CSV template with workspace columns | [View Details →](/api/import-export/export-csv-template) |

---

## Import Records

The `importTodos` mutation bulk-imports records into a workspace from a CSV file that has already been uploaded to storage. The CSV is parsed in streaming chunks and records are created inside a database transaction. Progress is broadcast in real time through the `subscribeToImportExportProgress` subscription.

### Basic Example

```graphql
mutation ImportRecords {
  importTodos(
    input: {
      s3Key: "uploads/org-slug/workspace-slug/import-file.csv"
      headers: ["Title", "List", "Done", "Due Date", "Description", "Assignees", "Tags"]
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  )
}
```

### Advanced Example

Import records using the optimized Rust-based importer:

```graphql
mutation ImportRecordsAdvanced {
  importTodos(
    input: {
      s3Key: "uploads/org-slug/workspace-slug/import-file.csv"
      headers: [
        "Title",
        "List",
        "Done",
        "Start Date",
        "Due Date",
        "Description",
        "Assignees",
        "Created At",
        "Updated At",
        "Created By",
        "Color",
        "Project",
        "Tags",
        "Budget",
        "Priority"
      ]
      projectId: "clm4n8qwx000008l0g4oxdqn7"
      useRustImport: true
    }
  )
}
```

## Input Parameters

### ImportTodosInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `s3Key` | String! | Yes | The storage key of the uploaded CSV file |
| `headers` | JSON! | Yes | An ordered array of column header names that maps CSV columns to record fields |
| `projectId` | String! | Yes | ID of the workspace to import records into |
| `useRustImport` | Boolean | No | Use the optimized Rust-based import pipeline (recommended for large files) |

### Recognized Header Values

The `headers` array tells the importer how to interpret each CSV column. The following header names are recognized:

| Header | Description |
|--------|-------------|
| `Title` | Record title (recommended) |
| `List` | Name of the list to place the record in (created if it does not exist) |
| `Done` | Completion status (`true` / `false`) |
| `Start Date` | Start date of the record |
| `Due Date` | Due date of the record |
| `Description` | Record description |
| `Assignees` | Comma-separated assignee names or emails |
| `Created At` | Original creation timestamp |
| `Updated At` | Original last-updated timestamp |
| `Created By` | Original creator name or email |
| `Color` | Record color |
| `Project` | Workspace name |
| `Tags` | Comma-separated tag names (created if they do not exist) |
| *Custom field name* | Any other header is matched to a custom field by name |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `importTodos` | Boolean! | Returns `true` when the import has been accepted and is processing |

## Tracking Import Progress

Subscribe to real-time progress updates while an import is running:

```graphql
subscription TrackImportProgress {
  subscribeToImportExportProgress(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    userId: "user_123"
  )
}
```

The subscription returns a JSON payload with the following shape:

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | `"IMPORT"` or `"EXPORT"` |
| `userId` | String | ID of the user who initiated the operation |
| `username` | String | First name of the user |
| `projectId` | String | Workspace slug |
| `projectName` | String | Workspace name |
| `status` | String | `IN_PROGRESS`, `COMPLETE`, `CANCELLED`, or `ERROR` |
| `progress` | Float | Percentage complete (0 - 100) |
| `error` | String | Error message (only present when `status` is `ERROR`) |

---

## Cancel Import

The `cancelTodoImport` mutation cancels an import that is currently in progress.

### Basic Example

```graphql
mutation CancelImport {
  cancelTodoImport(projectId: "clm4n8qwx000008l0g4oxdqn7")
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace whose import should be cancelled |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `cancelTodoImport` | Boolean! | Returns `true` when the cancellation has been recorded |

## Required Permissions

| Operation | Access Level | Notes |
|-----------|-------------|-------|
| `importTodos` | `MEMBER` or above | User must have record-creation permission in the workspace |
| `cancelTodoImport` | `ADMIN` or `OWNER` | Only workspace administrators can cancel imports |

## Error Responses

### ProjectNotFoundError
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `projectId` does not exist or the user does not have access to it.

### TodoImportLimitError
```json
{
  "errors": [{
    "message": "You are importing too many todos.",
    "extensions": {
      "code": "TODO_IMPORT_LIMIT"
    }
  }]
}
```
**When**: The CSV contains more than 2,500 records and the organization is not on an Enterprise plan.

### ImportAlreadyInProgressError
```json
{
  "errors": [{
    "message": "Import already in progress.",
    "extensions": {
      "code": "IMPORT_ALREADY_IN_PROGRESS"
    }
  }]
}
```
**When**: An import is already running for this workspace. Only one import can run at a time per workspace.

## Important Notes

- **Record Limit**: Non-enterprise organizations are limited to importing **2,500 records** per CSV file. Enterprise organizations have no limit.
- **One Import at a Time**: Only one import can be active per workspace. Attempting a second import while one is in progress will return an error (or silently succeed if using the Rust importer).
- **List Auto-Creation**: Lists referenced in the CSV that do not already exist in the workspace are created automatically.
- **Tag Auto-Creation**: Tags referenced in the CSV that do not already exist are created automatically.
- **Custom Fields**: Any CSV header that does not match a built-in field name is treated as a custom field and matched by name against existing custom fields in the workspace.
- **Transaction Safety**: The standard importer runs inside a database transaction. If an error occurs mid-import, all changes from the current chunk are rolled back.
- **File Upload**: The CSV file must be uploaded to storage before calling `importTodos`. Use the file upload API to obtain the `s3Key`.

## libraries

### /api/libraries/python

Source: https://blue.cc/api/libraries/python

We provide a [Python library](https://pypi.org/project/bluepm/) that can be used to interact with the Blue API. This has 100% coverage of the Blue API with type safety and code completion in any modern IDE.

You can install by running:

```bash
pip install bluepm
```

You can then import and use the library in your code:

```python
from bluepm import BlueAPIClient
```

You can set your authentication details either as environment variables 

To use environment variables, set the following before running your script:

- BLUE_TOKEN_ID: Your Blue API token ID
- BLUE_SECRET_ID: Your Blue API secret ID
- BLUE_COMPANY_ID: Your Blue company ID (optional)
- BLUE_PROJECT_ID: Your Blue project ID (optional)

Or, pass them directly to the BlueAPIClient constructor:

```python
client = BlueAPIClient(
    token_id="your_token_id",
    secret_id="your_secret_id",
    company_id="your_company_id" #optional
    project_id = "your_project_id" #optional
)
```

Once you have done this, you can use the library to interact with the Blue API.  We have some helpers to simplify common tasks, but the entire API is exposed to allow for any interaction you need.

For example, to get a list of all projects you have access to, you can use the following code:

```python
projects = client.projects.list(company_id)
```

To get a list of lists for a project, you can use the following code:

```python
todo_lists = client.get_todo_lists(project_id)
```

## organization-management

### /api/organization-management/create-organization

Source: https://blue.cc/api/organization-management/create-organization

To create a new organization, you can use the following mutation:

```graphql
mutation CreateCompany {
  createCompany(input: { name: "new", slug: "new-slug" }) {
    id
  }
}
```

Note that creating new organizations may affect the billing of your Blue account, as each organization is billed separately.


Here are the options for the `createCompany` mutation and their descriptions:

| Option | Type | Description |
|--------|------|-------------|
| name | String | The name of the new organization. This is a required field. |
| slug | String | A URL-friendly version of the organization name. This is used in the organization's URL and should be unique. This is a required field and will also act as the unique identifier for the organization. |

### /api/organization-management/index

Source: https://blue.cc/api/organization-management/index

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

### /api/organization-management/query-organization

Source: https://blue.cc/api/organization-management/query-organization

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

## records

### /api/records/add-comment

Source: https://blue.cc/api/records/add-comment

## Add Comment

The createComment mutation allows you to add comments to records in Blue. Comments support rich HTML content, file attachments, @mentions, and are automatically integrated with the activity feed and notification system.

### Basic Example

Add a simple text comment to a record:

```graphql
mutation AddComment {
  createComment(
    input: {
      html: "<p>This task is progressing well!</p>"
      text: "This task is progressing well!"
      category: TODO
      categoryId: "clm4n8qwx000008l0g4oxdqn7"
    }
  ) {
    id
    html
    text
    createdAt
    user {
      id
      name
    }
  }
}
```

### Advanced Example

Add a comment with rich formatting, images, and TipTap editor processing:

```graphql
mutation AddCommentAdvanced {
  createComment(
    input: {
      html: "<p>Here's my <strong>feedback</strong> on this task:</p><ul><li>Great progress on the design</li><li>Need to review the API integration</li></ul><p>Attaching screenshot:</p><img src='data:image/png;base64,iVBOR...' />"
      text: "Here's my feedback on this task: - Great progress on the design - Need to review the API integration Attaching screenshot:"
      category: TODO
      categoryId: "clm4n8qwx000008l0g4oxdqn7"
      tiptap: true
    }
  ) {
    id
    html
    text
    createdAt
    user {
      id
      name
      avatar
    }
    activity {
      id
    }
    isRead
    isSeen
  }
}
```

## Input Parameters

### CreateCommentInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `html` | String! | ✅ Yes | HTML content of the comment (will be sanitized for security) |
| `text` | String! | ✅ Yes | Plain text version of the comment content |
| `category` | CommentCategory! | ✅ Yes | Type of entity being commented on (use `TODO` for records) |
| `categoryId` | String! | ✅ Yes | ID of the entity (record) being commented on |
| `tiptap` | Boolean | No | Enable TipTap editor processing. **Required** when including file attachments — without it, attachment divs are ignored. |

### CommentCategory Values

| Value | Description |
|-------|-------------|
| `TODO` | Comment on a record/todo item |
| `DISCUSSION` | Comment on a discussion thread |
| `STATUS_UPDATE` | Comment on a status update |

## Response Fields

The mutation returns a Comment object with comprehensive details:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the comment |
| `uid` | String! | Alternative unique identifier |
| `html` | String! | HTML content of the comment |
| `text` | String! | Plain text version of the comment |
| `category` | CommentCategory! | Type of entity commented on |
| `createdAt` | DateTime! | When the comment was created |
| `updatedAt` | DateTime! | When the comment was last updated |
| `deletedAt` | DateTime | When the comment was deleted (null if active) |
| `deletedBy` | User | User who deleted the comment |
| `user` | User! | User who created the comment |
| `activity` | Activity | Associated activity record |
| `discussion` | Discussion | Associated discussion (if category is DISCUSSION) |
| `statusUpdate` | StatusUpdate | Associated status update (if category is STATUS_UPDATE) |
| `todo` | Todo | Associated record (if category is TODO) |
| `isRead` | Boolean | Whether current user has read this comment |
| `isSeen` | Boolean | Whether current user has seen this comment |
| `aiSummary` | Boolean | Whether this comment was generated by AI |

## Required Permissions

Users must have appropriate project access to comment on records:

| Access Level | Can Add Comments |
|--------------|-----------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `COMMENT_ONLY` | ✅ Yes |
| `VIEW_ONLY` | ❌ No |

**Important**: The user must be a member of the project that contains the record and must NOT have `VIEW_ONLY` access level.

## Error Responses

### UnauthorizedError
```json
{
  "errors": [{
    "message": "You don't have permission to comment on this record",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```
**When**: User lacks permission to comment on the specified record/entity.

### ValidationError
```json
{
  "errors": [{
    "message": "Invalid input parameters",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```
**When**: Required fields are missing or contain invalid data.

### CommentNotFoundError
```json
{
  "errors": [{
    "message": "Record not found",
    "extensions": {
      "code": "COMMENT_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `categoryId` doesn't correspond to an existing record.

### UserInputError
```json
{
  "errors": [{
    "message": "Content validation failed",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```
**When**: HTML content fails sanitization or contains malicious code.

## File Attachments

To include uploaded files as clickable attachments in a comment (the same way files appear when attached via the Blue UI), embed them as `<div>` elements in the `html` field. You must set `tiptap: true` for the API to parse and link the files.

### Step 1: Upload the File

Upload your file using the [`uploadFile` mutation](/api/start-guide/upload-files) first to get the file metadata (`uid`, `name`, `size`, `type`, `extension`).

### Step 2: Embed the Attachment in the Comment HTML

Each file attachment is a `<div>` with a JSON `file` attribute:

```html
<div class="attachment" file='{"uid":"FILE_UID","name":"FILENAME","size":SIZE_IN_BYTES,"type":"MIME_TYPE","extension":"EXT"}'></div>
```

### Example

```graphql
mutation AddCommentWithFile {
  createComment(
    input: {
      html: "<p>Here is the report.</p><div class=\"attachment\" file='{\"uid\":\"cm8qujq3b01p22lrv9xbb2q62\",\"name\":\"report.pdf\",\"size\":204800,\"type\":\"application/pdf\",\"extension\":\"pdf\"}'></div>"
      text: "Here is the report."
      category: TODO
      categoryId: "clm4n8qwx000008l0g4oxdqn7"
      tiptap: true
    }
  ) {
    id
    html
    createdAt
  }
}
```

For a complete example with file upload + comment creation (including Python code), see the [Attaching Files to Comments](/api/start-guide/upload-files#attaching-files-to-comments) section in the upload guide.

### File Download URLs

Once a file is uploaded, its download URL is:

```
https://api.blue.cc/uploads/{uid}/{url_encoded_filename}
```

See the [File URLs](/api/start-guide/upload-files#file-urls) section for all URL variants (thumbnails, inline display).

---

## Important Notes

### Content Processing
- **HTML Sanitization**: All HTML content is automatically sanitized to prevent XSS attacks
- **File Extraction**: When `tiptap: true`, attachment `<div>` elements in the HTML are parsed and the referenced files are linked to the comment in the database
- **TipTap Mode**: When `tiptap: true`, uses specialized sanitization that supports file attachment parsing
- **@Mentions**: User mentions in comments are automatically processed and trigger notifications

### Performance Considerations
- Comments are indexed for search automatically
- Large image attachments are processed asynchronously
- Each comment creates an activity record for the project timeline

### Side Effects
Adding a comment triggers several automated processes:
- **Activity Creation**: Creates an activity record visible in project timeline
- **Search Indexing**: Comment content is added to the project search index
- **Notifications**: Sends email, push, and in-app notifications to relevant users
- **Real-time Updates**: Publishes comment to GraphQL subscriptions for live updates
- **Webhooks**: Triggers external webhook if configured for the project
- **@Mention Processing**: Processes user mentions and sends targeted notifications
- **File Processing**: Extracts and processes any embedded images or files from HTML content

### Content Security
- All HTML is sanitized using industry-standard libraries
- File uploads are validated for type and size
- Malicious content is automatically stripped
- User-generated content is escaped properly in all contexts

### Integration Features
- **Activity Feed**: Comments appear in the project activity timeline
- **Search**: Comment content is searchable within the project
- **Notifications**: Configurable notification preferences for different comment types
- **Real-time**: Comments appear instantly for other users viewing the same record
- **Mobile Support**: Comments are fully supported in mobile applications

### Related Endpoints
- **List Comments**: Query comments to retrieve existing comments on records
- **Update Comment**: Modify existing comment content
- **Delete Comment**: Remove comments with proper authorization
- **List Records**: Query todos to find records that can be commented on

### /api/records/assignees

Source: https://blue.cc/api/records/assignees

## Manage Record Assignees

The Blue API provides three operations for managing record assignees: setting assignees (smart replacement), adding assignees, and removing assignees. These operations handle activity tracking, notifications, webhooks, and real-time updates automatically.

### Set Record Assignees (Smart Assignment)

Replaces all current assignees with a new list. The system intelligently calculates what changes are needed, removing users not in the new list and adding new ones.

```graphql
mutation SetRecordAssignees {
  setTodoAssignees(input: {
    todoId: "record_abc123"
    assigneeIds: ["user_123", "user_456", "user_789"]
  }) {
    success
    operationId
  }
}
```

### Add Record Assignees

Adds new assignees without removing existing ones. Only users not already assigned will be added.

```graphql
mutation AddRecordAssignees {
  addTodoAssignees(input: {
    todoId: "record_abc123"
    assigneeIds: ["user_999", "user_111"]
  }) {
    success
    operationId
  }
}
```

### Remove Record Assignees

Removes specific assignees from a record.

```graphql
mutation RemoveRecordAssignees {
  removeTodoAssignees(input: {
    todoId: "record_abc123"
    assigneeIds: ["user_456"]
  }) {
    success
    operationId
  }
}
```

## Input Parameters

### SetTodoAssigneesInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to assign users to |
| `assigneeIds` | [String!]! | ✅ Yes | Array of user IDs to assign (replaces all current assignees) |

### AddTodoAssigneesInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to assign users to |
| `assigneeIds` | [String!]! | ✅ Yes | Array of user IDs to add as assignees |

### RemoveTodoAssigneesInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to remove assignees from |
| `assigneeIds` | [String!]! | ✅ Yes | Array of user IDs to remove from assignees |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Whether the operation completed successfully |
| `operationId` | String | Unique identifier for tracking this operation |

## Required Permissions

### Set/Remove Assignees

| Role | Can Assign/Remove |
|------|-------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `VIEW_ONLY` | ❌ No |
| `COMMENT_ONLY` | ❌ No |

### Add Assignees

| Role | Can Add Assignees |
|------|------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `VIEW_ONLY` | ✅ Yes |
| `COMMENT_ONLY` | ✅ Yes |

## Error Responses

### Record Not Found
```json
{
  "errors": [{
    "message": "Todo was not found.",
    "extensions": {
      "code": "TODO_NOT_FOUND"
    }
  }]
}
```

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to modify this record",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Invalid Input
```json
{
  "errors": [{
    "message": "Variable '$input' got invalid value; Expected non-nullable type 'String!' not to be null.",
    "extensions": {
      "code": "GRAPHQL_VALIDATION_FAILED"
    }
  }]
}
```

## Operation Comparison

| Feature | Set Assignees | Add Assignees | Remove Assignees |
|---------|---------------|---------------|------------------|
| **Logic** | Smart replacement | Incremental addition | Selective removal |
| **Activity Tracking** | ✅ Yes | ❌ No | ❌ No |
| **Notifications** | ✅ Yes | ❌ No | ❌ No |
| **Webhooks** | ✅ Yes | ❌ No | ❌ No |
| **Automations** | ✅ Yes | ❌ No | ❌ No |
| **Permission Level** | Stricter | More permissive | Stricter |

## Business Logic

### Smart Assignment (setTodoAssignees)

When you use `setTodoAssignees`, the system:

1. **Compares Lists**: Analyzes current assignees vs new assignee list
2. **Calculates Changes**: Determines who to remove, keep, and add
3. **Removes Users**: Unassigns users not in the new list
4. **Adds Users**: Assigns users in the new list who weren't previously assigned
5. **Tracks Activity**: Creates activity log entries for each change
6. **Sends Notifications**: Notifies newly assigned users
7. **Triggers Webhooks**: Fires assignee added/removed webhooks
8. **Updates Charts**: Marks analytics charts for refresh
9. **Real-time Updates**: Publishes updates to connected clients

### Simple Operations (add/remove)

The `addTodoAssignees` and `removeTodoAssignees` operations provide basic functionality without the comprehensive tracking and notification features of `setTodoAssignees`.

## Important Notes

- **Project Membership**: Assignees should be members of the project containing the record
- **No Assignment Limits**: There's no maximum number of assignees per record
- **Self-Assignment**: Users can assign themselves if they have proper permissions
- **Empty Arrays**: Providing an empty `assigneeIds` array to `setTodoAssignees` removes all assignees
- **Duplicate Prevention**: The system automatically prevents duplicate assignments
- **Database Efficiency**: Uses junction table (`TodoUser`) for scalable many-to-many relationships
- **Real-time Updates**: All connected clients receive immediate updates when assignments change

## Get Available Assignees

To get a list of users who can be assigned to records in a project:

```graphql
query GetAssignees {
  assignees(projectId: "project_abc123") {
    id
    name
    email
    avatar
  }
}
```

This query returns all project members who can potentially be assigned to records.

## Related Operations

- [List Records](/api/records/list-records) - Get records with their current assignees
- [Update Record](/api/records/update-record) - Modify other record properties
- [Add Comment](/api/records/add-comment) - Add comments to assigned records

### /api/records/copy-record

Source: https://blue.cc/api/records/copy-record

## Copy a Record

To create a copy of an existing record while maintaining specific elements, use the `copyTodo` mutation:

```graphql
mutation CopyTodo {
  copyTodo(
    input: {
      title: "new todo"
      todoId: "todo-id"
      todoListId: "todo-list-id"
      options: [
        DESCRIPTION
        DUE_DATE
        CHECKLISTS
        ASSIGNEES
        TAGS
        CUSTOM_FIELDS
        COMMENTS
      ]
    }
  )
}
```

### Required Headers
```http
x-bloo-token-id: "your-token-id"
x-bloo-token-secret: "your-token-secret" 
x-bloo-project-id: "project-id-or-slug"
x-bloo-company-id: "company-id-or-slug"
```

### Input Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | No | New title for the copied record (optional) |
| todoId | String | Yes | ID of the record to copy |
| todoListId | String | Yes | ID of the list to create the copy in |
| options | Array | Yes | Data elements to copy from original record |

### Copy Options

The `options` array accepts these values:

| Option | Description |
|--------|-------------|
| DESCRIPTION | Copies the record's description |
| DUE_DATE | Copies the due date and timezone |
| CHECKLISTS | Copies all checklists and their items |
| ASSIGNEES | Copies all assigned users (filtered by target project membership) |
| TAGS | Copies all associated tags |
| CUSTOM_FIELDS | Copies all custom field values (including file attachments) |
| COMMENTS | Copies all comments and replies |

### Example Response
```json
{
  "data": {
    "copyTodo": true
  }
}
```

<Callout variant="tip" title="Positioning Copies">
The copied record will be placed at the bottom of the target list by default. To control positioning, use the [move record mutation](/api/records/move-record-list).
</Callout> 

<Callout variant="warning" title="Required Permissions">
You need **Edit** permissions (OWNER, ADMIN, or MEMBER role) on both the source and target projects. **Note**: MEMBER role users can only copy records within the same project. Cross-project copying requires ADMIN or OWNER permissions. Failed copies will return a `FORBIDDEN` error code.
</Callout>

### Error Handling
Common error codes for this operation:
- `TODO_NOT_FOUND`: Invalid or inaccessible todoId
- `TODO_LIST_NOT_FOUND`: Invalid or inaccessible todoListId
- `FORBIDDEN`: Insufficient permissions or cross-project restriction

See [Error Codes](/api/error-codes) for complete reference.

## Advanced Features

### Cross-Project Copying
The mutation supports copying records between different projects with these considerations:
- **OWNER/ADMIN**: Can copy records across any projects they have access to
- **MEMBER**: Restricted to copying within the same project only
- **Assignee Filtering**: When copying across projects, assignees are automatically filtered to only include users who have access to the target project

### Custom Field Handling
When using the `CUSTOM_FIELDS` option:
- All custom field values are copied to the new record
- File attachments in custom fields are properly duplicated with new storage references
- Custom field types are preserved and validated against the target project's configuration

### Automation Integration
Cross-project copies may trigger additional automation rules in both source and target projects, allowing for sophisticated workflow management across project boundaries.

### /api/records/dependencies

Source: https://blue.cc/api/records/dependencies

## Record Dependencies

The dependency mutations allow you to manage relationships between records in Blue. Dependencies define how records relate to each other — whether one record is blocking another or is blocked by another. Each pair of records can have at most one dependency relationship.

### Basic Example

Create a dependency where one record blocks another:

```graphql
mutation CreateDependency {
  createTodoDependency(
    input: {
      type: BLOCKING
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      otherTodoId: "cln9r2kxm000108l5h3bfag12"
    }
  ) {
    id
    title
  }
}
```

### Advanced Example

Create a dependency, update its type, then remove it:

```graphql
# Step 1: Create a "blocked by" dependency
mutation CreateBlockedByDependency {
  createTodoDependency(
    input: {
      type: BLOCKED_BY
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      otherTodoId: "cln9r2kxm000108l5h3bfag12"
    }
  ) {
    id
    title
    done
  }
}

# Step 2: Change the dependency type from BLOCKED_BY to BLOCKING
mutation UpdateDependencyType {
  updateTodoDependency(
    input: {
      type: BLOCKING
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      otherTodoId: "cln9r2kxm000108l5h3bfag12"
    }
  ) {
    id
    title
  }
}

# Step 3: Remove the dependency entirely
mutation RemoveDependency {
  deleteTodoDependency(
    input: {
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      otherTodoId: "cln9r2kxm000108l5h3bfag12"
    }
  )
}
```

## Input Parameters

### CreateTodoDependencyInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | TodoDependencyType! | ✅ Yes | The type of dependency relationship (BLOCKING or BLOCKED_BY) |
| `todoId` | String! | ✅ Yes | ID of the primary record |
| `otherTodoId` | String! | ✅ Yes | ID of the other record in the dependency relationship |

### UpdateTodoDependencyInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | TodoDependencyType! | ✅ Yes | The new dependency type (BLOCKING or BLOCKED_BY) |
| `todoId` | String! | ✅ Yes | ID of the primary record |
| `otherTodoId` | String! | ✅ Yes | ID of the other record in the dependency relationship |

### DeleteTodoDependencyInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the primary record |
| `otherTodoId` | String! | ✅ Yes | ID of the other record in the dependency relationship |

### TodoDependencyType Values

| Value | Description |
|-------|-------------|
| `BLOCKING` | The primary record (`todoId`) is blocking the other record (`otherTodoId`) |
| `BLOCKED_BY` | The primary record (`todoId`) is blocked by the other record (`otherTodoId`) |

## Response Fields

### createTodoDependency / updateTodoDependency

Both mutations return a Todo object for the primary record:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the record |
| `uid` | String! | Alternative unique identifier |
| `title` | String! | Record title |
| `done` | Boolean! | Completion status |
| `startedAt` | DateTime | Start date/time |
| `duedAt` | DateTime | Due date/time |
| `todoList` | TodoList | Associated todo list details |
| `users` | [User!] | Assigned users |
| `tags` | [Tag!] | Associated tags |

### deleteTodoDependency

Returns a `Boolean` indicating whether the dependency was successfully deleted.

## Required Permissions

Users must have edit access to the record's dependency field:

| Access Level | Can Manage Dependencies |
|--------------|------------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ❌ No |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

Additionally, custom roles must have the `DEPENDENCY` field permission enabled to create, update, or delete dependencies.

## Error Responses

### TodoNotFoundError
```json
{
  "errors": [{
    "message": "Todo was not found.",
    "extensions": {
      "code": "TODO_NOT_FOUND"
    }
  }]
}
```
**When**: Either `todoId` or `otherTodoId` does not exist, or the user lacks access to the record. Also returned when attempting to delete a dependency that does not exist.

### TodoDependencyAlreadyExistsError
```json
{
  "errors": [{
    "message": "Todo dependency already exists",
    "extensions": {
      "code": "TODO_DEPENDENCY_ALREADY_EXISTS"
    }
  }]
}
```
**When**: A dependency between the two records already exists. Each pair of records can only have one dependency. Use `updateTodoDependency` to change the type of an existing dependency.

## Important Notes

### Dependency Direction
- **BLOCKING**: Setting `type: BLOCKING` with `todoId: A` and `otherTodoId: B` means record A blocks record B (B cannot proceed until A is complete)
- **BLOCKED_BY**: Setting `type: BLOCKED_BY` with `todoId: A` and `otherTodoId: B` means record A is blocked by record B (A cannot proceed until B is complete)

### Business Logic
- Each pair of records can have **at most one dependency** relationship
- Updating a dependency to the same type it already has is a no-op and returns the record without creating activity log entries
- Deleting a dependency does not require specifying the type — only the two record IDs are needed
- Both records in the dependency must belong to the same workspace

### Side Effects
Managing dependencies triggers:
- Activity log entries for create, update, and delete actions
- Real-time subscription updates for both records involved in the dependency
- Webhook notifications (if configured)

### Related Endpoints
- **Create Record**: Use `createTodo` mutation to create records before adding dependencies
- **List Records**: Query `todos` to find record IDs for creating dependencies
- **Update Record**: Use `updateTodo` mutation to modify other record properties

### /api/records/index

Source: https://blue.cc/api/records/index

## Create a Record

The createTodo mutation allows you to create new records in Blue with comprehensive configuration options including custom fields, tags, assignments, and more. Records can be created in specific lists or automatically placed in the default list.

### Basic Example

Create a simple record with just a title:

```graphql
mutation CreateRecord {
  createTodo(
    input: {
      title: "New Task"
    }
  ) {
    id
    title
    position
  }
}
```

### Advanced Example

Create a record with all available options:

```graphql
mutation CreateRecordAdvanced {
  createTodo(
    input: {
      todoListId: "clm4n8qwx000008l0g4oxdqn7"
      title: "Product Launch Planning"
      placement: TOP
      description: "<p>Complete product launch preparation including marketing materials and documentation.</p>"
      startedAt: "2025-01-15T09:00:00Z"
      duedAt: "2025-02-01T17:00:00Z"
      notify: true
      assigneeIds: ["user_123", "user_456"]
      tags: [
        { id: "tag_existing_123" }
        { title: "Priority", color: "#ff4b4b" }
        { title: "Marketing" }
      ]
      customFields: [
        {
          customFieldId: "cf_budget_123"
          value: "50000 USD"
        }
        {
          customFieldId: "cf_status_456"
          value: "In Progress"
        }
      ]
      checklists: [
        {
          title: "Pre-launch Checklist"
          position: 1
        }
      ]
    }
  ) {
    id
    uid
    title
    position
    startedAt
    duedAt
    todoList {
      id
      title
    }
    users {
      id
      fullName
    }
    tags {
      id
      title
      color
    }
  }
}
```

## Input Parameters

### CreateTodoInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoListId` | String | No | ID of the todo list to add the record to. If not provided, uses the first todo list in the workspace |
| `title` | String! | ✅ Yes | Title of the record (required) |
| `position` | Float | No | Custom position in the list. If not provided, uses placement parameter |
| `placement` | CreateTodoInputPlacement | No | Where to place the record if position is not specified (TOP or BOTTOM) |
| `startedAt` | DateTime | No | Start date/time for the record |
| `duedAt` | DateTime | No | Due date/time for the record |
| `notify` | Boolean | No | Whether to send notifications for this record creation |
| `description` | String | No | HTML description content (will be sanitized) |
| `assigneeIds` | [String!] | No | Array of user IDs to assign to this record |
| `checklists` | [CreateChecklistWithoutTodoInput!] | No | Array of checklists to create with the record |
| `customFields` | [CreateTodoInputCustomField] | No | Array of custom field values |
| `tags` | [CreateTodoTagInput!] | No | Array of tags to attach to the record |

### CreateTodoInputPlacement Values

| Value | Description |
|-------|-------------|
| `TOP` | Place at the top of the list (highest position) |
| `BOTTOM` | Place at the bottom of the list (lowest position) |

### CreateTodoTagInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | No* | ID of existing tag to connect |
| `title` | String | No* | Title of tag (creates new if doesn't exist) |
| `color` | String | No | Hex color for new tag (defaults to #4a9fff) |

*Note: You must provide either `id` (for existing tag) OR `title` (to create/find by title)

### CreateTodoInputCustomField

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customFieldId` | String | No | ID of the custom field |
| `value` | String | No | Value for the custom field (see format guide below) |

### CreateChecklistWithoutTodoInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | String! | ✅ Yes | Title of the checklist |
| `position` | Float | No | Position of the checklist within the record |

## Custom Field Value Formats

When setting custom field values, use these formats based on field type:

| Field Type | Format | Example |
|------------|--------|---------|
| `CHECKBOX` | "true", "1", or "checked" for checked | `"true"` |
| `COUNTRY` | Country name or ISO code | `"United States"` or `"US"` |
| `CURRENCY` | Amount with optional currency | `"50000 USD"` |
| `DATE` | YYYY-MM-DD or date range | `"2025-01-15"` or `"2025-01-15,2025-01-20"` |
| `NUMBER` | Numeric value | `"42"` |
| `PERCENT` | Numeric value (% optional) | `"75"` or `"75%"` |
| `RATING` | Numeric value within range | `"4"` (if max is 5) |
| `PHONE` | International phone format | `"+1234567890"` |
| `SELECT_SINGLE` | Custom field option ID | `"option_123"` |
| `SELECT_MULTI` | Comma-separated option IDs | `"option_1,option_2"` |
| `LOCATION` | Latitude,longitude | `"40.7128,-74.0060"` |
| `EMAIL` | Valid email address | `"user@example.com"` |
| `URL` | Valid URL | `"https://example.com"` |
| `TEXT` | Plain text value | `"Any text content"` |

## Response Fields

The mutation returns a Todo object with comprehensive record details:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the record |
| `uid` | String! | Alternative unique identifier |
| `title` | String! | Record title |
| `position` | Float! | Position in the list |
| `done` | Boolean! | Completion status |
| `startedAt` | DateTime | Start date/time |
| `duedAt` | DateTime | Due date/time |
| `todoList` | TodoList | Associated todo list details |
| `users` | [User!] | Assigned users |
| `tags` | [Tag!] | Associated tags |
| `checklists` | [Checklist!] | Associated checklists |
| `customFields` | [CustomFieldValue!] | Custom field values |

## Required Permissions

Users must have appropriate workspace access to create records:

| Access Level | Can Create Records |
|--------------|-------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

The mutation requires the user's workspace access level to be `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT`. Users with `VIEW_ONLY` or `COMMENT_ONLY` roles cannot create records.

## Error Responses

### WorkspaceNotFoundError
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
**When**: No workspace context is available for the user.

### TodoListCreateTodoLimitError
```json
{
  "errors": [{
    "message": "Todo list has reached the maximum number of todos.",
    "extensions": {
      "code": "TODO_LIST_CREATE_TODO_LIMIT_ERROR"
    }
  }]
}
```
**When**: The todo list already contains 100,000 records (maximum limit).

### TodoListNotFoundError
```json
{
  "errors": [{
    "message": "Todo list was not found.",
    "extensions": {
      "code": "TODO_LIST_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `todoListId` doesn't exist or user lacks access.

### CustomFieldValueParseError
```json
{
  "errors": [{
    "message": "Invalid phone number format",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```
**When**: Custom field value fails validation (e.g., invalid phone, rating out of range).

## Important Notes

### Performance
- Each todo list can contain up to **100,000 records**
- Creating records triggers multiple background processes (webhooks, automations, search indexing)
- Batch operations are more efficient than creating records one at a time

### Business Logic
- **Position Handling**: Default position is 65535.0 when neither `position` nor `placement` specified
- **Date Logic**:
  - If only `duedAt` is provided, `startedAt` is set to beginning of that day
  - If only `startedAt` is provided, `duedAt` is set to the same value
- **Tag Creation**: New tags are automatically created if they don't exist with the specified title/color
- **List Selection**: If no `todoListId` provided, the first todo list in the workspace is used

### Side Effects
Creating a record triggers:
- Activity log entry creation
- Webhook notifications
- Search index updates
- Automation rule execution (if configured)
- Email/push notifications (if `notify: true`)
- Formula and time duration custom field calculations
- Analytics and chart updates

### Related Endpoints
- **List Records**: Query todos to retrieve existing records
- **Update Record**: Use updateTodo mutation to modify records
- **List Custom Fields**: Query to get available custom field IDs
- **List Tags**: Query to get existing tag IDs
- **List Todo Lists**: Query to get available todo list IDs

### /api/records/list-records

Source: https://blue.cc/api/records/list-records

## List Records

The todos query allows you to retrieve records from Blue with comprehensive filtering, sorting, and pagination options. You can query records across companies, projects, or filter by specific criteria like assignees, tags, and dates.

### Basic Example

List all records in a company with minimal parameters:

```graphql
query ListRecords {
  todoQueries {
    todos(
      filter: {
        companyIds: ["company_123"]
      }
    ) {
      items {
        id
        title
        done
        duedAt
      }
      pageInfo {
        totalItems
        hasNextPage
      }
    }
  }
}
```

### Advanced Example

Query records with comprehensive filtering, sorting, and field selection:

```graphql
query ListRecordsAdvanced {
  todoQueries {
    todos(
      filter: {
        companyIds: ["company_123"]
        projectIds: ["project_456", "project_789"]
        assigneeIds: ["user_123"]
        tagIds: ["tag_priority", "tag_urgent"]
        showCompleted: false
        dueStart: "2025-01-01T00:00:00Z"
        dueEnd: "2025-12-31T23:59:59Z"
        search: "product launch"
        excludeArchivedProjects: true
        fields: [
          {
            type: "CUSTOM_FIELD"
            customFieldId: "cf_status_123"
            customFieldType: "SELECT_SINGLE"
            values: ["In Progress", "Review"]
            op: "IN"
          }
        ]
        op: "AND"
      }
      sort: [duedAt_ASC, position_ASC]
      limit: 50
      skip: 0
    ) {
      items {
        id
        uid
        position
        title
        text
        html
        startedAt
        duedAt
        timezone
        color
        cover
        done
        archived
        createdAt
        updatedAt
        commentCount
        checklistCount
        checklistCompletedCount
        isRepeating
        todoList {
          id
          title
        }
        users {
          id
          name
          email
        }
        tags {
          id
          title
          color
        }
        customFields {
          id
          title
          type
          value
        }
        createdBy {
          id
          name
        }
      }
      pageInfo {
        totalPages
        totalItems
        page
        perPage
        hasNextPage
        hasPreviousPage
      }
    }
  }
}
```

## Input Parameters

### TodosFilter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyIds` | [String!]! | ✅ Yes | Company IDs or slugs to query from |
| `projectIds` | [String!] | No | Filter by specific project IDs or slugs |
| `todoIds` | [String!] | No | Retrieve specific todos by their IDs |
| `assigneeIds` | [String!] | No | Filter by assigned user IDs |
| `tagIds` | [String!] | No | Filter by tag IDs |
| `tagColors` | [String!] | No | Filter by tag colors (hex format) |
| `tagTitles` | [String!] | No | Filter by tag titles |
| `todoListIds` | [String!] | No | Filter by todo list IDs |
| `todoListTitles` | [String!] | No | Filter by todo list titles |
| `done` | Boolean | No | Filter by completion status (deprecated, use showCompleted) |
| `showCompleted` | Boolean | No | Show/hide completed todos (default: true) |
| `startedAt` | DateTime | No | Filter by start date |
| `duedAt` | DateTime | No | Filter by exact due date |
| `dueStart` | DateTime | No | Due date range start (inclusive) |
| `dueEnd` | DateTime | No | Due date range end (inclusive) |
| `search` | String | No | Search in title and text content |
| `q` | String | No | Alternative search parameter (same as search) |
| `excludeArchivedProjects` | Boolean | No | Exclude todos from archived projects |
| `coordinates` | JSON | No | Geo-spatial filter for map view (polygon coordinates) |
| `fields` | JSON | No | Custom field filters (see advanced filtering) |
| `op` | FilterLogicalOperator | No | Logical operator for field filters (AND/OR) |

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filter` | TodosFilter! | ✅ Yes | Filter criteria for the query |
| `sort` | [TodosSort!] | No | Sort order (default: empty array) |
| `limit` | Int | No | Number of items per page (default: 20, max: 500) |
| `skip` | Int | No | Number of items to skip for pagination (default: 0) |

### TodosSort Values

| Value | Description |
|-------|-------------|
| `assignees_ASC` | Sort by assignee names ascending |
| `assignees_DESC` | Sort by assignee names descending |
| `createdAt_ASC` | Sort by creation date ascending (oldest first) |
| `createdAt_DESC` | Sort by creation date descending (newest first) |
| `createdBy_ASC` | Sort by creator name ascending |
| `createdBy_DESC` | Sort by creator name descending |
| `duedAt_ASC` | Sort by due date ascending (earliest first) |
| `duedAt_DESC` | Sort by due date descending (latest first) |
| `position_ASC` | Sort by position ascending (default list order) |
| `position_DESC` | Sort by position descending |
| `startedAt_ASC` | Sort by start date ascending |
| `startedAt_DESC` | Sort by start date descending |
| `title_ASC` | Sort by title alphabetically ascending |
| `title_DESC` | Sort by title alphabetically descending |
| `todoListPosition_ASC` | Sort by todo list position ascending |
| `todoListPosition_DESC` | Sort by todo list position descending |
| `todoListTitle_ASC` | Sort by todo list title ascending |
| `todoListTitle_DESC` | Sort by todo list title descending |
| `todoTags_ASC` | Sort by tags ascending |
| `todoTags_DESC` | Sort by tags descending |

### FilterLogicalOperator Values

| Value | Description |
|-------|-------------|
| `AND` | All conditions must match |
| `OR` | Any condition must match |

## Custom Field Filtering

The `fields` parameter supports advanced filtering by custom fields:

```json
{
  "fields": [
    {
      "type": "CUSTOM_FIELD",
      "customFieldId": "cf_123",
      "customFieldType": "SELECT_SINGLE",
      "values": ["Option1", "Option2"],
      "op": "IN"
    }
  ]
}
```

### Custom Field Filter Structure

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | Must be "CUSTOM_FIELD" |
| `customFieldId` | String | ID of the custom field |
| `customFieldType` | String | Type of the custom field |
| `values` | [String!] | Values to filter by |
| `op` | String | Comparison operator (IN, NOT_IN, EQ, etc.) |

### Supported Custom Field Types

- Text fields: `TEXT_SINGLE`, `TEXT_MULTI`, `URL`, `EMAIL`, `PHONE`, `UNIQUE_ID`
- Numeric fields: `CURRENCY`, `NUMBER`, `FORMULA`
- Selection fields: `SELECT_SINGLE`, `SELECT_MULTI`, `CHECKBOX`, `COUNTRY`
- Reference fields: `REFERENCE`, `LOOKUP`
- Date fields: `DATE`

## Response Fields

### TodosResult

| Field | Type | Description |
|-------|------|-------------|
| `items` | [Todo!]! | Array of todo records |
| `pageInfo` | PageInfo! | Pagination metadata |

### PageInfo

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | Int | Total number of pages available |
| `totalItems` | Int | Total number of items across all pages |
| `page` | Int | Current page number (calculated from skip/limit) |
| `perPage` | Int | Number of items per page |
| `hasNextPage` | Boolean! | Whether there is a next page |
| `hasPreviousPage` | Boolean! | Whether there is a previous page |

### Todo Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier |
| `uid` | String! | User-friendly unique identifier |
| `position` | Float! | Position in the list |
| `title` | String! | Todo title |
| `text` | String! | Plain text content |
| `html` | String! | HTML formatted content |
| `startedAt` | DateTime | Start date/time |
| `duedAt` | DateTime | Due date/time |
| `timezone` | String | Timezone for dates |
| `color` | String | Visual color indicator |
| `cover` | String | Cover image URL |
| `done` | Boolean! | Completion status |
| `archived` | Boolean! | Archive status |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |
| `commentCount` | Int! | Number of comments |
| `checklistCount` | Int! | Total checklist items |
| `checklistCompletedCount` | Int! | Completed checklist items |
| `isRepeating` | Boolean! | Whether todo is recurring |
| `isRead` | Boolean | Read status for current user |
| `isSeen` | Boolean | Seen status for current user |
| `todoList` | TodoList! | Parent todo list |
| `users` | [User!]! | Assigned users |
| `tags` | [Tag!]! | Associated tags |
| `checklists` | [Checklist!]! | Associated checklists |
| `createdBy` | User | User who created the todo |
| `customFields` | [CustomField!]! | Custom field values |
| `dependOn` | [Todo!] | Blocking todos (dependencies) |
| `dependBy` | [Todo!] | Dependent todos (blocked by this) |
| `timeTracking` | TimeTracking | Time tracking data |

## Required Permissions

Users must have appropriate access to query records:

| Access Type | Requirements |
|-------------|--------------|
| **Company Access** | User must be a member of the company |
| **Project Access** | User must have access to specific projects (if filtering by project) |
| **Todo Visibility** | Depends on user's role and permissions: |
| - `VIEW_ONLY` | Can view all accessible todos |
| - `COMMENT_ONLY` | Can view all accessible todos |
| - `CLIENT` | May be restricted to assigned todos only |
| - `MEMBER` | Can view all project todos |
| - `ADMIN` | Can view all project todos |
| - `OWNER` | Can view all company todos |

**Special Restrictions:**
- Users with `showOnlyAssignedTodos` permission can only see todos assigned to them
- Hidden todo lists (based on role configuration) are automatically excluded
- Tag-based permissions may further filter results

## Error Responses

### Common Errors

The query handles errors gracefully and returns empty results for:
- Invalid company IDs
- Inaccessible projects
- Permission denied scenarios

For severe errors, GraphQL errors may be returned:

```json
{
  "errors": [{
    "message": "Query timeout exceeded",
    "extensions": {
      "code": "QUERY_TIMEOUT"
    }
  }]
}
```

## Important Notes

### Performance
- **Default limit**: 20 items per page (automatically applied if not specified)
- **Maximum limit**: 500 items per request (automatically capped)
- **Optimization**: Queries use optimized joins with STRAIGHT_JOIN for best performance
- **Indexing**: Common filter fields are indexed for fast querying
- **Custom fields**: Extensive custom field filtering support with minimal performance impact
- **Geographic queries**: Supports polygon-based coordinate filtering for map views

### Date Filtering
- Date ranges are inclusive
- Supports overlapping date ranges (todos that start or end within the range)
- Null dates are handled gracefully (todos without due dates won't match date filters)
- All dates should be in ISO 8601 format

### Search Behavior
- Search is case-insensitive
- Searches in both title and text content
- Partial word matching is supported
- Special characters are handled appropriately

### Pagination Strategy
- Use `skip` and `limit` for offset-based pagination
- Calculate current page: `page = Math.floor(skip / limit) + 1`
- For large datasets, consider using filters to reduce result size
- Always check `hasNextPage` before incrementing skip

### Related Endpoints
- **Create Record**: Use createTodo mutation to create new records
- **Update Record**: Use updateTodo mutation to modify records
- **Delete Record**: Use deleteTodo mutation to remove records
- **List Custom Fields**: Query available custom fields for filtering
- **List Projects**: Query available projects for filtering

### /api/records/move-record-list

Source: https://blue.cc/api/records/move-record-list

## Move Record to List

The `moveTodo` mutation allows you to move a record to a different list. This operation creates a complete copy of the record in the destination list and removes it from the source list. Records can be moved within the same project or across different projects (with appropriate permissions).

### Basic Example

```graphql
mutation MoveTodo {
  moveTodo(
    input: {
      todoId: "todo_123abc"
      todoListId: "list_456def"
    }
  )
}
```

### Cross-Project Move Example

```graphql
mutation MoveTodoAcrossProjects {
  moveTodo(
    input: {
      todoId: "todo_123abc"
      todoListId: "different-project-list_789xyz"
    }
  )
}
```

## Input Parameters

### MoveTodoInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to move |
| `todoListId` | String! | ✅ Yes | The ID of the destination list |

## Response

The mutation returns a `Boolean!` value:
- `true` - The record was successfully moved
- Errors are thrown on failure rather than returning `false`

## What Gets Moved

When a record is moved, the following elements are copied to the new location:

- ✅ **Assignees** - All assigned users
- ✅ **Checklists** - All checklist items and their completion status
- ✅ **Comments** - All comments and replies
- ✅ **Custom Fields** - All custom field values
- ✅ **Description** - Full record description and formatting
- ✅ **Due Date** - Original due date and time
- ✅ **Tags** - All associated tags
- ✅ **Todo Actions** - All subtasks and action items
- ✅ **Files** - All file attachments (with special handling for cross-project moves)

## Position Handling

- Records are automatically positioned at the **end** of the destination list
- You cannot specify a custom position - it's calculated automatically
- Position is set to the current maximum position + 65,535

## Required Permissions

Different permission levels have different capabilities:

| User Role | Same Project | Cross-Project | File Access |
|-----------|--------------|---------------|-------------|
| `OWNER` | ✅ Yes | ✅ Yes | All files |
| `ADMIN` | ✅ Yes | ✅ Yes | All files |
| `MEMBER` | ✅ Yes | ❌ No | Own files only |

### Permission Requirements

- You must have `OWNER`, `ADMIN`, or `MEMBER` access to the source project
- You must have access to the destination project
- `MEMBER` users cannot move records between different projects
- Both projects must be active (not archived)

## Error Responses

### Record Not Found
```json
{
  "errors": [{
    "message": "Todo was not found.",
    "extensions": {
      "code": "TODO_NOT_FOUND"
    }
  }]
}
```

### List Not Found
```json
{
  "errors": [{
    "message": "Todo list was not found.",
    "extensions": {
      "code": "TODO_LIST_NOT_FOUND"
    }
  }]
}
```

### Cross-Project Permission Denied
```json
{
  "errors": [{
    "message": "You are not authorized.",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

## File Handling

### Same Project Moves
- Files are moved directly without creating copies
- All file permissions are preserved

### Cross-Project Moves
- New copies of files are created in the destination project's storage
- Original files are deleted asynchronously after successful copy
- File permissions may be updated based on destination project settings
- `MEMBER` users can only move files they own

## Side Effects

Moving a record triggers several automatic actions:

1. **Activity Logging** - Creates an activity record showing the move
2. **Notifications** - Notifies relevant project members
3. **Webhooks** - Triggers `handleTodoMoved` webhook event
4. **Automations** - Runs automations configured for record moves
5. **Real-time Updates** - Publishes live updates to all connected clients
6. **Chart Updates** - Updates project charts and statistics

## Important Notes

- **Complete Copy**: All record data is copied - you cannot selectively move only certain elements
- **Automatic Position**: Records are always placed at the end of the destination list
- **Cross-Project Restrictions**: `MEMBER` users cannot move records between projects
- **Asynchronous Cleanup**: File cleanup happens in the background for cross-project moves
- **Preserves History**: Comments, activity, and audit trails are maintained
- **Webhook Events**: Move operations trigger both deletion and creation events for real-time sync

## Use Cases

### Reorganizing Work
Move records between lists to reorganize project structure or workflow stages.

### Cross-Project Transfers
Transfer records between projects when work needs to move to a different team or phase.

### List Consolidation
Move records when combining or restructuring project lists.

### /api/records/recurring-records

Source: https://blue.cc/api/records/recurring-records

## Recurring Records

Blue supports recurring records through the repeating todo system. You can attach a repeating schedule to any existing record, which will automatically create copies of that record at the specified interval. The `createRepeatingTodo`, `updateRepeatingTodo`, and `deleteRepeatingTodo` mutations manage recurring schedules on records.

### Basic Example

Set up a simple daily recurring schedule on an existing record:

```graphql
mutation CreateRecurringRecord {
  createRepeatingTodo(
    input: {
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      todoListId: "clx9k2pvm000108l0abc12345"
      type: DAILY
      fields: [ASSIGNEES, TAGS]
      from: "2025-03-01T09:00:00Z"
    }
  )
}
```

### Advanced Example

Create a custom recurring schedule that repeats every 2 weeks on Monday and Wednesday, ending after 10 occurrences, and copies all supported fields:

```graphql
mutation CreateRecurringRecordAdvanced {
  createRepeatingTodo(
    input: {
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      todoListId: "clx9k2pvm000108l0abc12345"
      type: CUSTOM
      fields: [ASSIGNEES, TAGS, CUSTOM_FIELDS, DESCRIPTION, CHECKLISTS, COMMENTS]
      from: "2025-03-01T09:00:00Z"
      interval: {
        count: 2
        type: WEEKS
        days: [Mon, Wed]
      }
      end: {
        type: AFTER
        after: 10
      }
    }
  )
}
```

Update an existing recurring schedule to repeat monthly by date, ending on a specific date:

```graphql
mutation UpdateRecurringRecord {
  updateRepeatingTodo(
    input: {
      todoId: "clm4n8qwx000008l0g4oxdqn7"
      todoListId: "clx9k2pvm000108l0abc12345"
      type: CUSTOM
      fields: [ASSIGNEES, TAGS, DESCRIPTION]
      from: "2025-04-01T09:00:00Z"
      interval: {
        count: 1
        type: MONTHS
        month: BY_DD
      }
      end: {
        type: ON
        on: "2025-12-31T23:59:59Z"
      }
      repeatCounts: 5
    }
  )
}
```

Delete a recurring schedule from a record:

```graphql
mutation DeleteRecurringRecord {
  deleteRepeatingTodo(id: "clm4n8qwx000008l0g4oxdqn7")
}
```

## Input Parameters

### CreateRepeatingTodoInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the existing record to set up as recurring |
| `todoListId` | String! | ✅ Yes | ID of the todo list where new copies will be created |
| `type` | RepeatingTodoRepeatType! | ✅ Yes | The repeat frequency preset (DAILY, WEEKDAYS, WEEKLY, MONTHLY, YEARLY, CUSTOM) |
| `fields` | [RepeatingTodoAllowedField]! | ✅ Yes | Which fields to copy to each new occurrence |
| `from` | DateTime! | ✅ Yes | The start date/time for the recurring schedule |
| `interval` | RepeatingTodoIntervalInput | No | Custom interval configuration (required when type is CUSTOM) |
| `end` | RepeatingTodoEndInput | No | When the recurring schedule should stop. If omitted, repeats indefinitely |

### UpdateRepeatingTodoInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record with the recurring schedule to update |
| `todoListId` | String! | ✅ Yes | ID of the todo list where new copies will be created |
| `type` | RepeatingTodoRepeatType! | ✅ Yes | The repeat frequency preset |
| `fields` | [RepeatingTodoAllowedField]! | ✅ Yes | Which fields to copy to each new occurrence |
| `from` | DateTime! | ✅ Yes | The start date/time for the recurring schedule |
| `interval` | RepeatingTodoIntervalInput | No | Custom interval configuration (required when type is CUSTOM) |
| `end` | RepeatingTodoEndInput | No | When the recurring schedule should stop |
| `repeatCounts` | Int | No | The number of times the record has already repeated |

### deleteRepeatingTodo

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | ID of the record to remove the recurring schedule from |

### RepeatingTodoRepeatType Values

| Value | Description |
|-------|-------------|
| `DAILY` | Repeats every day |
| `WEEKDAYS` | Repeats Monday through Friday |
| `WEEKLY` | Repeats every week on the same day |
| `MONTHLY` | Repeats every month on the same date |
| `YEARLY` | Repeats every year on the same date |
| `CUSTOM` | Custom interval defined by the `interval` parameter |

### RepeatingTodoAllowedField Values

| Value | Description |
|-------|-------------|
| `ASSIGNEES` | Copy assigned users to the new record |
| `TAGS` | Copy tags to the new record |
| `CUSTOM_FIELDS` | Copy custom field values to the new record |
| `DESCRIPTION` | Copy the description to the new record |
| `CHECKLISTS` | Copy checklists to the new record |
| `COMMENTS` | Copy comments to the new record |

### RepeatingTodoIntervalInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `count` | Int! | ✅ Yes | How many units between each occurrence (e.g., 2 for "every 2 weeks") |
| `type` | RepeatingTodoIntervalType! | ✅ Yes | The unit of time for the interval (DAYS, WEEKS, MONTHS, YEARS) |
| `days` | [RepeatingTodoDayType] | No | Specific days of the week for WEEKS intervals (Sun, Mon, Tue, Wed, Thu, Fri, Sat) |
| `month` | RepeatingTodoMonthType | No | How to handle monthly repetition (BY_DD or BY_DDDD) |

### RepeatingTodoIntervalType Values

| Value | Description |
|-------|-------------|
| `DAYS` | Interval measured in days |
| `WEEKS` | Interval measured in weeks |
| `MONTHS` | Interval measured in months |
| `YEARS` | Interval measured in years |

### RepeatingTodoMonthType Values

| Value | Description |
|-------|-------------|
| `BY_DD` | Repeat on the same date of the month (e.g., the 15th) |
| `BY_DDDD` | Repeat on the same weekday position (e.g., the 2nd Monday) |

### RepeatingTodoEndInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `type` | RepeatingTodoEndType! | ✅ Yes | How the recurring schedule ends (NEVER, ON, AFTER) |
| `on` | DateTime | No | End date when type is ON |
| `after` | Int | No | Number of occurrences when type is AFTER |

### RepeatingTodoEndType Values

| Value | Description |
|-------|-------------|
| `NEVER` | The schedule repeats indefinitely |
| `ON` | The schedule ends on a specific date (requires `on` parameter) |
| `AFTER` | The schedule ends after a number of occurrences (requires `after` parameter) |

## Response Fields

All three mutations return a `Boolean` indicating success or failure:

| Field | Type | Description |
|-------|------|-------------|
| `createRepeatingTodo` | Boolean | Returns `true` if the recurring schedule was successfully created |
| `updateRepeatingTodo` | Boolean | Returns `true` if the recurring schedule was updated and a new copy was created, `false` if an error occurred |
| `deleteRepeatingTodo` | Boolean | Returns `true` if the recurring schedule was successfully removed |

The source record's `repeatingTodoList` field will reflect the target todo list once a recurring schedule is active:

| Field | Type | Description |
|-------|------|-------------|
| `repeatingTodoList` | TodoList | The todo list where recurring copies are created (null if no recurring schedule is set) |

## Required Permissions

| Access Level | Can Manage Recurring Schedules |
|--------------|-------------------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ❌ No |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

The record must belong to an active (non-archived) workspace. The user must have edit-level permissions on the record.

## Error Responses

### TodoNotFoundError
```json
{
  "errors": [{
    "message": "Todo was not found.",
    "extensions": {
      "code": "TODO_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `todoId` or `id` does not exist or the user lacks access to the record.

### UnauthorizedError
```json
{
  "errors": [{
    "message": "You are not authorized.",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```
**When**: The user does not have sufficient permissions to manage recurring schedules on the record (requires OWNER, ADMIN, or MEMBER access).

## Important Notes

### How Recurring Records Work
- A recurring schedule is attached to an **existing record** -- the record serves as the template for future copies
- When a recurrence triggers, a **copy** of the template record is created in the specified todo list
- The `fields` parameter controls which data is carried over to each new copy (assignees, tags, custom fields, description, checklists, comments)
- The template record itself is not modified when copies are created

### Schedule Configuration
- **Preset types** (DAILY, WEEKDAYS, WEEKLY, MONTHLY, YEARLY) provide quick setup without needing the `interval` parameter
- **CUSTOM type** requires the `interval` parameter for fine-grained control
- Use `interval.days` to specify which days of the week (e.g., Mon, Wed, Fri) when the interval type is WEEKS
- Use `interval.month` to control whether monthly repetition tracks the date (BY_DD) or the weekday position (BY_DDDD)
- The `end` parameter is optional -- omitting it means the schedule repeats indefinitely (NEVER)

### Side Effects
When a recurring copy is created via `updateRepeatingTodo`, it triggers:
- Activity log entry with category REPEAT_TODO
- Notification delivery to assigned users
- Real-time publishing of the new record to connected clients
- Todo action history entry

### Error Handling
- If `updateRepeatingTodo` encounters an error while creating the copy, it automatically cleans up the recurring schedule to prevent stuck states and returns `false`
- Always check the return value to confirm the operation succeeded

### Related Endpoints
- **Create a Record**: Use `createTodo` to create the initial record before setting up recurrence
- **List Records**: Use `todoQueries.todos` to query records including recurring copies
- **Copy Record**: The recurring system uses the same copy mechanism as `copyTodo`

### /api/records/tags

Source: https://blue.cc/api/records/tags

## Overview

Tags are a powerful way to categorize and organize records in Blue. The tag system provides comprehensive functionality for creating, managing, and filtering tags, with support for bulk operations and advanced filtering.

## List Tags

Retrieve tags from projects with flexible filtering and sorting options.

### Basic Example

```graphql
query ListTags {
  tagList(
    filter: { 
      projectIds: ["project-123"] 
      excludeArchivedProjects: false 
    }
    first: 50
    orderBy: title_ASC
  ) {
    items {
      id
      uid
      title
      color
      project {
        id
        name
      }
      createdAt
      updatedAt
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
    totalCount
  }
}
```

### Advanced Filtering Example

```graphql
query FilterTags {
  tagList(
    filter: {
      projectIds: ["project-123", "project-456"]
      search: "urgent"
      colors: ["#ff0000", "#ffaa00"]
      excludeArchivedProjects: true
    }
    orderBy: createdAt_DESC
    first: 20
  ) {
    items {
      id
      title
      color
      todos {
        id
        title
      }
    }
    totalCount
  }
}
```

## Create Tags

Create new tags within a project.

```graphql
mutation CreateTag {
  createTag(
    input: {
      title: "High Priority"
      color: "#ff0000"
    }
  ) {
    id
    uid
    title
    color
    project {
      id
      name
    }
    createdAt
  }
}
```

## Update Tags

Modify existing tag properties.

```graphql
mutation UpdateTag {
  editTag(
    input: {
      id: "tag-123"
      title: "Critical Priority"
      color: "#cc0000"
    }
  ) {
    id
    title
    color
    updatedAt
  }
}
```

## Delete Tags

Remove tags from the system. This will also remove the tag from all associated records.

```graphql
mutation DeleteTag {
  deleteTag(id: "tag-123")
}
```

## Tag Records

Associate tags with records (todos) using existing tags or create new ones.

### Using Existing Tags

```graphql
mutation TagRecord {
  setTodoTags(
    input: {
      todoId: "todo-123"
      tagIds: ["tag-456", "tag-789"]
    }
  )
}
```

### Create Tags While Tagging

You can create new tags on-the-fly by providing tag titles:

```graphql
mutation TagRecordWithNewTags {
  setTodoTags(
    input: {
      todoId: "todo-123"
      tagIds: ["existing-tag-id"]
      tagTitles: ["New Tag", "Another New Tag"]
    }
  )
}
```

## AI Tag Suggestions

Get AI-powered tag suggestions for a record:

```graphql
mutation GetTagSuggestions {
  aiTag(
    input: {
      todoId: "todo-123"
      suggestionsCount: 5
    }
  ) {
    suggestions {
      title
      confidence
      color
    }
  }
}
```

## Input Parameters

### TagListFilter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectIds` | [String!] | No | Filter tags by project IDs or slugs |
| `excludeArchivedProjects` | Boolean | No | Exclude tags from archived projects |
| `search` | String | No | Search tag titles (case-insensitive) |
| `titles` | [String!] | No | Filter by specific tag titles |
| `colors` | [String!] | No | Filter by specific colors (hex format) |
| `tagIds` | [String!] | No | Filter by specific tag IDs |

### CreateTagInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | String | No | Tag title (auto-generated if not provided) |
| `color` | String! | ✅ Yes | Tag color in hex format (e.g., "#ff0000") |

### EditTagInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | ID of the tag to update |
| `title` | String | No | New tag title |
| `color` | String | No | New tag color in hex format |

### SetTodoTagsInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to tag |
| `tagIds` | [String!] | No | IDs of existing tags to apply |
| `tagTitles` | [String!] | No | Titles of new tags to create and apply |

### TagOrderByInput Values

| Value | Description |
|-------|-------------|
| `id_ASC` / `id_DESC` | Sort by tag ID |
| `uid_ASC` / `uid_DESC` | Sort by unique identifier |
| `title_ASC` / `title_DESC` | Sort alphabetically by title |
| `color_ASC` / `color_DESC` | Sort by color value |
| `createdAt_ASC` / `createdAt_DESC` | Sort by creation date |
| `updatedAt_ASC` / `updatedAt_DESC` | Sort by last update date |

## Response Fields

### Tag Type

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the tag |
| `uid` | String! | User-friendly unique identifier |
| `title` | String! | Tag title/name |
| `color` | String! | Tag color in hex format |
| `project` | Project! | Project this tag belongs to |
| `todos` | [Todo!]! | Records associated with this tag |
| `createdAt` | DateTime! | When the tag was created |
| `updatedAt` | DateTime! | When the tag was last updated |

### TagPagination Response

| Field | Type | Description |
|-------|------|-------------|
| `items` | [Tag!]! | Array of tag records |
| `pageInfo` | PageInfo! | Pagination information |
| `totalCount` | Int! | Total number of tags matching filters |

### PageInfo Fields

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | Int | Total number of pages |
| `totalItems` | Int | Total number of items across all pages |
| `page` | Int | Current page number |
| `perPage` | Int | Number of items per page |
| `hasNextPage` | Boolean! | Whether there's a next page |
| `hasPreviousPage` | Boolean! | Whether there's a previous page |

## Required Permissions

### Tag Management

| Action | Required Role |
|--------|--------------|
| Create tags | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` |
| Edit tags | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` |
| Delete tags | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` |
| Apply tags to records | `OWNER`, `ADMIN`, `MEMBER`, or `CLIENT` |

### Tag Visibility

Tags are visible to all users who have access to the project where the tag was created. Role-based filtering may apply for certain operations.

## Error Responses

### Tag Not Found
```json
{
  "errors": [{
    "message": "Tag not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

### Invalid Color Format
```json
{
  "errors": [{
    "message": "Color must be in hex format (e.g., #ff0000)",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

### Permission Denied
```json
{
  "errors": [{
    "message": "You do not have permission to modify tags in this project",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Record Not Found
```json
{
  "errors": [{
    "message": "Todo not found",
    "extensions": {
      "code": "NOT_FOUND"
    }
  }]
}
```

## Best Practices

1. **Use Consistent Colors**: Establish a color coding system for your team
2. **Descriptive Titles**: Use clear, descriptive tag names that team members will understand
3. **Batch Operations**: Use `setTodoTags` to apply multiple tags at once
4. **Search and Filter**: Use the search functionality to find existing tags before creating new ones
5. **Tag Management**: Regularly review and clean up unused tags
6. **Color Conventions**: Consider using standard colors for common tag types (red for urgent, green for completed, etc.)

## Advanced Features

### Tag Creation Defaults

- New tags created via `setTodoTags` with `tagTitles` default to color `#4a9fff`
- Tags without specified colors fall back to `#00a0d2`
- Tag titles are automatically trimmed of whitespace

### Automation Integration

Tags can be:
- Automatically applied by automation rules
- Used as triggers for automation workflows
- Modified through automation actions

### Real-time Updates

Tag changes are broadcast via GraphQL subscriptions, allowing real-time updates in connected clients.

## Important Notes

- Deleting a tag removes it from all associated records
- Tags are project-scoped and cannot be shared across projects
- Color values must be valid hex codes (e.g., "#ff0000", "#00aa00")
- Tag titles are case-sensitive
- Maximum 100 tags can be applied to a single record
- Tags support full-text search across titles

### /api/records/toggle-record-status

Source: https://blue.cc/api/records/toggle-record-status

## Toggle Record Status

The `updateTodoDoneStatus` mutation provides a simple way to toggle a record's completion status. If the record is incomplete, it marks it as complete. If it's complete, it marks it as incomplete.

### Example

```graphql
mutation ToggleRecordStatus {
  updateTodoDoneStatus(todoId: "todo_123") {
    id
    title
    done
    updatedAt
  }
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | The ID of the record to toggle |

## Response

Returns the updated `Todo` object with all available fields. Commonly used fields include:

- `id` - Record identifier
- `title` - Record title
- `done` - New completion status (true/false)
- `updatedAt` - Timestamp of the update
- All other [Todo fields](/api/records/list-records#todo-fields) are available

## Required Permissions

| Access Level | Can Toggle Status |
|--------------|-------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

**Note**: Custom roles with `allowMarkRecordsAsDone: false` will be blocked from using this mutation.

## Error Responses

### TodoNotFoundError
```json
{
  "errors": [{
    "message": "Todo was not found.",
    "extensions": {
      "code": "TODO_NOT_FOUND"
    }
  }]
}
```

### UnauthorizedError
```json
{
  "errors": [{
    "message": "You are not authorized.",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

## Important Notes

### Side Effects
Toggling a record's status triggers several automated actions:

- **Activity Log**: Creates entries for MARK_AS_COMPLETE or MARK_AS_INCOMPLETE
- **Webhooks**: Sends notifications to configured webhook endpoints with before/after states
- **Automations**: Triggers TODO_MARKED_AS_COMPLETE or TODO_MARKED_AS_INCOMPLETE automation rules
- **Real-time Notifications**: Sends updates to relevant users (if configured)
- **Real-time Publishing**: Publishes todo updates to connected clients
- **Time Tracking**: Updates time duration custom fields automatically
- **Search Index**: Updates the search index for improved discoverability
- **Analytics**: Updates charts and reports
- **Activity Feed**: Completed records appear in the company activity feed

### Usage Tips
- The mutation is idempotent - calling it twice returns the record to its original state
- The operation is atomic - either succeeds completely or fails with no changes
- Custom roles can restrict this action via the `allowMarkRecordsAsDone` permission

### Related Endpoints
- **List Records**: Use `todoQueries.todos` to query and filter records
- **Bulk Update**: Use `updateTodos` to modify multiple records at once

### /api/records/update-record

Source: https://blue.cc/api/records/update-record

## Update Record Details

To update a record's core properties, use the `editTodo` mutation:

```graphql
mutation UpdateRecordDetails {
  editTodo(
    input: {
      todoId: "YOUR RECORD ID"
      todoListId: "RECORD LIST ID TO MOVE THE RECORD TO"
      position: "NEW RECORD POSITION IN NUMBER"
      title: "NEW RECORD TITLE"
      html: "NEW RECORD DESCRIPTION IN HTML (MUST MATCH TEXT)"
      text: "NEW RECORD DESCRIPTION IN TEXT (MUST MATCH HTML)"
      startedAt: "NEW RECORD DUE DATE (START)"
      duedAt: "NEW RECORD DUE DATE (END)"
      color: "RECORD COLOR CODE"
    }
  ) {
    id
    title
    position
    html
    text
    color
  }
}
```

### Input Field Reference
| Field | Type | Description |
|-------|------|-------------|
| todoId | String | (Required) The ID of the record to update |
| todoListId | String | New list ID if moving the record |
| position | Float | New position in the list |
| title | String | Updated record title |
| html/text | String | Updated description (must match in both fields) |
| startedAt/duedAt | DateTime | Updated start/end dates in ISO 8601 format |
| color | String | Color code from available options |

### Color Options
```json
// Light theme colors
["#ffc2d4", "#ed8285", "#ffb55e", "#ffe885", "#ccf07d", 
 "#91e38c", "#a1f7fa", "#91cfff", "#c29ee0", "#e8bd91"]

// Dark theme colors  
["#ff8ebe", "#ff4b4b", "#ff9e4b", "#ffdc6b", "#b4e051",
 "#66d37e", "#4fd2ff", "#4a9fff", "#a17ee8", "#e89e64"]
```

## Update Custom Fields
To update custom field values, use the `setTodoCustomField` mutation with field-specific parameters:

### Text-based Fields
```graphql
mutation {
  setTodoCustomField(
    input: {
      customFieldId: "YOUR CUSTOM FIELD ID"
      todoId: "YOUR RECORD ID"
      text: "VALUE"
    }
  )
}
```
Applies to: `TEXT_SINGLE`, `TEXT_MULTI`, `URL`, `EMAIL`

### Numeric Fields  
```graphql
mutation {
  setTodoCustomField(
    input: {
      customFieldId: "YOUR CUSTOM FIELD ID"
      todoId: "YOUR RECORD ID" 
      number: "NUMERIC_VALUE"
    }
  )
}
```
Applies to: `NUMBER`, `PERCENT`, `RATING`

### Selection Fields
```graphql
mutation {
  setTodoCustomField(
    input: {
      customFieldId: "YOUR CUSTOM FIELD ID"
      todoId: "YOUR RECORD ID"
      customFieldOptionIds: ["OPTION_ID_1", "OPTION_ID_2"]
    }
  )
}
```
Applies to: `SELECT_SINGLE`, `SELECT_MULTI`

### Specialized Fields
**Phone Numbers:**
```graphql
mutation {
  setTodoCustomField(
    input: {
      customFieldId: "YOUR CUSTOM FIELD ID"
      todoId: "YOUR RECORD ID"
      text: "+33642526644"
      regionCode: "FR"
    }
  )
}
```

**Countries:**
```graphql
mutation {
  setTodoCustomField(
    input: {
      customFieldId: "YOUR CUSTOM FIELD ID"
      todoId: "YOUR RECORD ID"
      countryCodes: ["AF", "AL", "DZ"]
      text: "Afghanistan, Albania, Algeria"
    }
  )
}
```

**Location:**
```graphql
mutation {
  setTodoCustomField(
    input: {
      customFieldId: "YOUR CUSTOM FIELD ID"
      todoId: "YOUR RECORD ID"
      latitude: 42.2923323
      longitude: 12.126621199999999
      text: "Via Cassia, Querce d'Orlando, Capranica, Italy"
    }
  )
}
```

**Checkbox:**
```graphql
mutation {
  setTodoCustomField(
    input: {
      customFieldId: "YOUR CUSTOM FIELD ID"
      todoId: "YOUR RECORD ID"
      checked: true
    }
  )
}
```

## Required Permissions

Users must have appropriate project access to update records:

| Access Level | Can Update Records |
|--------------|-------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ✅ Yes |
| `CLIENT` | ✅ Yes |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

Additional custom field permissions may apply for `setTodoCustomField` based on role configuration.

## Return Values

- `editTodo` returns the complete updated `Todo` object
- `setTodoCustomField` returns `Boolean!` indicating success

### Notes
1. Custom field IDs can be found using the [list custom fields](/api/custom-fields/list-custom-fields) query
2. Phone numbers must be in E.164 format when using the API directly
3. Location fields are best managed through the Blue app interface
4. The `html` and `text` fields are automatically synchronized when `html` is provided
5. All update operations trigger activity logging and webhook notifications

## saved-views

### /api/saved-views/delete-saved-view

Source: https://blue.cc/api/saved-views/delete-saved-view

## Delete a Saved View

The `deleteSavedView` mutation permanently removes a saved view from a workspace. If the deleted view was set as the workspace default or any user's personal default, those references are automatically cleared.

### Basic Example

```graphql
mutation DeleteSavedView {
  deleteSavedView(id: "view_abc123") {
    success
  }
}
```

### With Variables

```graphql
mutation DeleteSavedView($viewId: String!) {
  deleteSavedView(id: $viewId) {
    success
  }
}
```

Variables:
```json
{
  "viewId": "view_abc123"
}
```

## Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | The unique identifier of the saved view to delete |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Indicates whether the deletion was successful |

## Required Permissions

| Scenario | Who Can Delete |
|----------|---------------|
| Personal view (own) | Creator only |
| Shared view (own) | Creator, OWNER, or ADMIN |
| Shared view (other's) | OWNER or ADMIN only |

Only the view creator can delete their own personal views. For shared views, the creator or any workspace OWNER/ADMIN can perform the deletion.

## Error Responses

### Saved View Not Found
```json
{
  "errors": [{
    "message": "Saved view was not found.",
    "extensions": {
      "code": "SAVED_VIEW_NOT_FOUND"
    }
  }]
}
```
**When**: The saved view ID does not exist, or the user does not have access to the workspace.

### Unauthorized
```json
{
  "errors": [{
    "message": "You are not authorized to perform this action.",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```
**When**: The user does not have permission to delete the view (e.g., trying to delete another user's personal view, or a non-OWNER/ADMIN trying to delete another user's shared view).

## Important Notes

- **Permanent Action**: Deleting a saved view is permanent and cannot be undone.
- **Default View Cleanup**: If the deleted view was set as the workspace default (`defaultSavedView`) or any user's personal default (`userDefaultSavedView`), those references are automatically cleared to `null` before the view is removed.
- **Real-time Updates**: Deleting a saved view triggers a real-time subscription event so other connected clients are notified immediately.
- **Cascading Behavior**: Only the saved view record itself is deleted. The underlying workspace data (records, custom fields, etc.) is not affected.

### Related Endpoints
- **Create Saved View**: Use `createSavedView` mutation to create new views
- **List Saved Views**: Query `savedViews` to retrieve all views
- **Edit Saved View**: Use `editSavedView` mutation to update views

### /api/saved-views/index

Source: https://blue.cc/api/saved-views/index

## Create a Saved View

The `createSavedView` mutation allows you to create a new saved view in a workspace. Saved views store view type and configuration (filters, sorting, column visibility, etc.) so users can quickly switch between different layouts. Views can be personal (visible only to the creator) or shared (visible to all workspace members).

### Basic Example

Create a simple personal board view:

```graphql
mutation CreateSavedView {
  createSavedView(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
      name: "My Board View"
      viewType: BOARD
      viewConfig: {}
    }
  ) {
    id
    uid
    name
    viewType
    isShared
    position
    createdAt
  }
}
```

### Advanced Example

Create a shared database view with a full configuration including filters, sorting, and column settings:

```graphql
mutation CreateSavedViewAdvanced {
  createSavedView(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
      name: "Sprint Planning"
      icon: "layout-grid"
      isShared: true
      viewType: DATABASE
      viewConfig: {
        filters: {
          op: "AND"
          fields: [
            {
              type: "CUSTOM_FIELD"
              customFieldId: "cf_status_123"
              customFieldType: "SELECT_SINGLE"
              values: ["In Progress", "To Do"]
              op: "IN"
            }
          ]
        }
        sort: [{ field: "duedAt", direction: "ASC" }]
        columns: ["title", "assignees", "duedAt", "cf_status_123", "cf_priority_456"]
        groupBy: "cf_status_123"
      }
    }
  ) {
    id
    uid
    name
    icon
    viewType
    isShared
    position
    viewConfig
    createdBy {
      id
      fullName
    }
    project {
      id
      name
    }
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### CreateSavedViewInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace to create the view in |
| `name` | String! | Yes | Display name for the saved view |
| `icon` | String | No | Icon identifier for the saved view |
| `isShared` | Boolean | No | Whether the view is shared with all workspace members (default: false) |
| `viewType` | SavedViewType! | Yes | The type of view layout |
| `viewConfig` | JSON! | Yes | Configuration object containing filters, sorting, columns, and other view settings |

### SavedViewType Values

| Value | Description |
|-------|-------------|
| `BOARD` | Kanban-style board layout |
| `DATABASE` | Table/spreadsheet layout |
| `CALENDAR` | Calendar view layout |
| `TIMELINE` | Gantt-style timeline layout |
| `MAP` | Geographic map layout |

## Response Fields

The mutation returns a `SavedView` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the saved view |
| `uid` | String! | User-friendly unique identifier |
| `name` | String! | Display name of the saved view |
| `icon` | String | Icon identifier |
| `position` | Float! | Sort position for ordering views in the sidebar |
| `isShared` | Boolean! | Whether the view is shared with all workspace members |
| `viewType` | SavedViewType! | The type of view layout (BOARD, DATABASE, CALENDAR, TIMELINE, MAP) |
| `viewConfig` | JSON! | Configuration object with filters, sorting, columns, and other settings |
| `createdBy` | User! | The user who created the view |
| `project` | Project! | The workspace this view belongs to |
| `createdAt` | DateTime! | Timestamp when the view was created |
| `updatedAt` | DateTime! | Timestamp when the view was last updated |

## Required Permissions

| Workspace Role | Can Create Personal Views | Can Create Shared Views |
|----------------|--------------------------|------------------------|
| `OWNER` | Yes | Yes |
| `ADMIN` | Yes | Yes |
| `MEMBER` | Yes | No |
| `CLIENT` | Yes | No |
| `COMMENT_ONLY` | Yes | No |
| `VIEW_ONLY` | Yes | No |

All workspace members can create personal views. Only users with `OWNER` or `ADMIN` roles can create shared views (`isShared: true`).

## Error Responses

### Workspace Not Found
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
**When**: The specified `projectId` does not exist, or the user is not a member of the workspace.

### Unauthorized (Shared View)
```json
{
  "errors": [{
    "message": "You are not authorized to perform this action.",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```
**When**: A non-OWNER/ADMIN user attempts to create a shared view (`isShared: true`).

## Important Notes

- **Position**: New views are automatically assigned the next available position value (incremented by 65535 from the last view). Use `updateSavedViewPosition` to reorder views after creation.
- **Personal vs. Shared**: Personal views are only visible to the creator. Shared views are visible to all workspace members. Only OWNER and ADMIN roles can create shared views.
- **View Config**: The `viewConfig` field accepts any valid JSON object. The structure depends on your application's view rendering needs (filters, sorting, column visibility, grouping, etc.).
- **Real-time Updates**: Creating a saved view triggers a real-time subscription event (`subscribeToSavedView`) so other connected clients are notified immediately.

### Related Endpoints
- **List Saved Views**: Query `savedViews` to retrieve all views in a workspace
- **Edit Saved View**: Use `editSavedView` mutation to update view name, config, or sharing
- **Delete Saved View**: Use `deleteSavedView` mutation to remove a view
- **Set Workspace Default View**: Use `setWorkspaceDefaultView` to set a shared view as the workspace default
- **Set User Default View**: Use `setUserDefaultView` to set a personal default view

### /api/saved-views/list-saved-views

Source: https://blue.cc/api/saved-views/list-saved-views

## List Saved Views

The `savedViews` query retrieves all saved views that the current user can access in a workspace. This includes the user's own personal views and all shared views created by any workspace member. Results are ordered by position descending.

### Basic Example

List all saved views in a workspace:

```graphql
query ListSavedViews {
  savedViews(
    filter: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  ) {
    items {
      id
      name
      viewType
      isShared
      position
    }
    pageInfo {
      totalItems
      hasNextPage
    }
  }
}
```

### Advanced Example

Retrieve saved views with full details, pagination, and nested relationships:

```graphql
query ListSavedViewsAdvanced {
  savedViews(
    filter: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
    skip: 0
    take: 50
  ) {
    items {
      id
      uid
      name
      icon
      viewType
      isShared
      position
      viewConfig
      createdBy {
        id
        fullName
      }
      project {
        id
        name
      }
      createdAt
      updatedAt
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Get a Single Saved View

To retrieve a specific saved view by ID, use the `savedView` query:

```graphql
query GetSavedView {
  savedView(id: "view_abc123") {
    id
    uid
    name
    icon
    viewType
    isShared
    position
    viewConfig
    createdBy {
      id
      fullName
    }
    createdAt
    updatedAt
  }
}
```

## Input Parameters

### SavedViewFilterInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace to list views from |

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Int | 0 | Number of records to skip |
| `take` | Int | 100 | Number of records to return |

### Single View Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | Unique identifier of the saved view to retrieve |

## Response Fields

### SavedViewPagination

| Field | Type | Description |
|-------|------|-------------|
| `items` | [SavedView!]! | Array of saved view objects |
| `pageInfo` | PageInfo! | Pagination metadata |

### SavedView

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the saved view |
| `uid` | String! | User-friendly unique identifier |
| `name` | String! | Display name of the saved view |
| `icon` | String | Icon identifier |
| `position` | Float! | Sort position for ordering views |
| `isShared` | Boolean! | Whether the view is visible to all workspace members |
| `viewType` | SavedViewType! | View layout type (BOARD, DATABASE, CALENDAR, TIMELINE, MAP) |
| `viewConfig` | JSON! | Configuration object with filters, sorting, columns, and other settings |
| `createdBy` | User! | The user who created the view |
| `project` | Project! | The workspace this view belongs to |
| `createdAt` | DateTime! | Timestamp when the view was created |
| `updatedAt` | DateTime! | Timestamp when the view was last updated |

### PageInfo

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | Int | Total number of pages available |
| `totalItems` | Int | Total count of views matching the filter |
| `page` | Int | Current page number |
| `perPage` | Int | Number of items per page |
| `hasNextPage` | Boolean! | Whether there is a next page |
| `hasPreviousPage` | Boolean! | Whether there is a previous page |

## Required Permissions

| Workspace Role | Can List Views |
|----------------|---------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | Yes |
| `CLIENT` | Yes |
| `COMMENT_ONLY` | Yes |
| `VIEW_ONLY` | Yes |

Any workspace member can query saved views. Users will see their own personal views plus all shared views in the workspace.

## Error Responses

### Saved View Not Found (Single View Query)
```json
{
  "errors": [{
    "message": "Saved view was not found.",
    "extensions": {
      "code": "SAVED_VIEW_NOT_FOUND"
    }
  }]
}
```
**When**: The specified view ID does not exist, the user is not a member of the workspace, or the view is a personal view owned by another user.

## Important Notes

- **Visibility Rules**: Users see their own personal views and all shared views. Personal views created by other users are never returned.
- **Ordering**: Results are returned ordered by `position` descending by default.
- **Default Pagination**: If `take` is not specified, up to 100 views are returned per request.
- **Workspace Default View**: To check which view is the workspace default, query the `defaultSavedView` field on the Project type. To check the current user's personal default, query the `userDefaultSavedView` field.

### Related Endpoints
- **Create Saved View**: Use `createSavedView` mutation to create new views
- **Edit Saved View**: Use `editSavedView` mutation to update views
- **Delete Saved View**: Use `deleteSavedView` mutation to remove views

### /api/saved-views/update-saved-view

Source: https://blue.cc/api/saved-views/update-saved-view

## Update a Saved View

The `editSavedView` mutation allows you to update the name, icon, sharing status, or configuration of an existing saved view.

### Basic Example

Rename a saved view:

```graphql
mutation EditSavedView {
  editSavedView(
    input: {
      id: "view_abc123"
      name: "Updated View Name"
    }
  ) {
    id
    name
    updatedAt
  }
}
```

### Advanced Example

Update the view configuration, icon, and sharing status:

```graphql
mutation EditSavedViewAdvanced {
  editSavedView(
    input: {
      id: "view_abc123"
      name: "Sprint Board - Q1"
      icon: "kanban"
      isShared: true
      viewConfig: {
        filters: {
          op: "AND"
          fields: [
            {
              type: "CUSTOM_FIELD"
              customFieldId: "cf_sprint_789"
              customFieldType: "SELECT_SINGLE"
              values: ["Sprint 12"]
              op: "IN"
            }
          ]
        }
        sort: [{ field: "position", direction: "ASC" }]
        columns: ["title", "assignees", "duedAt", "cf_sprint_789", "cf_points_101"]
        groupBy: "cf_status_123"
      }
    }
  ) {
    id
    uid
    name
    icon
    viewType
    isShared
    viewConfig
    createdBy {
      id
      fullName
    }
    updatedAt
  }
}
```

## Update View Position

Use the `updateSavedViewPosition` mutation to reorder a saved view in the sidebar:

```graphql
mutation UpdateSavedViewPosition {
  updateSavedViewPosition(
    id: "view_abc123"
    position: 131070.0
  ) {
    id
    name
    position
  }
}
```

## Set Workspace Default View

Use `setWorkspaceDefaultView` to set a shared view as the default for all workspace members. Only OWNER and ADMIN roles can perform this action. The selected view must be a shared view.

```graphql
mutation SetWorkspaceDefaultView {
  setWorkspaceDefaultView(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    viewId: "view_abc123"
  ) {
    id
    name
    defaultSavedView {
      id
      name
      viewType
    }
  }
}
```

To clear the workspace default view, omit the `viewId` parameter or pass `null`:

```graphql
mutation ClearWorkspaceDefaultView {
  setWorkspaceDefaultView(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    viewId: null
  ) {
    id
    name
    defaultSavedView {
      id
    }
  }
}
```

## Set User Default View

Use `setUserDefaultView` to set a personal default view for the current user in a workspace. Any workspace member can set their own default. The view can be personal or shared.

```graphql
mutation SetUserDefaultView {
  setUserDefaultView(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    viewId: "view_abc123"
  )
}
```

To clear the user default view, pass `null` for `viewId`:

```graphql
mutation ClearUserDefaultView {
  setUserDefaultView(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    viewId: null
  )
}
```

## Input Parameters

### EditSavedViewInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | ID of the saved view to update |
| `name` | String | No | Updated display name |
| `icon` | String | No | Updated icon identifier |
| `isShared` | Boolean | No | Updated sharing status |
| `viewConfig` | JSON | No | Updated view configuration (replaces entire config) |

### updateSavedViewPosition Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | Yes | ID of the saved view to reorder |
| `position` | Float! | Yes | New position value for ordering |

### setWorkspaceDefaultView Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace |
| `viewId` | String | No | ID of the shared view to set as default, or null to clear |

### setUserDefaultView Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace |
| `viewId` | String | No | ID of the view to set as personal default, or null to clear |

## Response Fields

### editSavedView / updateSavedViewPosition

Returns a `SavedView` object:

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the saved view |
| `uid` | String! | User-friendly unique identifier |
| `name` | String! | Display name of the saved view |
| `icon` | String | Icon identifier |
| `position` | Float! | Sort position for ordering views |
| `isShared` | Boolean! | Whether the view is shared with all workspace members |
| `viewType` | SavedViewType! | View layout type (BOARD, DATABASE, CALENDAR, TIMELINE, MAP) |
| `viewConfig` | JSON! | Configuration object |
| `createdBy` | User! | The user who created the view |
| `project` | Project! | The workspace this view belongs to |
| `createdAt` | DateTime! | Timestamp when the view was created |
| `updatedAt` | DateTime! | Timestamp when the view was last updated |

### setWorkspaceDefaultView

Returns a `Project` object with the updated `defaultSavedView` field.

### setUserDefaultView

Returns `Boolean!` indicating success.

## Required Permissions

### editSavedView / updateSavedViewPosition

| Scenario | Who Can Edit |
|----------|-------------|
| Personal view (own) | Creator only |
| Shared view (own) | Creator, OWNER, or ADMIN |
| Shared view (other's) | OWNER or ADMIN only |
| Changing `isShared` to `true` | OWNER or ADMIN only |
| Changing `isShared` to `false` | Creator, OWNER, or ADMIN |

### setWorkspaceDefaultView

| Workspace Role | Can Set Workspace Default |
|----------------|--------------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | No |
| `CLIENT` | No |
| `COMMENT_ONLY` | No |
| `VIEW_ONLY` | No |

### setUserDefaultView

Any workspace member can set their own personal default view.

## Error Responses

### Saved View Not Found
```json
{
  "errors": [{
    "message": "Saved view was not found.",
    "extensions": {
      "code": "SAVED_VIEW_NOT_FOUND"
    }
  }]
}
```
**When**: The saved view ID does not exist, or the user does not have access to the workspace.

### Unauthorized
```json
{
  "errors": [{
    "message": "You are not authorized to perform this action.",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```
**When**: The user does not have permission to modify the view (e.g., editing another user's personal view, or a non-OWNER/ADMIN trying to change sharing status).

### Workspace Not Found (Default View)
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
**When**: The workspace does not exist or the user does not have the required role for `setWorkspaceDefaultView`.

## Important Notes

- **Partial Updates**: Only fields included in the `editSavedView` input are updated. Omitted fields remain unchanged.
- **View Config Replacement**: When updating `viewConfig`, the entire configuration object is replaced, not merged. Always send the complete config.
- **Sharing Permissions**: Converting a personal view to shared requires OWNER or ADMIN role. Converting a shared view back to personal can be done by the creator or by an OWNER/ADMIN.
- **Workspace Default Constraints**: Only shared views can be set as the workspace default. Personal views cannot be used as workspace defaults.
- **Position Values**: Position values use a spacing of 65535 for fractional ordering. To place a view between two others, use a value between their positions.
- **Real-time Updates**: Editing a saved view triggers a real-time subscription event so other connected clients are notified immediately.

### Related Endpoints
- **Create Saved View**: Use `createSavedView` mutation to create new views
- **List Saved Views**: Query `savedViews` to retrieve all views
- **Delete Saved View**: Use `deleteSavedView` mutation to remove views

## start-guide

### /api/start-guide/GraphQL-playground

Source: https://blue.cc/api/start-guide/GraphQL-playground

## GraphQL Playground

You can use the GraphQL Playground to test the API. It is available at https://api.blue.cc/graphql.


![API 1](/docs/API_1.png "API 1")

## Video Overview

We have also made a video tutorial that explains how you can leverage the GraphQL Playground to test the API.

<youtube url="https://www.youtube.com/watch?v=GKSAHnoFn4s" />

### /api/start-guide/authentication

Source: https://blue.cc/api/start-guide/authentication

## Headers

Before executing any queries, it's essential to set up the headers for your API request. These headers remain consistent across all requests, requiring only a one-time setup. They serve to authenticate each request to the API. 

The required headers are the Token-ID and Secret-ID, represented as `x-bloo-token-id` and `x-bloo-token-secret` respectively. 

Additionally, certain requests may necessitate the inclusion of a Company-ID `x-bloo-company-id` and Project-ID `x-bloo-project-id` for more specific operations.

You can learn how to create a token and secret in the following video:


<youtube url="https://www.youtube.com/watch?v=C-q_AqdFUzE" />

## Token ID
The Token ID is your unique identifier for API access.

To start using our API, click on your profile on the top right, and under the profile menu, you'll find the API tab.

![API 2](/docs/API_2.png "API 2")

In the API tab, click on the button "Generate a Token":

![API 3](/docs/API_3.png "API 3")

Provide a name for the token and set an expiration date if desired. If you set an expiration date, the API token will automatically stop working after that date.

![API 4](/docs/API_4.png "API 4")

After generation, you'll be shown a Token ID and a Secret ID. The Token ID will be prefixed with `pat_` for easy identification.

## Secret ID

The Secret ID acts as a password, ensuring secure communication with Blue's API. 

Remember, the Secret ID is shown only once for security reasons, so store it safely to maintain access to your data through the API. For maximum security, Blue stores your secret using bcrypt hashing, which means even our team cannot retrieve your plain text secret after creation.

![API 5](/docs/API_5.png "API 5")

<Callout variant="warning" title="Security Warning">
Ensure you keep your Token ID and Secret ID secure, as anyone with access to these credentials can access your data in Blue.
</Callout>

## Company & Project IDs

Here is a video that shows how to find your company ID and project ID in Blue:

<youtube url="https://www.youtube.com/watch?v=zLEvs6zqGTc" />

Companies are the top-level entity in Blue. Company IDs are used to identify a company in Blue. They are used in the API to specify which company to interact with. The ID is the same as the company slug in the url when you visit the company in Blue:

```
app.blue.cc/company/{company-id}/
```


For certain queries and mutations, you will need to provide a Project ID. This is the ID of the project you want to interact with. The ID is the same as the project slug in the url when you visit the project in Blue:

```
app.blue.cc/company/{company-id}/project/{project-id}/
```

### /api/start-guide/capabilities

Source: https://blue.cc/api/start-guide/capabilities

The Blue API is a powerful tool that allows you to interact with Blue's data and functionality programmatically. Here are some of the capabilities you can achieve with the Blue API:

The Blue API offers a range of powerful capabilities that enable you to interact with Blue's data and functionality programmatically. 

Let's explore these capabilities in more detail.

## Read Data

The API allows you to fetch specific data in a single query using a flexible and precise schema. This means you can request exactly the information you need, from simple data points to complex nested structures, all in one efficient query. This capability is particularly useful when you need to retrieve data from multiple related entities without making multiple API calls.

## Write Data

With the Blue API, you can modify data on the server using mutations. These mutations allow you to create new records, update existing ones, or delete data as needed. This gives you full control over the data in your Blue instance, enabling you to automate processes or integrate Blue with other systems in your workflow.

For bulk operations, the API provides specific mutations like `createCustomFieldOptions`, `deleteFiles`, and `uploadFiles`. While general bulk create/update operations for all entities are not available, you can efficiently process multiple operations by sending multiple mutations in a single GraphQL request.

## Real-Time Update 

One of the most powerful features of the Blue API is its support for subscriptions. This allows clients to listen to data changes in real-time without the need for constant polling. You can set up subscriptions to be notified immediately when certain data changes, enabling you to build responsive applications that always display the most up-to-date information.

## Efficient Data Fetching

The API is designed to reduce over-fetching of data. Unlike traditional REST APIs where you might receive more data than you need, with the Blue API, you can specify exactly which fields you want to retrieve. This not only reduces the amount of data transferred over the network but also improves the performance of your applications by minimizing the processing of unnecessary data.

The API includes query depth limiting (maximum 10 levels) to prevent performance issues and potential abuse from excessively nested queries. This ensures optimal performance while still allowing complex data retrieval.

## Schema Introspection

The Blue API provides the ability to discover and explore its capabilities dynamically. This means you can query the API itself to understand what queries, mutations, and types are available. This feature is incredibly useful for developers, as it allows for easy exploration of the API's capabilities and helps in building robust, future-proof integrations.

### /api/start-guide/error-codes

Source: https://blue.cc/api/start-guide/error-codes

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

### /api/start-guide/introduction

Source: https://blue.cc/api/start-guide/introduction

The Blue API provides complete access to Blue's process management platform through a modern [GraphQL](https://graphql.org/) interface. Trusted by **17,000+ customers** processing **billions of API requests annually**, our API powers mission-critical workflows with **[99.99% uptime](/platform/status)**.

## Why Blue API?

- **100% Feature Coverage** - Everything you can do in Blue's UI, you can do via API
- **Enterprise-Ready** - Battle-tested at scale with comprehensive rate limiting and security
- **Developer-Friendly** - GraphQL provides exactly the data you need, nothing more
- **Real-Time Updates** - WebSocket subscriptions for instant data synchronization

## Quick Start

Ready to make your first API call? Here's how simple it is:

```graphql
query MyProjects {
  projectList(filter: { companyIds: ["your-company-id"] }) {
    items {
      id
      name
      updatedAt
    }
  }
}
```

**[Try it in our GraphQL Playground →](https://api.blue.cc/graphql)**

## What You'll Learn

1. **[Authentication](/api/start-guide/authentication)** - Set up secure API access with tokens
2. **[Making Requests](/api/start-guide/making-requests)** - Execute queries, mutations, and subscriptions
3. **[Rate Limits](/api/start-guide/rate-limits)** - Understand usage limits and best practices
4. **[File Uploads](/api/start-guide/upload-files)** - Handle documents and media

## Popular Use Cases

### Data Management
- Use Blue as a flexible database for custom applications
- Sync data between Blue and your existing systems
- Build custom dashboards and reporting tools

### Workflow Automation
- Create records from external triggers (forms, webhooks, emails)
- Update multiple projects based on business logic
- Automate task assignments and notifications

### Integration Development
- Connect Blue with external CRMs, ERPs, and specialized tools
- Build custom integrations for your industry
- Extend Blue's capabilities with your own features

## Get Help

Our engineering team is here to help you succeed. Contact **support@blue.cc** for:
- Custom query assistance
- Best practices for your use case
- Adding your examples to our documentation

We look forward to seeing what you build with the Blue API!

Team Blue

### /api/start-guide/making-requests

Source: https://blue.cc/api/start-guide/making-requests

## Reading Data
You can copy and paste the following code curl command into your terminal to get started: .



```bash
curl -X POST https://api.blue.cc/graphql \
  -H "Content-Type: application/json" \
  -H "X-Bloo-Token-ID: your-token-id" \
  -H "X-Bloo-Token-Secret: your-token-secret" \
  -H "X-Bloo-Company-ID: your-company-id" \
  -d '{
    "query": "query ProjectListQuery { projectList(filter: { companyIds: [\"your-company-id\"] }) { items {name} } }"
  }'
```
Or try our Python or Node examples.

### Python
```python
import requests

url = "https://api.blue.cc/graphql"

headers = {
    "Content-Type": "application/json",
    "X-Bloo-Token-ID": "your-token-id",
    "X-Bloo-Token-Secret": "your-token-secret",
    "X-Bloo-Company-ID": "your-company-id"
}

data = {
    "query": """query ProjectListQuery { projectList(filter: { companyIds: ["your-company-id"] }) { items {name} } }"""
}

response = requests.post(url, json=data, headers=headers)

print(response.json())  # To see the response
```
### NodeJS
```javascript
const axios = require('axios');

const url = 'https://api.blue.cc/graphql';

const headers = {
  'Content-Type': 'application/json',
  'X-Bloo-Token-ID': 'your-token-id',
  'X-Bloo-Token-Secret': 'your-token-secret',
  'X-Bloo-Company-ID': 'your-company-id'
};

const data = {
  query: `query ProjectListQuery { projectList(filter: { companyIds: ["your-company-id"] }) { items {name} } }`
};

axios.post(url, data, { headers })
  .then(response => {
    console.log(response.data); // To see the response
  })
  .catch(error => {
    console.error('Error:', error);
  });

```


Now that you have made your first request, let's analyze the response. This code will return the names of the projects that you have access to in your company. The Blue API returns back data in standard JSON format that can easily be parsed by any programming language.

```json
{
  "data": {
    "projectList": {
      "items": [
        {"name": "Website Redesign"},
        {"name": "Customer Relationship Management (CRM)"},
        {"name": "Marketing Campaigns"},
        {"name": "Product Roadmap"},
        {"name": "Social Media Strategy"},
        {"name": "Client Onboarding"},
        {"name": "Sales Pipeline Management"},
        {"name": "Employee Training Program"},
        {"name": "Financial Planning and Budgeting"},
        {"name": "Content Creation and Blogging"},
        {"name": "SEO Improvements"},
        {"name": "Customer Feedback and Support"},
        {"name": "Product Feature Development"},
        {"name": "Internal Communication Tools"},
        {"name": "Inventory Management"},
        {"name": "Event Planning and Coordination"},
        {"name": "Business Growth Strategies"},
        {"name": "New Product Launch"},
        {"name": "Legal and Compliance"},
        {"name": "Performance Tracking and Reporting"}
      ]
    }
  }
}
```

You can add more fields to the query to get more information about the projects, such as id and the last time it was updated. 

If we update the query like this:

```graphql
{ items {name, id, updatedAt} } 
```

You will receive a JSON response with the requested data in this format:

```json
{
  "data": {
    "projectList": {
      "items": [
        {"id": "proj1", "name": "Website Redesign", "updatedAt": "2024-08-01T12:34:56.789Z"},
        {"id": "proj2", "name": "Customer Relationship Management (CRM)", "updatedAt": "2024-07-15T09:21:34.567Z"},
        {"id": "proj3", "name": "Marketing Campaigns", "updatedAt": "2024-06-10T14:45:23.456Z"},
        {"id": "proj4", "name": "Product Roadmap", "updatedAt": "2024-09-05T08:15:45.678Z"},
        {"id": "proj5", "name": "Social Media Strategy", "updatedAt": "2024-03-20T10:11:12.345Z"},
        {"id": "proj6", "name": "Client Onboarding", "updatedAt": "2024-02-28T16:33:22.456Z"},
        {"id": "proj7", "name": "Sales Pipeline Management", "updatedAt": "2024-04-12T19:40:11.567Z"},
        {"id": "proj8", "name": "Employee Training Program", "updatedAt": "2024-05-23T22:59:30.123Z"},
        {"id": "proj9", "name": "Financial Planning and Budgeting", "updatedAt": "2024-01-17T07:08:09.678Z"},
        {"id": "proj10", "name": "Content Creation and Blogging", "updatedAt": "2024-02-14T15:42:37.456Z"},
        {"id": "proj11", "name": "SEO Improvements", "updatedAt": "2024-03-01T12:00:00.123Z"},
        {"id": "proj12", "name": "Customer Feedback and Support", "updatedAt": "2024-04-18T14:30:45.789Z"},
        {"id": "proj13", "name": "Product Feature Development", "updatedAt": "2024-05-05T17:20:31.987Z"},
        {"id": "proj14", "name": "Internal Communication Tools", "updatedAt": "2024-06-25T09:55:44.210Z"},
        {"id": "proj15", "name": "Inventory Management", "updatedAt": "2024-07-11T03:23:54.321Z"},
        {"id": "proj16", "name": "Event Planning and Coordination", "updatedAt": "2024-08-19T13:37:22.876Z"},
        {"id": "proj17", "name": "Business Growth Strategies", "updatedAt": "2024-09-07T11:45:33.654Z"},
        {"id": "proj18", "name": "New Product Launch", "updatedAt": "2024-09-10T08:20:14.987Z"},
        {"id": "proj19", "name": "Legal and Compliance", "updatedAt": "2024-03-13T10:05:27.456Z"},
        {"id": "proj20", "name": "Performance Tracking and Reporting", "updatedAt": "2024-06-01T14:23:45.678Z"}
      ]
    }
  }
}
```

## Writing Data

This is an example of how to create a new record in Blue using the Blue API.


```bash
curl -X POST https://api.blue.cc/graphql \
  -H "Content-Type: application/json" \
  -H "X-Bloo-Token-ID: YOUR_TOKEN_ID" \
  -H "X-Bloo-Token-Secret: YOUR_TOKEN_SECRET" \
  -H "X-Bloo-Company-ID: YOUR_COMPANY_ID" \
  --data-raw '{
    "query": "mutation CreateRecord { createTodo(input: { todoListId: \"TODOLISTID\", title: \"Test\", position: 65535 }) { id title position } }"
  }'
```

### Python

```python
import requests

url = "https://api.blue.cc/graphql"

headers = {
    "Content-Type": "application/json",
    "X-Bloo-Token-ID": "YOUR_TOKEN_ID",
    "X-Bloo-Token-Secret": "YOUR_TOKEN_SECRET",
    "X-Bloo-Company-ID": "YOUR_COMPANY_ID"
}

data = {
    "query": """mutation CreateRecord { createTodo(input: { todoListId: "TODOLISTID", title: "Test", position: 65535 }) { id title position } }"""
}

response = requests.post(url, json=data, headers=headers)

print(response.json())  # To see the response
```

### NodeJS

```javascript
const axios = require('axios');

const url = 'https://api.blue.cc/graphql';

const headers = {
  'Content-Type': 'application/json',
  'X-Bloo-Token-ID': 'YOUR_TOKEN_ID',
  'X-Bloo-Token-Secret': 'YOUR_TOKEN_SECRET',
  'X-Bloo-Company-ID': 'YOUR_COMPANY_ID'
};

const data = {
  query: `mutation CreateRecord { createTodo(input: { todoListId: "TODOLISTID", title: "Test", position: 65535 }) { id title position } }`
};

axios.post(url, data, { headers })
  .then(response => {
    console.log(response.data); // To see the response
  })
  .catch(error => {
    console.error('Error:', error);
  });
```


And here is an example of how to delete a record in Blue using the Blue API.

#

```bash
curl -X POST https://api.blue.cc/graphql \
  -H "Content-Type: application/json" \
  -H "X-Bloo-Token-ID: YOUR_TOKEN_ID" \
  -H "X-Bloo-Token-Secret: YOUR_TOKEN_SECRET" \
  -H "X-Bloo-Company-ID: YOUR_COMPANY_ID" \
  --data-raw '{
    "query": "mutation DeleteARecord { deleteTodo(input: { todoId: \"ENTER_RECORD_ID\" }) { success } }"
  }'
```

### Python

```python
import requests

url = "https://api.blue.cc/graphql"

headers = {
    "Content-Type": "application/json",
    "X-Bloo-Token-ID": "YOUR_TOKEN_ID",
    "X-Bloo-Token-Secret": "YOUR_TOKEN_SECRET",
    "X-Bloo-Company-ID": "YOUR_COMPANY_ID"
}

data = {
    "query": """mutation DeleteARecord { deleteTodo(input: { todoId: "ENTER_RECORD_ID" }) { success } }"""
}

response = requests.post(url, json=data, headers=headers)

print(response.json())  # To see the response
```

### NodeJS

```javascript
const axios = require('axios');

const url = 'https://api.blue.cc/graphql';

const headers = {
  'Content-Type': 'application/json',
  'X-Bloo-Token-ID': 'YOUR_TOKEN_ID',
  'X-Bloo-Token-Secret': 'YOUR_TOKEN_SECRET',
  'X-Bloo-Company-ID': 'YOUR_COMPANY_ID'
};

const data = {
  query: `mutation DeleteARecord { deleteTodo(input: { todoId: "ENTER_RECORD_ID" }) { success } }`
};

axios.post(url, data, { headers })
  .then(response => {
    console.log(response.data); // To see the response
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## Subscriptions

With GraphQL subscriptions, you can receive real-time updates when data changes. This is useful for live activity feeds, real-time collaboration, or keeping your local data synchronized with the server.

Blue uses the `graphql-ws` protocol for WebSocket subscriptions. Here's an example using the `subscribeToActivity` subscription to receive real-time activity updates:

```javascript
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'wss://api.blue.cc/graphql',
  connectionParams: {
    Authorization: 'Bearer YOUR_ACCESS_TOKEN'
  }
});

// Subscribe to activity updates
const unsubscribe = client.subscribe(
  {
    query: `
      subscription ActivityUpdates($companyId: String!, $projectId: String) {
        subscribeToActivity(companyId: $companyId, projectId: $projectId) {
          mutation
          node {
            id
            action
            description
            createdAt
            user {
              name
              email
            }
          }
        }
      }
    `,
    variables: {
      companyId: 'your-company-id',
      projectId: null // Optional: filter by specific project
    }
  },
  {
    next: (data) => console.log('Activity update:', data),
    error: (err) => console.error('Error:', err),
    complete: () => console.log('Subscription complete')
  }
);

// Later: unsubscribe when done
// unsubscribe();
```

This subscription will receive real-time updates whenever:
- New activities are created in your company/project
- Existing activities are updated
- Activities are deleted

The `mutation` field indicates the type of change: `CREATED`, `UPDATED`, or `DELETED`.

## Error Handling

The Blue API returns errors in a standard GraphQL format. Here are common error responses you might encounter:

### Authentication Error
When your token is invalid or missing:

```json
{
  "errors": [{
    "message": "Unauthorized",
    "extensions": {
      "code": "UNAUTHENTICATED"
    }
  }]
}
```

### Not Found Error
When requesting a resource that doesn't exist:

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

### Validation Error
When input parameters are invalid:

```json
{
  "errors": [{
    "message": "Validation error",
    "extensions": {
      "code": "BAD_USER_INPUT",
      "validationErrors": {
        "title": ["Title is required"]
      }
    }
  }]
}
```

### Permission Error
When you don't have access to perform an operation:

```json
{
  "errors": [{
    "message": "You do not have permission to perform this action",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Rate Limit Error
When you exceed the API rate limits:

```json
{
  "errors": [{
    "message": "Too many requests, please slow down",
    "extensions": {
      "code": "TOO_MANY_REQUESTS"
    }
  }]
}
```

Always check for the `errors` array in the response before processing `data`. If `errors` is present, the operation failed and `data` may be null.

### /api/start-guide/rate-limits

Source: https://blue.cc/api/start-guide/rate-limits

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

### /api/start-guide/upload-files

Source: https://blue.cc/api/start-guide/upload-files

## Overview

This guide demonstrates how to upload files to Blue using two different approaches:

1. **Direct GraphQL Upload** (Recommended) - Simple one-step upload with 256MB file size limit
2. **REST API Upload** - Three-step process supporting larger files up to 4.8GB

This is a comparison of the two methods:

| Feature | GraphQL Upload | REST API Upload |
|---------|----------------|------------------|
| **Complexity** | Simple (one request) | Complex (three steps) |
| **File Size Limit** | 256MB per file | 4.8GB per file |
| **Batch Upload** | Up to 10 files | Single file only |
| **Implementation** | Direct mutation | Multi-step process |
| **Best For** | Most use cases | Large files only |

---

## GraphQL File Upload

The GraphQL upload method provides a simple, direct way to upload files with a single request.

### uploadFile

Uploads a single file to the file storage system and creates a file reference in the database.

**Input:**
- `file: Upload!` - The file to upload (using multipart/form-data)
- `projectId: String!` - Project ID or slug where the file will be stored
- `companyId: String!` - Company ID or slug where the file will be stored

**Returns:** `File!` - The created file object

**Example:**
```graphql
mutation UploadFile($input: UploadFileInput!) {
  uploadFile(input: $input) {
    id
    uid
    name
    size
    type
    extension
    shared
    createdAt
    project {
      id
      name
    }
    folder {
      id
      title
    }
  }
}
```

### uploadFiles

Uploads multiple files to the file storage system and creates file references in the database.

**Input:**
- `files: [Upload!]!` - Array of files to upload (max 10)
- `projectId: String!` - Project ID or slug where the files will be stored
- `companyId: String!` - Company ID or slug where the files will be stored

**Returns:** `[File!]!` - Array of created file objects

**Example:**
```graphql
mutation UploadFiles($input: UploadFilesInput!) {
  uploadFiles(input: $input) {
    id
    uid
    name
    size
    type
    extension
    shared
    createdAt
  }
}
```

### Client Implementation

#### Apollo Client (JavaScript)

**Single File Upload:**
```javascript
import { gql } from '@apollo/client';

const UPLOAD_FILE = gql`
  mutation UploadFile($input: UploadFileInput!) {
    uploadFile(input: $input) {
      id
      uid
      name
      size
      type
      extension
      shared
      createdAt
    }
  }
`;

// Using file input
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const { data } = await uploadFile({
  variables: {
    input: {
      file: file,
      projectId: "project_123", // or "my-project-slug"
      companyId: "company_456"  // or "my-company-slug"
    }
  }
});
```

**Multiple Files Upload:**
```javascript
const UPLOAD_FILES = gql`
  mutation UploadFiles($input: UploadFilesInput!) {
    uploadFiles(input: $input) {
      id
      uid
      name
      size
      type
      extension
      shared
      createdAt
    }
  }
`;

// Using multiple file inputs
const fileInputs = document.querySelectorAll('input[type="file"]');
const files = Array.from(fileInputs).map(input => input.files[0]).filter(Boolean);

const { data } = await uploadFiles({
  variables: {
    input: {
      files: files,
      projectId: "project_123", // or "my-project-slug"
      companyId: "company_456"  // or "my-company-slug"
    }
  }
});
```

#### Vanilla JavaScript

**Single File Upload:**
```html
<!-- HTML -->
<input type="file" id="fileInput" />
<button onclick="uploadFile()">Upload File</button>
```

```javascript
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file');
    return;
  }

  // Create GraphQL mutation
  const query = `
    mutation UploadFile($input: UploadFileInput!) {
      uploadFile(input: $input) {
        id
        name
        size
        type
        extension
        createdAt
      }
    }
  `;

  // Prepare form data
  const formData = new FormData();
  formData.append('operations', JSON.stringify({
    query: query,
    variables: {
      input: {
        file: null, // Will be replaced by file
        projectId: "your_project_id", // or "your-project-slug"
        companyId: "your_company_id"  // or "your-company-slug"
      }
    }
  }));

  formData.append('map', JSON.stringify({
    "0": ["variables.input.file"]
  }));

  formData.append('0', file);

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type - let browser set it with boundary
        'Authorization': 'Bearer your_auth_token'
      }
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Upload failed:', result.errors);
      alert('Upload failed: ' + result.errors[0].message);
    } else {
      console.log('Upload successful:', result.data.uploadFile);
      alert('File uploaded successfully!');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error during upload');
  }
}
```

**Multiple Files Upload:**
```html
<!-- HTML -->
<input type="file" id="filesInput" multiple />
<button onclick="uploadFiles()">Upload Files</button>
```

```javascript
async function uploadFiles() {
  const filesInput = document.getElementById('filesInput');
  const files = Array.from(filesInput.files);

  if (files.length === 0) {
    alert('Please select files');
    return;
  }

  if (files.length > 10) {
    alert('Maximum 10 files allowed');
    return;
  }

  const query = `
    mutation UploadFiles($input: UploadFilesInput!) {
      uploadFiles(input: $input) {
        id
        name
        size
        type
        extension
        createdAt
      }
    }
  `;

  const formData = new FormData();

  // Create file placeholders for variables
  const fileVariables = files.map((_, index) => null);

  formData.append('operations', JSON.stringify({
    query: query,
    variables: {
      input: {
        files: fileVariables,
        projectId: "your_project_id", // or "your-project-slug"
        companyId: "your_company_id"  // or "your-company-slug"
      }
    }
  }));

  // Create map for file replacements
  const map = {};
  files.forEach((_, index) => {
    map[index.toString()] = [`variables.input.files.${index}`];
  });
  formData.append('map', JSON.stringify(map));

  // Append actual files
  files.forEach((file, index) => {
    formData.append(index.toString(), file);
  });

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer your_auth_token'
      }
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Upload failed:', result.errors);
      alert('Upload failed: ' + result.errors[0].message);
    } else {
      console.log('Upload successful:', result.data.uploadFiles);
      alert(`${result.data.uploadFiles.length} files uploaded successfully!`);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error during upload');
  }
}
```

#### cURL Example

```bash
# Single file upload with cURL
curl -X POST \
  -H "Authorization: Bearer your_auth_token" \
  -F 'operations={"query":"mutation UploadFile($input: UploadFileInput!) { uploadFile(input: $input) { id name size type extension createdAt } }","variables":{"input":{"file":null,"projectId":"your_project_id","companyId":"your_company_id"}}}' \
  -F 'map={"0":["variables.input.file"]}' \
  -F '0=@/path/to/your/file.jpg' \
  https://your-api.com/graphql
```

## File URLs

After uploading a file (via either method), you can access it using the `uid` and `name` from the response. The download URL follows this pattern:

```
https://api.blue.cc/uploads/{uid}/{url_encoded_filename}
```

For example, if `uploadFile` returns `uid: "cm8qujq3b01p22lrv9xbb2q62"` and `name: "report.pdf"`:

```
https://api.blue.cc/uploads/cm8qujq3b01p22lrv9xbb2q62/report.pdf
```

This endpoint returns a redirect to a signed storage URL. No additional authentication is needed — the signed URL handles access.

### URL Variants

| Pattern | Description |
|---------|-------------|
| `/uploads/{uid}/{filename}` | Download file |
| `/uploads/{uid}/{filename}?content-disposition=inline` | Display in browser instead of downloading |
| `/uploads/{uid}/50x50/{filename}` | 50x50 thumbnail (images only) |
| `/uploads/{uid}/500x500/{filename}` | 500x500 preview (images only) |

### Building URLs from Upload Response

```javascript
const file = data.uploadFile;
const downloadUrl = `https://api.blue.cc/uploads/${file.uid}/${encodeURIComponent(file.name)}`;
```

```python
from urllib.parse import quote

file = result["data"]["uploadFile"]
download_url = f"https://api.blue.cc/uploads/{file['uid']}/{quote(file['name'])}"
```

> **Important:** The URL requires both `uid` and `filename`. The `uid` alone will not work. Always URL-encode the filename to handle spaces and special characters.

---

## Attaching Files to Comments

To make an uploaded file appear as a clickable attachment inside a comment (the same way it does when attaching files in the Blue UI), you embed the file metadata as HTML in the comment body.

There is no separate "attach file to comment" mutation. File attachments are represented as `<div>` elements in the comment's `html` field, and the API links them automatically.

### How It Works

1. Upload the file first (via `uploadFile` or the REST flow) to get `uid`, `name`, `size`, `type`, and `extension`
2. Embed the file as an attachment `<div>` in the comment HTML
3. Set `tiptap: true` in the `createComment` input — **required** for the API to parse file attachments

### Attachment HTML Format

Each file attachment is represented as:

```html
<div class="attachment" file='{"uid":"FILE_UID","name":"FILENAME","size":SIZE_IN_BYTES,"type":"MIME_TYPE","extension":"EXT"}'></div>
```

The `file` attribute is a JSON string with these fields from the upload response:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `uid` | string | File UID from upload response | `"cm8qujq3b..."` |
| `name` | string | Original filename | `"report.pdf"` |
| `size` | number | File size in bytes | `204800` |
| `type` | string | MIME type | `"application/pdf"` |
| `extension` | string | File extension (no dot) | `"pdf"` |

### Example: Upload File and Attach to Comment

```python
import json
import os
import requests
from urllib.parse import quote

# Configuration
TOKEN_ID = "YOUR_TOKEN_ID"
TOKEN_SECRET = "YOUR_TOKEN_SECRET"
COMPANY_ID = "YOUR_COMPANY_ID_OR_SLUG"
PROJECT_ID = "YOUR_PROJECT_ID_OR_SLUG"
BASE_URL = "https://api.blue.cc"

HEADERS = {
    "X-Bloo-Token-ID": TOKEN_ID,
    "X-Bloo-Token-Secret": TOKEN_SECRET,
    "X-Bloo-Company-ID": COMPANY_ID,
    "X-Bloo-Project-ID": PROJECT_ID,
}

# Step 1: Upload the file using GraphQL
def upload_file(filepath):
    filename = os.path.basename(filepath)

    query = """
    mutation UploadFile($input: UploadFileInput!) {
      uploadFile(input: $input) {
        id uid name size type extension
      }
    }
    """
    variables = {
        "input": {
            "file": None,
            "companyId": COMPANY_ID,
            "projectId": PROJECT_ID,
        }
    }

    operations = json.dumps({"query": query, "variables": variables})
    file_map = json.dumps({"0": ["variables.input.file"]})

    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/graphql",
            headers={"X-Bloo-Token-ID": TOKEN_ID, "X-Bloo-Token-Secret": TOKEN_SECRET},
            data={"operations": operations, "map": file_map},
            files={"0": (filename, f)},
        )

    resp.raise_for_status()
    result = resp.json()
    if "errors" in result:
        raise Exception(f"Upload failed: {result['errors']}")
    return result["data"]["uploadFile"]

# Step 2: Create comment with the file attachment
def create_comment_with_attachment(category_id, category, message, files):
    # Build attachment HTML from uploaded file metadata
    attachments_html = ""
    for f in files:
        file_json = json.dumps({
            "uid": f["uid"],
            "name": f["name"],
            "size": f["size"],
            "type": f["type"],
            "extension": f["extension"],
        })
        attachments_html += f'<div class="attachment" file=\'{file_json}\'></div>'

    comment_html = f"<p>{message}</p>{attachments_html}"

    query = """
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        id html text createdAt
      }
    }
    """
    variables = {
        "input": {
            "html": comment_html,
            "text": message,
            "category": category,
            "categoryId": category_id,
            "tiptap": True,
        }
    }

    headers = HEADERS.copy()
    headers["Content-Type"] = "application/json"

    resp = requests.post(
        f"{BASE_URL}/graphql",
        headers=headers,
        json={"query": query, "variables": variables},
    )

    resp.raise_for_status()
    result = resp.json()
    if "errors" in result:
        raise Exception(f"Comment failed: {result['errors']}")
    return result["data"]["createComment"]


# Main
file_data = upload_file("report.pdf")
print(f"Uploaded: uid={file_data['uid']}")
print(f"Download URL: {BASE_URL}/uploads/{file_data['uid']}/{quote(file_data['name'])}")

comment = create_comment_with_attachment(
    category_id="YOUR_TODO_ID",    # ID of the record/discussion/status update
    category="TODO",                # TODO, DISCUSSION, or STATUS_UPDATE
    message="Here is the report you requested.",
    files=[file_data],
)
print(f"Comment created: id={comment['id']}")
```

### Multiple File Attachments

Append multiple `<div>` elements after the message:

```python
files = [uploaded_file_1, uploaded_file_2, uploaded_file_3]

attachments_html = ""
for f in files:
    file_json = json.dumps({
        "uid": f["uid"], "name": f["name"], "size": f["size"],
        "type": f["type"], "extension": f["extension"],
    })
    attachments_html += f'<div class="attachment" file=\'{file_json}\'></div>'

comment_html = f"<p>See attached files.</p>{attachments_html}"
```

### Common Mistakes

| Mistake | Result |
|---------|--------|
| Missing `tiptap: true` in createComment input | Attachment divs are ignored — files won't appear in the comment |
| Wrong `type` value (e.g. `"file"` instead of `"application/pdf"`) | File may not display correctly in the UI |
| Constructing URL with `uid` alone (no filename) | 404 error — URL requires both `uid` and `filename` |
| Not URL-encoding the filename | Broken download links for files with spaces or special characters |

---

## REST API Upload

Use this method for files larger than 256MB (up to 4.8GB). This approach uses a three-step process: request upload credentials, upload to storage, then register the file in the database.

Prerequisites:

- Python 3.x installed
- `requests` library installed: `pip install requests`
- A valid X-Bloo-Token-ID and X-Bloo-Token-Secret for Blue API authentication
- The file to upload (e.g., test.jpg) in the same directory as the script

This method covers two scenarios:
1. Uploading to the "File Tab"
2. Uploading to the "Todo File Custom Field"

### Configuration

Define these constants at the top of your script:

```python
FILENAME = "test.jpg"
TOKEN_ID = "YOUR_TOKEN_ID"
TOKEN_SECRET = "YOUR_TOKEN_SECRET"
COMPANY_ID = "YOUR_COMPANY_ID_OR_SLUG"
PROJECT_ID = "YOUR_PROJECT_ID_OR_SLUG"
BASE_URL = "https://api.blue.cc"\
```

This is diagram that shows the flow of the upload process:

![Upload Process](/docs/file-rest-api.png) 

### Uploading to File Tab



```python
import requests
import json
import os

# Configuration
FILENAME = "test.jpg"
TOKEN_ID = "YOUR_TOKEN_ID"
TOKEN_SECRET = "YOUR_TOKEN_SECRET"
COMPANY_ID = "YOUR_COMPANY_ID_OR_SLUG"
PROJECT_ID = "YOUR_PROJECT_ID_OR_SLUG"
BASE_URL = "https://api.blue.cc"

# Headers for Blue API
HEADERS = {
    "X-Bloo-Token-ID": TOKEN_ID,
    "X-Bloo-Token-Secret": TOKEN_SECRET,
    "X-Bloo-Company-ID": COMPANY_ID,
    "X-Bloo-Project-ID": PROJECT_ID,
}

# Step 1: Get upload credentials
def get_upload_credentials():
    url = f"{BASE_URL}/uploads?filename={FILENAME}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch upload credentials: {response.status_code} - {response.text}")
    return response.json()

# Step 2: Upload file to S3
def upload_to_s3(credentials):
    s3_url = credentials["url"]
    fields = credentials["fields"]
    
    files = {
        "acl": (None, fields["acl"]),
        "Content-Disposition": (None, fields["Content-Disposition"]),
        "Key": (None, fields["Key"]),
        "X-Key": (None, fields["X-Key"]),
        "Content-Type": (None, fields["Content-Type"]),
        "bucket": (None, fields["bucket"]),
        "X-Amz-Algorithm": (None, fields["X-Amz-Algorithm"]),
        "X-Amz-Credential": (None, fields["X-Amz-Credential"]),
        "X-Amz-Date": (None, fields["X-Amz-Date"]),
        "Policy": (None, fields["Policy"]),
        "X-Amz-Signature": (None, fields["X-Amz-Signature"]),
        "file": (FILENAME, open(FILENAME, "rb"), fields["Content-Type"])
    }
    
    response = requests.post(s3_url, files=files)
    if response.status_code != 204:
        raise Exception(f"S3 upload failed: {response.status_code} - {response.text}")
    print("S3 upload successful")

# Step 3: Register file with Blue
def register_file(file_uid):
    graphql_url = f"{BASE_URL}/graphql"
    headers = HEADERS.copy()
    headers["Content-Type"] = "application/json"
    
    query = """
    mutation CreateFile($uid: String!, $name: String!, $type: String!, $extension: String!, $size: Float!, $projectId: String!, $companyId: String!) {
        createFile(input: {uid: $uid, name: $name, type: $type, size: $size, extension: $extension, projectId: $projectId, companyId: $companyId}) {
            id
            uid
            name
            __typename
        }
    }
    """
    
    variables = {
        "uid": file_uid,
        "name": FILENAME,
        "type": "image/jpeg",
        "extension": "jpg",
        "size": float(os.path.getsize(FILENAME)),  # Dynamic file size
        "projectId": PROJECT_ID,
        "companyId": COMPANY_ID
    }
    
    payload = {
        "operationName": "CreateFile",
        "query": query,
        "variables": variables
    }
    
    response = requests.post(graphql_url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"GraphQL registration failed: {response.status_code} - {response.text}")
    print("File registration successful:", response.json())

# Main execution
def main():
    try:
        if not os.path.exists(FILENAME):
            raise Exception(f"File '{FILENAME}' not found")
        
        # Step 1: Fetch credentials
        credentials = get_upload_credentials()
        print("Upload credentials fetched:", credentials)
        
        # Step 2: Upload to S3
        upload_to_s3(credentials)
        
        # Step 3: Register file
        file_uid = credentials["fields"]["Key"].split("/")[0]
        register_file(file_uid)
        
        print("Upload completed successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```


### Steps Explained

#### Step 1: Request Upload Credentials
- Send a GET request to `https://api.blue.cc/uploads?filename=test.jpg`
- Returns S3 credentials in JSON format

Sample Response:
```json
{
  "url": "https://s3.ap-southeast-1.amazonaws.com/bloo-uploads",
  "fields": {
    "acl": "private",
    "Content-Disposition": "attachment; filename=\"test.jpg\"",
    "Key": "cm8qujq3b01p22lrv9xbb2q62/test.jpg",
    "X-Key": "cm8qujq3b01p22lrv9xbb2q62",
    "Content-Type": "image/jpeg",
    "bucket": "bloo-uploads",
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": "AKIA2LAMM6FPGT53RMQY/20250327/ap-southeast-1/s3/aws4_request",
    "X-Amz-Date": "20250327T042138Z",
    "Policy": "...",
    "X-Amz-Signature": "e1d2446a0bdbfcbd3a73f926c7d92c87460f8d8ae030d717355f2790d6609452"
  }
}
```

#### Step 2: Upload File to S3
- Uses the `files` parameter in `requests.post` to send a multipart/form-data request to the S3 URL
- Ensures all fields match the policy exactly, avoiding curl's formatting issues

#### Step 3: Register File Metadata
- Sends a GraphQL mutation to `https://api.blue.cc/graphql`
- Dynamically calculates file size with `os.path.getsize`

Sample Response:
```json
{
  "data": {
    "createFile": {
      "id": "cm8qudguy2ouprv2ljq3widd8",
      "uid": "cm8qujq3b01p22lrv9xbb2q62",
      "name": "test.jpg",
      "__typename": "File"
    }
  }
}
```

### Uploading to Custom Field



```python
import requests
import json
import os

# Configuration
FILENAME = "test.jpg"
TOKEN_ID = "YOUR_TOKEN_ID"
TOKEN_SECRET = "YOUR_TOKEN_SECRET"
COMPANY_ID = "YOUR_COMPANY_ID_OR_SLUG"
PROJECT_ID = "YOUR_PROJECT_ID_OR_SLUG"
BASE_URL = "https://api.blue.cc"

# Headers for Blue API
HEADERS = {
    "X-Bloo-Token-ID": TOKEN_ID,
    "X-Bloo-Token-Secret": TOKEN_SECRET,
    "X-Bloo-Company-ID": COMPANY_ID,
    "X-Bloo-Project-ID": PROJECT_ID,
}

# Step 1: Get upload credentials
def get_upload_credentials():
    url = f"{BASE_URL}/uploads?filename={FILENAME}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch upload credentials: {response.status_code} - {response.text}")
    return response.json()

# Step 2: Upload file to S3
def upload_to_s3(credentials):
    s3_url = credentials["url"]
    fields = credentials["fields"]
    
    files = {
        "acl": (None, fields["acl"]),
        "Content-Disposition": (None, fields["Content-Disposition"]),
        "Key": (None, fields["Key"]),
        "X-Key": (None, fields["X-Key"]),
        "Content-Type": (None, fields["Content-Type"]),
        "bucket": (None, fields["bucket"]),
        "X-Amz-Algorithm": (None, fields["X-Amz-Algorithm"]),
        "X-Amz-Credential": (None, fields["X-Amz-Credential"]),
        "X-Amz-Date": (None, fields["X-Amz-Date"]),
        "Policy": (None, fields["Policy"]),
        "X-Amz-Signature": (None, fields["X-Amz-Signature"]),
        "file": (FILENAME, open(FILENAME, "rb"), fields["Content-Type"])
    }
    
    response = requests.post(s3_url, files=files)
    if response.status_code != 204:
        raise Exception(f"S3 upload failed: {response.status_code} - {response.text}")
    print("S3 upload successful")

# Step 3: Register file with Blue
def register_file(file_uid):
    graphql_url = f"{BASE_URL}/graphql"
    headers = HEADERS.copy()
    headers["Content-Type"] = "application/json"
    
    query = """
    mutation CreateFile($uid: String!, $name: String!, $type: String!, $extension: String!, $size: Float!, $projectId: String!, $companyId: String!) {
        createFile(input: {uid: $uid, name: $name, type: $type, size: $size, extension: $extension, projectId: $projectId, companyId: $companyId}) {
            id
            uid
            name
            __typename
        }
    }
    """
    
    variables = {
        "uid": file_uid,
        "name": FILENAME,
        "type": "image/jpeg",
        "extension": "jpg",
        "size": float(os.path.getsize(FILENAME)),
        "projectId": PROJECT_ID,
        "companyId": COMPANY_ID
    }
    
    payload = {
        "operationName": "CreateFile",
        "query": query,
        "variables": variables
    }
    
    response = requests.post(graphql_url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"GraphQL registration failed: {response.status_code} - {response.text}")
    print("File registration successful:", response.json())
    return file_uid

# Step 4: Associate file with Todo Custom Field
def associate_file_with_todo(file_uid):
    graphql_url = f"{BASE_URL}/graphql"
    headers = HEADERS.copy()
    headers["Content-Type"] = "application/json"
    
    query = """
    mutation CreateTodoCustomFieldFile($input: CreateTodoCustomFieldFileInput!) {
        createTodoCustomFieldFile(input: $input)
    }
    """
    
    variables = {
        "input": {
            "todoId": "YOUR_TODO_ID",
            "customFieldId": "YOUR_CUSTOM_FIELD_ID",
            "fileUid": file_uid
        }
    }
    
    payload = {
        "operationName": "CreateTodoCustomFieldFile",
        "query": query,
        "variables": variables
    }
    
    response = requests.post(graphql_url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Todo association failed: {response.status_code} - {response.text}")
    print("Todo association successful:", response.json())

# Main execution
def main():
    try:
        if not os.path.exists(FILENAME):
            raise Exception(f"File '{FILENAME}' not found")
        
        # Step 1: Fetch credentials
        credentials = get_upload_credentials()
        print("Upload credentials fetched:", credentials)
        
        # Step 2: Upload to S3
        upload_to_s3(credentials)
        
        # Step 3: Register file
        file_uid = credentials["fields"]["Key"].split("/")[0]
        register_file(file_uid)
        
        # Step 4: Associate with Todo
        associate_file_with_todo(file_uid)
        
        print("Upload completed successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```



Steps 1-3 are the same as the File Tab process (fetch credentials, upload to S3, and register file metadata).

For step 4, you need to associate the file with a todo custom field.

- Sends a GraphQL mutation to link the file to a todo custom field
- Uses `todoId` and `customFieldId` specific to your setup

Sample Response:
```json
{
  "data": {
    "createTodoCustomFieldFile": true
  }
}

## user-management

### /api/user-management/index

Source: https://blue.cc/api/user-management/index

## Overview

The User Management API provides comprehensive tools for managing team members, controlling access permissions, and organizing your workforce across Blue workspaces and organizations. Whether you're adding new team members, managing existing users, or defining custom permission structures, these APIs handle all aspects of user lifecycle management.

User management in Blue operates at two levels:
- **Workspace-level**: Manage users within specific workspaces with workspace-specific permissions
- **Organization-level**: Manage users across your entire organization with organization-wide access

## Available Operations

### Core User Management

| Operation | Description | Link |
|-----------|-------------|------|
| **Invite User** | Send invitations to new users with specific access levels | [View Details →](/api/user-management/invite-user) |
| **List Users** | Query and filter users in workspaces or organizations | [View Details →](/api/user-management/list-users) |
| **Remove User** | Remove users from workspaces or organizations | [View Details →](/api/user-management/remove-user) |

### Role and Permission Management

| Operation | Description | Link |
|-----------|-------------|------|
| **Custom Roles** | Create and manage custom roles with granular permissions | [View Details →](/api/user-management/retrieve-custom-role) |

## Access Levels

Blue provides a hierarchical permission system with predefined access levels:

### Standard Access Levels

| Level | Description | Capabilities |
|-------|-------------|--------------|
| **OWNER** | Full control over workspace/organization | All permissions, can transfer ownership |
| **ADMIN** | Administrative access | User management, settings, billing |
| **MEMBER** | Standard team member | Full workspace functionality, limited admin access |
| **CLIENT** | External client access | Limited workspace visibility, focused on deliverables |
| **COMMENT_ONLY** | Comment-only access | Can view and comment, cannot edit |
| **VIEW_ONLY** | Read-only access | Can view content only |

### Permission Hierarchy

Users can only invite or manage users at their level or below:
- **OWNERS** can manage all access levels
- **ADMINS** can manage ADMIN, MEMBER, CLIENT, COMMENT_ONLY, VIEW_ONLY
- **MEMBERS** can manage MEMBER, CLIENT, COMMENT_ONLY, VIEW_ONLY
- **CLIENTS** can only manage other CLIENTS

## Key Concepts

### User Invitations
- **Email-based**: Users are invited via email address
- **Role assignment**: Set access level and optional custom role during invitation
- **Multi-workspace**: Single invitation can grant access to multiple workspaces
- **Expiration**: Invitations expire after 7 days
- **Automatic notifications**: Blue sends email invitations automatically

### Workspace vs Organization Access
- **Workspace invitation**: Grants access to specific workspace only
- **Organization invitation**: Grants organization-level access, optionally including specific workspaces
- **Organization owners**: Automatically get ADMIN access to all organization workspaces
- **Scope restrictions**: Cannot combine workspace and organization invitation parameters

### Custom Roles
- **Granular permissions**: Define specific capabilities beyond standard access levels
- **Workspace-specific**: Custom roles are scoped to individual workspaces
- **Field-level control**: Control access to specific custom fields
- **Action restrictions**: Limit specific actions (create, edit, delete, etc.)

## Common Patterns

### Inviting a New Team Member
```graphql
mutation InviteTeamMember {
  inviteUser(input: {
    email: "john.doe@company.com"
    projectId: "web-redesign"
    accessLevel: MEMBER
  })
}
```

### Creating an Organization-Wide Invitation
```graphql
mutation InviteToCompany {
  inviteUser(input: {
    email: "manager@company.com"
    companyId: "company_123"
    projectIds: ["project_1", "project_2", "project_3"]
    accessLevel: ADMIN
  })
}
```

### Listing Workspace Users
```graphql
query ProjectUsers {
  projectUsers(projectId: "web-redesign") {
    id
    user {
      name
      email
      avatar
    }
    accessLevel
    role {
      name
      permissions
    }
    invitedAt
    joinedAt
  }
}
```

### Removing a User
```graphql
mutation RemoveProjectUser {
  removeUser(input: {
    userId: "user_456"
    projectId: "web-redesign"
  })
}
```

### Creating a Custom Role
```graphql
mutation CreateCustomRole {
  createProjectUserRole(input: {
    projectId: "web-redesign"
    name: "Content Reviewer"
    permissions: {
      canCreateRecords: false
      canEditOwnRecords: true
      canEditAllRecords: false
      canDeleteRecords: false
      canManageUsers: false
      canViewReports: true
    }
  }) {
    id
    name
    permissions
  }
}
```

## Permission Management

### Standard Permissions Matrix

| Action | OWNER | ADMIN | MEMBER | CLIENT | COMMENT_ONLY | VIEW_ONLY |
|--------|-------|-------|--------|--------|-------------|-----------|
| **Invite Users** | ✅ All levels | ✅ ADMIN and below | ✅ MEMBER and below | ✅ CLIENT only | ❌ No | ❌ No |
| **Remove Users** | ✅ All users | ✅ ADMIN and below | ✅ MEMBER and below | ✅ CLIENT only | ❌ No | ❌ No |
| **Modify Workspace Settings** | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No |
| **Create Records** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Limited | ❌ No | ❌ No |
| **Edit All Records** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Delete Records** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **View Reports** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Limited | ❌ No | ❌ No |

### Custom Role Capabilities
- **Field-level permissions**: Control access to specific custom fields
- **Action-specific rules**: Allow/deny specific operations (create, edit, delete)
- **View restrictions**: Limit which records users can see
- **Feature toggles**: Enable/disable specific features per role

## Best Practices

### User Onboarding
1. **Start with standard roles** - Use predefined access levels for most users
2. **Progressive permissions** - Begin with limited access, expand as needed
3. **Clear communication** - Include context when sending invitations
4. **Regular reviews** - Audit user access periodically

### Security Considerations
1. **Principle of least privilege** - Grant minimum necessary permissions
2. **Regular access audits** - Review user permissions quarterly
3. **Offboarding process** - Remove access immediately when users leave
4. **Custom role documentation** - Document custom role purposes and limitations

### Team Organization
1. **Consistent naming** - Use clear, descriptive role names
2. **Role consolidation** - Avoid creating too many similar custom roles
3. **Organization structure** - Align permissions with organizational hierarchy
4. **Workspace inheritance** - Consider how organization roles affect workspace access

## Error Handling

Common errors when managing users:

| Error Code | Description | Solution |
|------------|-------------|----------|
| `USER_ALREADY_IN_THE_PROJECT` | User already has workspace access | Check current user list before inviting |
| `UNAUTHORIZED` | Insufficient permissions to perform action | Verify your access level and permissions |
| `PROJECT_NOT_FOUND` | Workspace doesn't exist or no access | Confirm workspace ID and access rights |
| `INVITATION_LIMIT` | Reached invitation limit for billing tier | Upgrade plan or remove inactive users |
| `ADD_SELF` | Cannot invite yourself | Use a different email or have another admin invite you |
| `COMPANY_BANNED` | Organization account is suspended | Contact support to resolve account status |

## Rate Limits

User management operations have the following rate limits:
- **Invitations**: 100 per hour per organization
- **User queries**: 1000 per hour per user
- **Role modifications**: 50 per hour per workspace

## Related Resources

- [Workspaces API](/api/workspaces) - Managing workspaces that contain users
- [Records API](/api/records) - Understanding how user permissions affect record access
- [Automations API](/api/automations) - Automating user management workflows
- [Custom Fields API](/api/custom-fields) - Managing field-level permissions for custom roles

### /api/user-management/invite-user

Source: https://blue.cc/api/user-management/invite-user

## Invite a User

The `inviteUser` mutation allows you to invite users to your Blue projects or companies. Users can be assigned predefined access levels or custom roles with specific permissions.

### Basic Example

Invite a user with a standard access level:

```graphql
mutation InviteUserToProject {
  inviteUser(
    input: {
      email: "newuser@example.com"
      projectId: "web-redesign"
      accessLevel: MEMBER
    }
  )
}
```

### Advanced Example

Invite a user with a custom role to multiple projects:

```graphql
mutation InviteUserWithCustomRole {
  inviteUser(
    input: {
      email: "contractor@example.com"
      projectIds: ["web-redesign", "mobile-app", "api-v2"]
      accessLevel: MEMBER
      roleId: "role_contractor_123"
    }
  )
}
```

## Input Parameters

### InviteUserInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `email` | String! | ✅ Yes | Email address of the user to invite |
| `accessLevel` | UserAccessLevel! | ✅ Yes | Access level to grant (see table below) |
| `projectId` | String | No | Single project ID (mutually exclusive with companyId) |
| `projectIds` | [String!] | No | Multiple project IDs when using companyId |
| `companyId` | String | No | Company ID for company-level invitation (mutually exclusive with projectId) |
| `roleId` | String | No | Custom role ID (requires accessLevel: MEMBER) |

### UserAccessLevel Values

| Value | Description |
|-------|-------------|
| `OWNER` | Full control over project/company |
| `ADMIN` | Administrative access, can manage users and settings |
| `MEMBER` | Standard member access with full functionality |
| `CLIENT` | Limited access for external clients |
| `COMMENT_ONLY` | Can only view and comment on records |
| `VIEW_ONLY` | Read-only access to project |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Whether the invitation was sent successfully |

## Required Permissions

Users must have sufficient permissions to invite others. The permission hierarchy is enforced:

| Your Role | Can Invite |
|-----------|------------|
| `OWNER` | ✅ All access levels |
| `ADMIN` | ✅ ADMIN, MEMBER, CLIENT, COMMENT_ONLY, VIEW_ONLY (cannot invite OWNER) |
| `MEMBER` | ✅ MEMBER, CLIENT, COMMENT_ONLY, VIEW_ONLY (cannot invite OWNER or ADMIN) |
| `CLIENT` | ✅ CLIENT only |
| `COMMENT_ONLY` | ❌ Cannot invite |
| `VIEW_ONLY` | ❌ Cannot invite |

**Note**: For company invitations (using `companyId`), only company **OWNERS** can invite users.

## Invitation Types

### Project Invitation
Invite a user to a single project:
- Use `projectId` parameter
- Cannot use `companyId` simultaneously
- Inviter must have access to the project
- Access level restrictions apply

### Company Invitation
Invite a user to a company (and optionally specific projects):
- Use `companyId` parameter
- Cannot use `projectId` simultaneously
- Only company **OWNERS** can use this method
- Use `projectIds` array to specify which projects to include
- If `projectIds` is omitted, user gets company access only

## Custom Roles

When using custom roles:
1. Set `accessLevel` to `MEMBER`
2. Provide the `roleId` of your custom role
3. The user will inherit all permissions defined in the custom role
4. Custom roles are project-specific

To retrieve available custom roles, use the `projectUserRoles` [query](/api/user-management/retrieve-custom-role).

## Error Responses

### User Already in Project
```json
{
  "errors": [{
    "message": "User is already in the project.",
    "extensions": {
      "code": "USER_ALREADY_IN_THE_PROJECT"
    }
  }]
}
```

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to invite users with this access level",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

### Invalid Project
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

### Invitation Limit Exceeded
```json
{
  "errors": [{
    "message": "Unable to invite more people.",
    "extensions": {
      "code": "INVITATION_LIMIT"
    }
  }]
}
```

### Cannot Invite Yourself
```json
{
  "errors": [{
    "message": "You are not allowed to add yourself.",
    "extensions": {
      "code": "ADD_SELF"
    }
  }]
}
```

### Invalid Custom Role
```json
{
  "errors": [{
    "message": "Project user role was not found.",
    "extensions": {
      "code": "PROJECT_USER_ROLE_NOT_FOUND"
    }
  }]
}
```

### Company Banned
```json
{
  "errors": [{
    "message": "Company is banned",
    "extensions": {
      "code": "COMPANY_BANNED"
    }
  }]
}
```

## Important Notes

- **Email Validation**: Email addresses are normalized and validated before sending invitations
- **Invitation Expiry**: Invitations expire after 7 days and must be resent if not accepted
- **Automatic Notifications**: Blue automatically sends invitation emails to new users
- **Company Owners**: Company owners automatically receive ADMIN access in all projects
- **Billing Impact**: Adding users may affect your subscription if you have per-user pricing
- **Activity Logging**: All user invitations are logged for audit purposes
- **Parameter Exclusivity**: You must provide either `projectId` OR `companyId`, not both
- **Company Restrictions**: Only company owners can use the `companyId` parameter
- **Self-Invitation**: Users cannot invite themselves (will throw `ADD_SELF` error)

## Related Operations

- [List Users](/api/user-management/list-users) - View all users in a project or company
- [Remove User](/api/user-management/remove-user) - Remove users from projects
- [Custom Roles](/api/user-management/retrieve-custom-role) - Manage custom user roles

### /api/user-management/list-users

Source: https://blue.cc/api/user-management/list-users

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

### /api/user-management/remove-user

Source: https://blue.cc/api/user-management/remove-user

## Remove Users

This page covers how to remove users from projects and companies. User removal is a permanent action that unassigns the user from all records and removes their access, though their historical data is preserved for audit purposes.

## Remove User from Project

Remove a user from a specific project while maintaining their company access.

### Basic Example

```graphql
mutation {
  removeProjectUser(
    input: {
      projectId: "project-id"
      userId: "user-id"
    }
  ) {
    success
    operationId
  }
}
```

### Response Example

```json
{
  "data": {
    "removeProjectUser": {
      "success": true,
      "operationId": null
    }
  }
}
```

**Note:** The `operationId` field is currently not populated by this mutation and will return `null`.

## Remove User from Company

Remove a user from the entire company, which cascades to all projects.

### Basic Example

```graphql
mutation {
  removeCompanyUser(
    input: {
      companyId: "company-id"
      userId: "user-id"
    }
  )
}
```

### Response Example

```json
{
  "data": {
    "removeCompanyUser": true
  }
}
```

## Input Parameters

### RemoveProjectUserInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | The ID of the project (not slug) |
| `userId` | String! | ✅ Yes | The ID of the user to remove |

### RemoveCompanyUserInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | String! | ✅ Yes | The ID or slug of the company |
| `userId` | String! | ✅ Yes | The ID of the user to remove |

## Response Fields

### RemoveProjectUser Response

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Whether the operation was successful |
| `operationId` | String | Unique identifier for the operation (currently returns `null`) |

### RemoveCompanyUser Response

The `removeCompanyUser` mutation returns a simple `Boolean` value:
- `true` - User was successfully removed

## Required Permissions

### Project User Removal

| Role | Can Remove Users |
|------|-----------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |
| `READ_ONLY` | ❌ No |

**Important Notes:**
- You cannot remove users with `OWNER` role from a project
- The system prevents removal of project owners to maintain project ownership integrity

### Company User Removal

| Role | Can Remove Users |
|------|-----------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ❌ No |
| `MEMBER` | ❌ No |
| `READ_ONLY` | ❌ No |

**Note:** Only company owners can remove users from the company. The resolver enforces strict OWNER-only access for company user removal operations.

## Side Effects

### Project Removal
- Removes all todo assignments for the user in that project
- Deletes user's project folders
- Removes project user relationship
- Sends real-time updates to notify other users
- Creates audit log entry

### Company Removal
- **Cascading deletion across all projects:**
  - Removes all todo assignments in all company projects
  - Removes all project user folders
  - Removes user from all company projects
- Removes company user folders
- Removes user from company
- Sends removal notification email to the removed user
- **Updates billing (if per-user pricing):**
  - Recalculates active user count
  - Updates Stripe subscription quantity
- Creates audit log entry

## Error Responses

### Project Not Found
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```

### User Not Found
```json
{
  "errors": [{
    "message": "User was not found.",
    "extensions": {
      "code": "USER_NOT_FOUND"
    }
  }]
}
```

### Unauthorized Error
```json
{
  "errors": [{
    "message": "You are not authorized.",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

### Company Not Found (removeCompanyUser only)
```json
{
  "errors": [{
    "message": "Company was not found.",
    "extensions": {
      "code": "COMPANY_NOT_FOUND"
    }
  }]
}
```

This error occurs when:
- You lack the required role (OWNER/ADMIN for projects, OWNER for company)
- You attempt to remove a project OWNER
- The user is not part of the project/company

## Important Considerations

- **Data Preservation**: User removal is not reversible. While the user loses access, their historical data (comments, activity logs, etc.) is preserved for audit purposes.
- **Owner Protection**: Project owners cannot be removed from projects. Transfer ownership first if needed.
- **Billing Impact**: Company user removal automatically updates your subscription if you're on per-user pricing.
- **Email Notification**: Company removal sends a notification email to the removed user.
- **Cascade Effect**: Company removal affects all projects, while project removal is isolated to that specific project.

## Related Operations

- [List Users](/api/user-management/list-users) - View users before removal
- [Retrieve Custom Role](/api/user-management/retrieve-custom-role) - Check user permissions
- [Create Project](/api/projects/create-project) - Add users to new projects

### /api/user-management/retrieve-custom-role

Source: https://blue.cc/api/user-management/retrieve-custom-role

## Custom Roles

Custom roles in Blue allow you to define precise permission sets tailored to your team's needs. Beyond the standard access levels (OWNER, ADMIN, MEMBER, etc.), custom roles provide granular control over what users can see and do within projects.

### Basic Example - List Custom Roles

Retrieve all custom roles for a project:

```graphql
query GetProjectRoles {
  projectUserRoles(filter: { projectId: "web-redesign" }) {
    id
    name
    description
    allowInviteOthers
    canDeleteRecords
  }
}
```

### Advanced Example - Create Custom Role

Create a contractor role with specific permissions:

```graphql
mutation CreateContractorRole {
  createProjectUserRole(
    input: {
      projectId: "web-redesign"
      name: "External Contractor"
      description: "Limited access for external contractors"
      allowInviteOthers: false
      allowMarkRecordsAsDone: true
      canDeleteRecords: false
      showOnlyAssignedTodos: true
      isActivityEnabled: true
      isFormsEnabled: false
      isWikiEnabled: true
      isChatEnabled: false
      isDocsEnabled: true
      isFilesEnabled: true
      isRecordsEnabled: true
      isPeopleEnabled: false
    }
  ) {
    id
    name
  }
}
```

## Available Operations

### Query: projectUserRoles

Retrieve all custom roles for a project.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filter.projectId` | String | No | Project ID or slug (if not provided, returns roles for all accessible projects) |

### Mutation: createProjectUserRole

Create a new custom role with specific permissions.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | Project ID or slug |
| `name` | String! | ✅ Yes | Role name |
| `description` | String | No | Role description |
| **Permission Flags** |
| `allowInviteOthers` | Boolean | No | Can invite new users (default: false) |
| `allowMarkRecordsAsDone` | Boolean | No | Can complete tasks (default: false) |
| `canDeleteRecords` | Boolean | No | Can delete records (default: true) |
| **Feature Access** |
| `isActivityEnabled` | Boolean | No | Access to Activity section (default: true) |
| `isChatEnabled` | Boolean | No | Access to Chat (default: true) |
| `isDocsEnabled` | Boolean | No | Access to Docs (default: true) |
| `isFilesEnabled` | Boolean | No | Access to Files (default: true) |
| `isFormsEnabled` | Boolean | No | Access to Forms (default: true) |
| `isWikiEnabled` | Boolean | No | Access to Wiki (default: true) |
| `isRecordsEnabled` | Boolean | No | Access to Records (default: true) |
| `isPeopleEnabled` | Boolean | No | Access to People section (default: true) |
| **Visibility Settings** |
| `showOnlyAssignedTodos` | Boolean | No | Only see assigned tasks (default: false) |
| `showOnlyMentionedComments` | Boolean | No | Only see mentioned comments (default: false) |

### Mutation: updateProjectUserRole

Update an existing custom role.

#### Input Parameters

Same as `createProjectUserRole`, plus:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roleId` | String! | ✅ Yes | ID of the role to update |

### Mutation: deleteProjectUserRole

Delete a custom role.

#### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `roleId` | String! | ✅ Yes | ID of the role to delete |
| `projectId` | String! | ✅ Yes | Project ID or slug |

## Response Fields

### ProjectUserRole Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique role identifier |
| `name` | String! | Role name |
| `description` | String | Role description |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |
| **Permissions** |
| `allowInviteOthers` | Boolean! | Can invite users |
| `allowMarkRecordsAsDone` | Boolean! | Can complete tasks |
| `canDeleteRecords` | Boolean! | Can delete records |
| **Feature Flags** |
| `isActivityEnabled` | Boolean! | Activity section access |
| `isChatEnabled` | Boolean! | Chat access |
| `isDocsEnabled` | Boolean! | Docs access |
| `isFilesEnabled` | Boolean! | Files access |
| `isFormsEnabled` | Boolean! | Forms access |
| `isWikiEnabled` | Boolean! | Wiki access |
| `isRecordsEnabled` | Boolean! | Records access |
| `isPeopleEnabled` | Boolean! | People section access |
| **Visibility** |
| `showOnlyAssignedTodos` | Boolean! | Task visibility filter |
| `showOnlyMentionedComments` | Boolean! | Comment visibility filter |

## Required Permissions

| Operation | Required Permission |
|-----------|-------------------|
| `projectUserRoles` | Any project member |
| `createProjectUserRole` | Project OWNER or ADMIN |
| `updateProjectUserRole` | Project OWNER or ADMIN |
| `deleteProjectUserRole` | Project OWNER or ADMIN |

## Error Responses

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to manage custom roles",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

### Role Not Found
```json
{
  "errors": [{
    "message": "Custom role not found",
    "extensions": {
      "code": "PROJECT_USER_ROLE_NOT_FOUND"
    }
  }]
}
```

### Role Limit Reached
```json
{
  "errors": [{
    "message": "Project user role limit reached.",
    "extensions": {
      "code": "PROJECT_USER_ROLE_LIMIT"
    }
  }]
}
```

## Important Notes

- **Default Permissions**: When creating roles, unspecified boolean permissions default to false except for `canDeleteRecords` which defaults to true
- **Role Assignment**: Assign custom roles by setting `accessLevel: MEMBER` and providing the `roleId` in the `inviteUser` mutation
- **Hierarchy**: Custom roles are treated as MEMBER-level for hierarchy purposes
- **Role Limits**: Each project can have a maximum of 20 custom roles
- **Feature Access**: The feature flags control access to entire sections of the application

## Use Cases

### Contractor Role
```graphql
{
  name: "Contractor",
  allowInviteOthers: false,
  canDeleteRecords: false,
  showOnlyAssignedTodos: true,
  isActivityEnabled: true,
  isChatEnabled: false,
  isPeopleEnabled: false
}
```

### Department Lead
```graphql
{
  name: "Department Lead",
  allowInviteOthers: true,
  allowMarkRecordsAsDone: true,
  canDeleteRecords: true,
  isActivityEnabled: true,
  isWikiEnabled: true,
  isPeopleEnabled: true
}
```

### Read-Only Observer
```graphql
{
  name: "Observer",
  allowMarkRecordsAsDone: false,
  canDeleteRecords: false,
  allowInviteOthers: false,
  showOnlyMentionedComments: true,
  isFormsEnabled: false
}
```

## Related Operations

- [Invite User](/api/user-management/) - Assign custom roles to users
- [List Users](/api/user-management/list-users) - View users and their roles
- [Remove User](/api/user-management/remove-user) - Remove users from projects

## webhooks

### /api/webhooks/delete-webhook

Source: https://blue.cc/api/webhooks/delete-webhook

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

### /api/webhooks/index

Source: https://blue.cc/api/webhooks/index

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

### /api/webhooks/list-webhooks

Source: https://blue.cc/api/webhooks/list-webhooks

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

### /api/webhooks/update-webhook

Source: https://blue.cc/api/webhooks/update-webhook

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

## workspaces

### /api/workspaces/archive-workspace

Source: https://blue.cc/api/workspaces/archive-workspace

## Archive a Workspace

Archiving workspaces is useful when you want to temporarily hide a workspace without permanently deleting it. Archived workspaces:
- Are hidden from active workspace lists
- Cannot be edited or modified
- Can still be viewed by workspace members
- Can be unarchived at any time

### Basic Example

```graphql
mutation {
  archiveProject(id: "project-123")
}
```

### Using Workspace Context Header

```graphql
# With header: x-bloo-project-id: project-123
mutation {
  archiveProject
}
```

### With Variables

```graphql
mutation ArchiveProject($projectId: String!) {
  archiveProject(id: $projectId)
}
```

Variables:
```json
{
  "projectId": "abc123-project-id"
}
```

## Unarchive a Workspace

To restore an archived workspace to active status:

```graphql
mutation {
  unarchiveProject(id: "project-123")
}
```

## Mutation Parameters

### archiveProject

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | No | The workspace ID to archive. If not provided, uses the workspace from context headers. |

### unarchiveProject

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | No | The workspace ID to unarchive. If not provided, uses the workspace from context headers. |

## Response

Both mutations return a Boolean indicating success:

| Field | Type | Description |
|-------|------|-------------|
| `Boolean` | Boolean! | Returns `true` when the operation is successful |

## Required Permissions

| Workspace Role | Can Archive/Unarchive |
|----------------|---------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |
| `CLIENT` | ❌ No |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

## Workspace ID Resolution

The workspace ID can be specified in two ways:

1. **As a parameter** (recommended):
   ```graphql
   archiveProject(id: "project-123")
   ```

2. **Via HTTP header**:
   - `x-bloo-project-id: project-123` (preferred)
   - `x-project-id: project-123` (deprecated)

If both are provided, the parameter takes precedence.

## Error Responses

### Workspace Not Found
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to archive this project",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

## What Happens When Archiving

When you archive a workspace:

1. **Workspace Status**: The workspace is marked as archived
2. **Visibility**: Hidden from active workspace lists
3. **Templates**: If the workspace was a template, it loses template status
4. **Position**: Moved to the end of user's workspace list
5. **Folders**: Removed from any workspace folders
6. **Activity Log**: Archive action is recorded
7. **Real-time Updates**: All connected users are notified

## Important Notes

- **Idempotent Operation**: Archiving an already archived workspace returns `true` without changes
- **Reversible**: Use `unarchiveProject` to restore the workspace
- **View Access**: Archived workspaces remain viewable by existing members
- **No Data Loss**: Archiving preserves all workspace data, unlike deletion
- **Alternative to Deletion**: Consider archiving instead of deleting for temporary removal

### /api/workspaces/copy-workspace

Source: https://blue.cc/api/workspaces/copy-workspace

## Copy a Workspace

The copy workspace mutation allows you to duplicate an existing workspace within the same organization or to a different organization. This is useful for creating workspace templates, setting up similar workspaces, or moving workspaces between organizations. The copy operation runs asynchronously to handle large workspaces efficiently.

### Basic Example

```graphql
mutation CopyProject {
  copyProject(
    input: {
      projectId: "proj_123abc"
      name: "New Project Copy"
      options: {
        todos: true
        todoLists: true
        people: true
      }
    }
  )
}
```

### Advanced Example

```graphql
mutation CopyProject {
  copyProject(
    input: {
      projectId: "proj_123abc"
      name: "Q2 Marketing Campaign"
      description: "Copy of Q1 campaign with updated timeline"
      imageURL: "https://example.com/campaign-logo.png"
      companyId: "comp_789xyz"
      options: {
        assignees: true
        automations: true
        checklists: true
        customFields: true
        discussions: false
        discussionComments: false
        dueDates: true
        files: true
        forms: true
        people: true
        projectUserRoles: true
        statusUpdates: false
        statusUpdateComments: false
        tags: true
        todoActions: true
        todoComments: false
        todoLists: true
        todos: true
      }
    }
  )
}
```

## Input Parameters

### CopyProjectInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | The ID of the workspace to be copied |
| `name` | String! | ✅ Yes | The name for the new workspace (max 50 characters) |
| `description` | String | No | The description for the new workspace (max 500 characters) |
| `imageURL` | String | No | The image URL for the new workspace |
| `companyId` | String | No | The ID of the organization where the new workspace should be created. If not provided, uses the source workspace's organization |
| `options` | CopyProjectOptionsInput! | ✅ Yes | Configuration for what elements to copy |

### CopyProjectOptionsInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assignees` | Boolean | No | Copy task assignees (requires `people: true`) |
| `automations` | Boolean | No | Copy workspace automations and workflows |
| `checklists` | Boolean | No | Copy task checklists |
| `customFields` | Boolean | No | Copy custom field definitions and values |
| `discussions` | Boolean | No | Copy workspace discussions |
| `discussionComments` | Boolean | No | Copy comments on discussions (requires `discussions: true`) |
| `dueDates` | Boolean | No | Copy due dates on tasks |
| `files` | Boolean | No | Copy file attachments |
| `forms` | Boolean | No | Copy workspace forms |
| `people` | Boolean | No | Copy workspace members |
| `projectUserRoles` | Boolean | No | Copy user roles and permissions (requires `people: true`) |
| `statusUpdates` | Boolean | No | Copy workspace status updates |
| `statusUpdateComments` | Boolean | No | Copy comments on status updates (requires `statusUpdates: true`) |
| `tags` | Boolean | No | Copy workspace tags |
| `todoActions` | Boolean | No | Copy task actions/subtasks |
| `todoComments` | Boolean | No | Copy task comments |
| `todoLists` | Boolean | No | Copy task lists/sections |
| `todos` | Boolean | No | Copy tasks |
| `coverConfig` | Boolean | No | Copy todo cover image configuration |

## Response

The mutation returns a `Boolean` value:
- `true` - The copy job has been successfully queued
- `false` - The copy job could not be started

## Checking Copy Status

Since copying is asynchronous, use the `copyProjectStatus` query to check progress:

### Copy Status Fields

| Field | Type | Description |
|-------|------|-------------|
| `queuePosition` | Int | Position in the copy queue |
| `totalQueues` | Int | Total number of items in the queue |
| `isActive` | Boolean | Whether the copy operation is currently active |
| `oldProject` | Project | The source workspace being copied |
| `newProjectName` | String | Name of the new workspace being created |
| `isTemplate` | Boolean | Whether this is copying as a template |
| `oldCompany` | Company | Source organization |
| `newCompany` | Company | Target organization |

```graphql
query CheckCopyStatus {
  copyProjectStatus {
    queuePosition
    totalQueues
    isActive
    oldProject {
      id
      name
    }
    newProjectName
    isTemplate
    oldCompany {
      id
      name
    }
    newCompany {
      id
      name
    }
  }
}
```

## Required Permissions

To copy a workspace, you need appropriate permissions in both the source and target locations:

| Scenario | Required Permissions |
|----------|---------------------|
| Copy within same organization | `OWNER`, `ADMIN`, or `MEMBER` role in the source workspace |
| Copy to different organization | • `OWNER`, `ADMIN`, or `MEMBER` role in the source workspace<br>• Must be a member of the target organization |

The source workspace must be active (not archived) to be copied.

## Error Responses

### Workspace Not Found
```json
{
  "errors": [{
    "message": "Record not found",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
Occurs when the source workspace doesn't exist or you lack access.

### Organization Not Found
```json
{
  "errors": [{
    "message": "Record not found",
    "extensions": {
      "code": "COMPANY_NOT_FOUND"
    }
  }]
}
```
Occurs when the target organization doesn't exist or you lack access.

### Workspace Too Large
```json
{
  "errors": [{
    "message": "Project is too large to copy",
    "extensions": {
      "code": "CREATE_PROJECT_LIMIT"
    }
  }]
}
```
Occurs when the workspace has more than 250,000 tasks.

### Copy Already In Progress
```json
{
  "errors": [{
    "message": "Oops!"
  }]
}
```
Occurs when you already have a copy operation in progress.

## Important Notes

- **Asynchronous Operation**: The mutation queues a background job and returns immediately. Use `copyProjectStatus` to track progress.
- **One Copy at a Time**: Only one copy operation per user can be active at any time.
- **Size Limitations**: Workspaces with more than 250,000 tasks cannot be copied.
- **Logical Dependencies**: Some options work best together:
  - `assignees` works with `people: true` (assignees won't be copied without people)
  - `discussionComments` works with `discussions: true`
  - `statusUpdateComments` works with `statusUpdates: true`
  - `projectUserRoles` works with `people: true`
- **Name Processing**: Workspace names are trimmed and any URLs are automatically removed.
- **Queue Priority**: Enterprise customers receive higher priority in the copy queue.
- **Status Caching**: Copy status is cached for 6 hours after completion.

### /api/workspaces/create-workspace

Source: https://blue.cc/api/workspaces/create-workspace

## Create a New Workspace

To create a new workspace, you can use the following mutation:

```graphql
mutation {
  createProject(
    input: {
      name: "YOUR PROJECT NEW NAME"
      companyId: "YOUR ORGANIZATION ID OR SLUG"
      description: "Project description"
      color: "#3B82F6"
      icon: "briefcase"
      category: GENERAL
    }
  ) {
    id
    name
    slug
    description
    color
    icon
    category
  }
}
```

Remember to include the required headers in your request:

- `X-Bloo-Token-ID`: Your API token ID
- `X-Bloo-Token-Secret`: Your API token secret
- `X-Bloo-Company-ID`: Your organization ID
- `Content-Type: application/json`

### Response Example

Upon success, the mutation will return the newly created workspace details:

```json
{
  "data": {
    "createProject": {
      "id": "newly-created-project-id",
      "name": "YOUR PROJECT NEW NAME",
      "slug": "your-project-new-name",
      "description": "Project description",
      "color": "#3B82F6",
      "icon": "briefcase",
      "category": "GENERAL"
    }
  }
}
```

## Create from a Template

To create a workspace from an existing template, you can add an optional `templateId` to the mutation.

```graphql
mutation {
  createProject(
    input: {
      templateId: "YOUR TEMPLATE ID OR SLUG"
      name: "YOUR PROJECT NEW NAME"
      companyId: "YOUR ORGANIZATION ID OR SLUG"
    }
  ) {
    id
  }
}
```

Creating a workspace from a template will not create the workspace instantly. Instead, your workspace creation will be queued.

## Advanced Example with Template

Here's a complete example showing all available options when creating from a template:

```graphql
mutation {
  createProject(
    input: {
      templateId: "marketing-template"
      name: "Q1 Marketing Campaign"
      companyId: "acme-corp"
      description: "Marketing initiatives for Q1 2024"
      color: "#10B981"
      icon: "megaphone"
      category: MARKETING
      coverConfig: { enabled: true, fit: COVER, imageSelectionType: FIRST, source: DESCRIPTION }
    }
  ) {
    id
    name
    slug
    description
    color
    icon
    category
  }
}
```

The `coverConfig` parameter currently only works when creating a workspace from a template. For workspaces created from scratch, you'll need to use the `editProject` mutation after creation to configure todo cover images.

## Check Creation Status

To check the status of your workspace creation in the queue, you can use the following query:

```graphql
query {
  copyProjectStatus {
    newProjectName
    isTemplate
    isActive
    queuePosition
    totalQueues
  }
}
```

This query will return the status of your workspace creation in the queue.

## Input Parameters

### CreateProjectInput

| Parameter     | Type                 | Required | Description                                                                                |
| ------------- | -------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `name`        | String               | ✅ Yes   | The workspace name. URLs will be stripped from the name.                                   |
| `companyId`   | String               | ✅ Yes   | The ID or slug of the organization where the workspace will be created.                    |
| `description` | String               | No       | A description of the workspace.                                                            |
| `color`       | String               | No       | Workspace color in hex format (e.g., "#3B82F6").                                           |
| `icon`        | String               | No       | Icon identifier for the workspace (e.g., "briefcase", "rocket").                           |
| `category`    | ProjectCategory      | No       | Workspace category. Defaults to `GENERAL` if not specified.                                |
| `templateId`  | String               | No       | ID of an existing workspace to use as a template.                                          |
| `coverConfig` | TodoCoverConfigInput | No       | Configuration for todo cover images (currently only works with template-based creation).   |

### ProjectCategory Values

| Value              | Description                                 |
| ------------------ | ------------------------------------------- |
| `CRM`              | Customer Relationship Management workspaces |
| `CROSS_FUNCTIONAL` | Cross-functional team workspaces            |
| `CUSTOMER_SUCCESS` | Customer success initiatives                |
| `DESIGN`           | Design and creative workspaces              |
| `ENGINEERING`      | Engineering and development workspaces      |
| `GENERAL`          | General workspaces (default)                |
| `HR`               | Human Resources workspaces                  |
| `IT`               | Information Technology workspaces           |
| `MARKETING`        | Marketing campaigns and initiatives         |
| `OPERATIONS`       | Operations and logistics workspaces         |
| `PRODUCT`          | Product management workspaces               |
| `SALES`            | Sales and business development workspaces   |

### TodoCoverConfigInput

If you want to configure how todo cover images work in your workspace, you can provide the `coverConfig` parameter:

| Parameter            | Type               | Required | Description                                        |
| -------------------- | ------------------ | -------- | -------------------------------------------------- |
| `enabled`            | Boolean            | ✅ Yes   | Whether cover images are enabled for todos         |
| `fit`                | ImageFit           | ✅ Yes   | How images should fit in the cover area            |
| `imageSelectionType` | ImageSelectionType | ✅ Yes   | Which image to select from available options       |
| `source`             | ImageSource        | ✅ Yes   | Where to pull images from                          |
| `sourceId`           | String             | No       | Specific source identifier (e.g., custom field ID) |

**ImageFit Values:** `COVER`, `CONTAIN`, `FILL`, `SCALE_DOWN`

**ImageSelectionType Values:** `FIRST` (first image), `LAST` (last image)

**ImageSource Values:** `DESCRIPTION` (from todo description), `COMMENTS` (from comments), `CUSTOM_FIELD` (from a custom field)

## Response Fields

The createProject mutation returns a Workspace object with the following available fields:

| Field         | Type            | Description                          |
| ------------- | --------------- | ------------------------------------ |
| `id`          | ID!             | Unique identifier for the workspace  |
| `name`        | String!         | Workspace name                       |
| `slug`        | String!         | URL-friendly workspace identifier    |
| `description` | String          | Workspace description                |
| `color`       | String          | Workspace color in hex format        |
| `icon`        | String          | Icon identifier                      |
| `category`    | ProjectCategory | Workspace category enum value        |
| `companyId`   | String!         | ID of the organization               |
| `createdAt`   | DateTime!       | Creation timestamp                   |
| `updatedAt`   | DateTime!       | Last update timestamp                |
| `archived`    | Boolean!        | Whether the workspace is archived    |
| `isTemplate`  | Boolean!        | Whether this is a template workspace |

Note: You can request any combination of these fields in your response.

### Important Notes

- You must have `OWNER`, `ADMIN`, or `MEMBER` level access to the organization to create workspaces
- When creating from a template, the template cannot have more than 250,000 todos
- The creating user is automatically assigned as the workspace `OWNER`
- Workspace names are automatically trimmed of whitespace
- The `coverConfig` parameter is currently only functional when creating from a template

## Error Responses

### Organization Not Found

```json
{
  "errors": [
    {
      "message": "Organization not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

### Template Not Found

```json
{
  "errors": [
    {
      "message": "Template not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

### Template Too Large

```json
{
  "errors": [
    {
      "message": "Template cannot have more than 250000 todos",
      "extensions": {
        "code": "VALIDATION_ERROR"
      }
    }
  ]
}
```

### Permission Denied

```json
{
  "errors": [
    {
      "message": "You do not have permission to create projects in this organization",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### /api/workspaces/delete-workspace

Source: https://blue.cc/api/workspaces/delete-workspace

## Delete a Workspace

The `deleteProject` mutation permanently removes a workspace and all its associated data from Blue.

### Basic Example

```graphql
mutation {
  deleteProject(id: "{project-id}") {
    success
  }
}
```

### With Variables

```graphql
mutation DeleteProject($projectId: String!) {
  deleteProject(id: $projectId) {
    success
  }
}
```

Variables:
```json
{
  "projectId": "abc123-project-id"
}
```

<Callout variant="warning" title="Workspace deletion is permanent">
Once a workspace is deleted, all associated data will be permanently removed from the system. This includes:
- All todos and lists
- Comments and attachments
- Custom fields and their values
- Automations
- Tags and dependencies
- User assignments
- File attachments

Please ensure you have backed up any important information before proceeding with the deletion.
</Callout>

## Mutation Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String! | ✅ Yes | The unique identifier of the workspace to delete |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean! | Indicates whether the deletion was successful |

## Required Permissions

To delete a workspace, you must have:

1. **Organization-level access**: `OWNER`, `ADMIN`, or `MEMBER` role in the organization
2. **Workspace-level access**: `OWNER` or `ADMIN` role in the specific workspace

### Workspace Role Permissions

| Workspace Role | Can Delete Workspace |
|----------------|---------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |
| `CLIENT` | ❌ No |
| `COMMENT_ONLY` | ❌ No |
| `VIEW_ONLY` | ❌ No |

## Deletion Process

When you delete a workspace, Blue performs the following steps:

1. **Validation**: Verifies the workspace exists and you have permission to delete it
2. **Backup**: Saves workspace data to a trash table for potential recovery (internal use only)
3. **Immediate deletion**: Removes the workspace from the active database
4. **Notifications**: Updates related systems and notifies relevant services
5. **Background cleanup**: Asynchronously removes all associated data

## Error Responses

### Workspace Not Found
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

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You are not authorized to delete this project",
    "extensions": {
      "code": "UNAUTHORIZED"
    }
  }]
}
```

## Important Notes

- Deletion is **cascading** - all workspace data is removed
- The process is **asynchronous** - large workspaces may take time to fully clean up
- Consider using **archive** instead of delete if you might need the workspace later
- Deleted workspaces are saved internally for recovery purposes but are not accessible via the API

### /api/workspaces/index

Source: https://blue.cc/api/workspaces/index

## Overview

Workspaces are the core organizational unit in Blue. They contain lists, todos, custom fields, automations, and all other work-related data. Workspaces belong to organizations and have their own permission systems, templates, and configurations.

## Available Operations

### Core Workspace Operations

| Operation | Description | Link |
|-----------|-------------|------|
| **Create Workspace** | Create a new workspace or from template | [View Details →](/api/workspaces/create-workspace) |
| **List Workspaces** | Query and filter workspaces | [View Details →](/api/workspaces/list-workspaces) |
| **Delete Workspace** | Permanently delete a workspace | [View Details →](/api/workspaces/delete-workspace) |
| **Archive Workspace** | Archive/unarchive workspaces | [View Details →](/api/workspaces/archive-workspace) |
| **Rename Workspace** | Update workspace name and slug | [View Details →](/api/workspaces/rename-workspace) |
| **Copy Workspace** | Duplicate an existing workspace | [View Details →](/api/workspaces/copy-workspace) |

### Workspace Components

| Component | Description | Link |
|-----------|-------------|------|
| **Lists** | Manage todo lists within workspaces | [View Details →](/api/workspaces/lists) |
| **Templates** | Work with workspace templates | [View Details →](/api/workspaces/templates) |
| **Activity** | Track workspace activity and changes | [View Details →](/api/workspaces/workspace-activity) |

## Key Concepts

### Workspace Structure
- Workspaces belong to organizations
- Each workspace can have multiple lists
- Lists contain todos
- Workspaces support custom fields, tags, and automations

### Permissions Model
Workspaces have a multi-level permission system:

| Level | Permissions |
|-------|-------------|
| **OWNER** | Full control, can delete workspace |
| **ADMIN** | Manage workspace settings, users, and content |
| **MEMBER** | Create and edit content |
| **CLIENT** | Limited edit access |
| **VIEW_ONLY** | Read-only access |
| **COMMENT_ONLY** | Can only comment |

### Workspace Categories
Workspaces can be categorized for better organization:
- CRM
- CROSS_FUNCTIONAL
- CUSTOMER_SUCCESS
- DESIGN
- ENGINEERING
- GENERAL (default)
- HR
- IT
- MARKETING
- OPERATIONS
- PERSONAL
- PROCUREMENT
- PRODUCT
- SALES

## Common Patterns

### Creating a Basic Workspace
```graphql
mutation CreateProject {
  createProject(input: {
    name: "Q1 Marketing Campaign"
    companyId: "company-123"
    category: MARKETING
  }) {
    id
    name
    slug
  }
}
```

### Querying Workspaces with Filters
```graphql
query GetProjects {
  projectList(
    filter: {
      companyIds: ["company-123"]
      isArchived: false
      categories: [MARKETING, SALES]
    }
    sort: [{ field: updatedAt, direction: DESC }]
    take: 20
  ) {
    items {
      id
      name
      category
      todosCount
      todosDoneCount
    }
    pageInfo {
      hasNextPage
      total
    }
  }
}
```

> **Note**: The `projectList` query is the recommended approach for querying workspaces. A legacy `projects` query exists but should not be used for new implementations.

### Managing Workspace Lists
```graphql
# Get all lists in a project
query GetProjectLists {
  todoLists(projectId: "project-123") {
    id
    title
    position
    todosCount
  }
}

# Create a new list
mutation CreateList {
  createTodoList(input: {
    projectId: "project-123"
    title: "To Do"
    position: 1.0
  }) {
    id
    title
  }
}
```

## Best Practices

1. **Workspace Naming**
   - Use clear, descriptive names
   - Avoid special characters that might affect slugs
   - Keep names under 50 characters

2. **Permission Management**
   - Start with minimal permissions
   - Use CLIENT role for external stakeholders
   - Regularly audit workspace access

3. **Organization**
   - Use categories to group similar workspaces
   - Archive completed workspaces instead of deleting
   - Use templates for repetitive workspace types

4. **Performance**
   - Use pagination for large workspace lists
   - Filter by active/archived status
   - Limit the number of lists per workspace (max 50)

## Error Handling

Common errors you might encounter:

| Error Code | Description | Solution |
|------------|-------------|----------|
| `PROJECT_NOT_FOUND` | Workspace doesn't exist or no access | Verify workspace ID and permissions |
| `COMPANY_NOT_FOUND` | Organization doesn't exist | Check organization ID |
| `FORBIDDEN` | Insufficient permissions | Ensure proper role level |
| `BAD_USER_INPUT` | Validation error (e.g., name too long) | Check input validation requirements |


## Related Resources

- [Records API](/api/records) - Managing todos/records within workspaces
- [Custom Fields API](/api/custom-fields) - Adding custom fields to workspaces
- [Automations API](/api/automations) - Setting up workspace automations
- [Users API](/api/users) - Managing workspace users and permissions

### /api/workspaces/list-workspaces

Source: https://blue.cc/api/workspaces/list-workspaces

## List all Workspaces

The `projectList` query allows you to retrieve workspaces with powerful filtering, sorting, and pagination options.

### Basic Example

```graphql
query ProjectListQuery {
  projectList(filter: { companyIds: ["ENTER COMPANY ID"] }) {
    items {
      id
      uid
      slug
      name
      description
      archived
      color
      icon
      createdAt
      updatedAt
      allowNotification
      position
      unseenActivityCount
      todoListsMaxPosition
      lastAccessedAt
      isTemplate
      automationsCount
      totalFileCount
      totalFileSize
      todoAlias
    }
    pageInfo {
      totalPages
      totalItems
      page
      perPage
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Advanced Example with Filtering and Sorting

```graphql
query FilteredProjectList {
  projectList(
    filter: {
      companyIds: ["company-123", "company-456"]
      archived: false
      isTemplate: false
      search: "marketing"
      inProject: true
      folderId: null  # Get root-level projects only
    }
    sort: [position_ASC, name_ASC]
    skip: 0
    take: 50
  ) {
    items {
      id
      name
      slug
      position
      archived
    }
    totalCount
    pageInfo {
      totalItems
      hasNextPage
    }
  }
}
```

## Workspace Fields

The following table describes all available fields for each workspace in the `ProjectListQuery`:

| Field | Type | Description |
|-------|------|-------------|
| id | ID! | Unique identifier for the workspace |
| uid | String! | User-friendly unique identifier for the workspace |
| slug | String! | URL-friendly name of the workspace |
| name | String! | Display name of the workspace |
| description | String | Brief description of the workspace |
| archived | Boolean | Boolean indicating if the workspace is archived |
| color | String | Color associated with the workspace for visual identification |
| icon | String | Icon associated with the workspace for visual identification |
| image | Image | Workspace cover image object |
| createdAt | DateTime! | Timestamp when the workspace was created |
| updatedAt | DateTime! | Timestamp when the workspace was last updated |
| allowNotification | Boolean! | Boolean indicating if notifications are enabled for the workspace |
| position | Float! | Numeric value representing the workspace's position in a list |
| unseenActivityCount | Int! | Number of unseen activities in the workspace |
| todoListsMaxPosition | Float! | Maximum position value for todo lists in the workspace |
| lastAccessedAt | DateTime | Timestamp when the workspace was last accessed |
| isTemplate | Boolean! | Boolean indicating if the workspace is a template |
| isOfficialTemplate | Boolean! | Boolean indicating if this is an official Blue template |
| automationsCount(isActive: Boolean) | Int! | Number of automations associated with the workspace |
| totalFileCount | Int | Total number of files in the workspace |
| totalFileSize | Float | Total size of all files in the workspace (in bytes) |
| todoAlias | String | Custom alias for "todo" used in the workspace |
| category | ProjectCategory! | Workspace category (CRM, MARKETING, etc.) |
| hideEmailFromRoles | [UserAccessLevel!] | Array of roles that should hide email addresses |
| hideStatusUpdate | Boolean | Boolean for hiding status updates |
| company | Company! | Full organization object details |
| accessLevel(userId: String) | UserAccessLevel | Get user's access level for the specific workspace |
| folder | Folder | Folder containing this workspace |
| features | [ProjectFeature!] | Array of enabled workspace features |
| sequenceCustomField | CustomField | Custom field used for sequence numbering |
| coverConfig | TodoCoverConfig | Configuration for todo cover images |
| hideRecordCount | Boolean | Whether to hide record counts |
| showTimeSpentInTodoList | Boolean | Whether to show time spent in todo lists |
| showTimeSpentInProject | Boolean | Whether to show time spent in workspace |
| todoFields | [TodoField] | Custom todo field definitions |

Note: You can request any combination of these fields in your GraphQL query.

## Pagination Fields

The `pageInfo` object provides pagination details for the query results:

| Field | Type | Description |
|-------|------|-------------|
| totalPages | Int | Total number of pages of results |
| totalItems | Int | Total number of workspaces matching the query |
| page | Int | Current page number |
| perPage | Int | Number of items per page |
| hasNextPage | Boolean! | Boolean indicating if there's a next page of results |
| hasPreviousPage | Boolean! | Boolean indicating if there's a previous page of results |

## Query Parameters

### Filter Options (ProjectListFilter)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyIds` | [String!]! | ✅ Yes | Array of organization IDs or slugs to search within |
| `ids` | [String!] | No | Filter by specific workspace IDs |
| `archived` | Boolean | No | Filter by archived status (true/false) |
| `isTemplate` | Boolean | No | Filter template workspaces (true/false) |
| `search` | String | No | Search workspaces by name (case-insensitive) |
| `folderId` | String | No | Filter by folder ID. Use `null` for root-level workspaces |
| `inProject` | Boolean | No | Filter by user membership. See note below |

**Note on `inProject` filter:**
- `true` or `undefined`: Returns workspaces the user is a member of
- `false`: Returns workspaces the user is NOT in (requires organization owner permission)
- Folder filtering (`folderId`) only works when `inProject` is not `false`

### Sorting Options (ProjectSort)

| Value | Description |
|-------|-------------|
| `id_ASC` | Sort by ID ascending |
| `id_DESC` | Sort by ID descending |
| `name_ASC` | Sort by name ascending (A-Z) |
| `name_DESC` | Sort by name descending (Z-A) |
| `createdAt_ASC` | Sort by creation date (oldest first) |
| `createdAt_DESC` | Sort by creation date (newest first) |
| `updatedAt_ASC` | Sort by last update (oldest first) |
| `updatedAt_DESC` | Sort by last update (newest first) |
| `position_ASC` | Sort by position ascending* |
| `position_DESC` | Sort by position descending* |

*Position sorting is only available when viewing workspaces the user is a member of (`inProject !== false`)

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | Int | 0 | Number of records to skip |
| `take` | Int | 20 | Number of records to return |

### Important Notes

1. **Default behavior for non-member workspaces** (`inProject: false`):
   - Excludes archived workspaces unless `archived` filter is explicitly set
   - Excludes template workspaces unless `isTemplate` filter is explicitly set

2. **Folder filtering limitations**:
   - Only works when showing user's workspaces
   - Cannot be used with `inProject: false`
   - Use `folderId: null` to get workspaces not in any folder

3. **Sorting fallback**:
   - Position sorting is ignored when viewing non-member workspaces
   - Falls back to name sorting in such cases

4. **Deprecated parameters**:
   - `orderBy`, `after`, `before`, `first`, `last` are deprecated
   - Use `sort`, `skip`, and `take` instead

### /api/workspaces/lists

Source: https://blue.cc/api/workspaces/lists

## Overview

Lists in Blue are containers for organizing todos within a workspace. Each list can hold multiple todos and helps structure work into logical groups. Lists support positioning, locking, and role-based access control.

<youtube url="https://www.youtube.com/watch?v=qziabkn_Gu8" />

## Key Concepts

- Each workspace can have up to **50 lists**
- Lists are ordered by position (ascending)
- Lists can be locked to prevent modifications
- Lists respect workspace-level and role-based permissions
- Deleted lists are moved to trash (soft delete)

## Queries

### Get a Single List

Retrieve a specific todo list by ID.

```graphql
query GetTodoList($id: String!) {
  todoList(id: $id) {
    id
    uid
    title
    position
    isDisabled
    isLocked
    createdAt
    updatedAt
    project {
      id
      name
    }
    createdBy {
      id
      username
    }
  }
}
```

### Get All Lists in a Workspace

Retrieve all todo lists for a specific workspace.

```graphql
query GetProjectLists($projectId: String!) {
  todoLists(projectId: $projectId) {
    id
    uid
    title
    position
    isDisabled
    isLocked
    createdAt
    updatedAt
  }
}
```

### Advanced List Query

Query lists with filtering, sorting, and pagination.

```graphql
query SearchTodoLists($filter: TodoListsFilterInput!, $sort: [TodoListsSort!], $skip: Int, $take: Int) {
  todoListQueries {
    todoLists(filter: $filter, sort: $sort, skip: $skip, take: $take) {
      items {
        id
        uid
        title
        position
        isDisabled
        isLocked
        createdAt
        updatedAt
        project {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        total
      }
    }
  }
}
```

## Mutations

### Create a List

Create a new todo list in a workspace.

```graphql
mutation CreateTodoList($input: CreateTodoListInput!) {
  createTodoList(input: $input) {
    id
    uid
    title
    position
    isDisabled
    isLocked
    createdAt
    project {
      id
      name
    }
  }
}
```

**Example:**
```graphql
mutation {
  createTodoList(input: {
    projectId: "project-123"
    title: "Sprint 1 Tasks"
    position: 1.0
  }) {
    id
    title
  }
}
```

### Edit a List

Update an existing todo list's properties.

```graphql
mutation EditTodoList($input: EditTodoListInput!) {
  editTodoList(input: $input) {
    id
    title
    position
    isLocked
    updatedAt
  }
}
```

**Example:**
```graphql
mutation {
  editTodoList(input: {
    todoListId: "list-123"
    title: "Sprint 1 - In Progress"
    position: 2.0
    isLocked: true
  }) {
    id
    title
    isLocked
  }
}
```

### Delete a List

Delete a todo list (moves to trash).

```graphql
mutation DeleteTodoList($input: DeleteTodoListInput!) {
  deleteTodoList(input: $input) {
    success
  }
}
```

**Example:**
```graphql
mutation {
  deleteTodoList(input: {
    projectId: "project-123"
    todoListId: "list-123"
  }) {
    success
  }
}
```

### Mark List as Done/Undone

Mark all todos in a list as done or undone.

```graphql
# Mark as done
mutation MarkListDone($todoListId: String!, $filter: TodosFilter) {
  markTodoListAsDone(todoListId: $todoListId, filter: $filter)
}

# Mark as undone
mutation MarkListUndone($todoListId: String!, $filter: TodosFilter) {
  markTodoListAsUndone(todoListId: $todoListId, filter: $filter)
}
```

## Input Types

### CreateTodoListInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | The workspace ID where the list will be created |
| `title` | String! | ✅ Yes | The name of the list |
| `position` | Float! | ✅ Yes | The position of the list (for ordering) |

### EditTodoListInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoListId` | String! | ✅ Yes | The ID of the list to edit |
| `title` | String | No | New title for the list |
| `position` | Float | No | New position for the list |
| `isLocked` | Boolean | No | Whether the list should be locked |

### DeleteTodoListInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | The workspace ID (for verification) |
| `todoListId` | String! | ✅ Yes | The ID of the list to delete |

### TodoListsFilterInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyIds` | [String!]! | ✅ Yes | Filter by organization IDs |
| `projectIds` | [String!] | No | Filter by specific workspace IDs |
| `ids` | [String!] | No | Filter by specific list IDs |
| `titles` | [String!] | No | Filter by list titles |
| `search` | String | No | Search lists by title |

### TodoListsSort Values

| Value | Description |
|-------|-------------|
| `title_ASC` | Sort by title ascending |
| `title_DESC` | Sort by title descending |
| `createdAt_ASC` | Sort by creation date ascending |
| `createdAt_DESC` | Sort by creation date descending |
| `updatedAt_ASC` | Sort by update date ascending |
| `updatedAt_DESC` | Sort by update date descending |
| `position_ASC` | Sort by position ascending (default) |
| `position_DESC` | Sort by position descending |

## Response Types

### TodoList Type

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier |
| `uid` | String! | User-friendly identifier |
| `position` | Float! | List position for ordering |
| `title` | String! | List name |
| `isDisabled` | Boolean! | Whether the list is disabled |
| `isLocked` | Boolean | Whether the list is locked |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |
| `activity` | Activity | Associated activity log |
| `createdBy` | User | User who created the list |
| `project` | Project! | Parent workspace |
| `todos` | [Todo!]! | Todos in this list |
| `todosCount` | Int! | Number of todos |

### TodoListsPagination Type

| Field | Type | Description |
|-------|------|-------------|
| `items` | [TodoList!]! | Array of todo lists |
| `pageInfo` | PageInfo! | Pagination information |

## Required Permissions

### Query Permissions

| Operation | Required Permission |
|-----------|-------------------|
| `todoList` | Must be authenticated |
| `todoLists` | Must be authenticated and in organization |
| `todoListQueries.todoLists` | Must be authenticated and in organization |

### Mutation Permissions

| Operation | Workspace-Level Roles Allowed |
|-----------|------------------------------|
| `createTodoList` | OWNER, ADMIN, MEMBER |
| `editTodoList` | OWNER, ADMIN, MEMBER, CLIENT |
| `deleteTodoList` | OWNER, ADMIN, MEMBER |
| `markTodoListAsDone` | OWNER, ADMIN, MEMBER |
| `markTodoListAsUndone` | OWNER, ADMIN, MEMBER |

**Note:** Users with CLIENT role can edit lists but cannot create or delete them. Users with VIEW_ONLY or COMMENT_ONLY roles cannot create, edit, or delete lists.

## Error Responses

### TodoListNotFoundError
```json
{
  "errors": [{
    "message": "Todo list was not found.",
    "extensions": {
      "code": "TODO_LIST_NOT_FOUND"
    }
  }]
}
```

### WorkspaceNotFoundError
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```

### Maximum Lists Error
```json
{
  "errors": [{
    "message": "You have reached the maximum number of todo lists for this project.",
    "extensions": {
      "code": "INTERNAL_SERVER_ERROR"
    }
  }]
}
```

### UnauthorizedError
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

## Important Notes

- **List Limit**: Each workspace can have a maximum of 50 lists
- **Soft Delete**: Deleted lists are moved to trash and can potentially be recovered
- **Position Management**: When creating lists, ensure positions don't conflict. Use incremental values (1.0, 2.0, 3.0) to allow insertion between lists
- **Role-Based Access**: Lists can be hidden from certain roles using ProjectUserRoleTodoList permissions
- **Webhooks**: List creation, updates, and deletion trigger webhooks if configured
- **Activity Tracking**: All list operations are logged in the activity feed
- **Real-time Updates**: List changes are published via subscriptions for real-time updates

## Related Operations

- Use `todos` query to fetch todos within a list
- Use `createTodo` mutation to add todos to a list
- Use `moveTodo` mutation to move todos between lists
- Subscribe to list changes using `subscribeToTodoList` subscription

### /api/workspaces/rename-workspace

Source: https://blue.cc/api/workspaces/rename-workspace

## Rename a Workspace

Updates the name and other properties of an existing workspace. When the name is changed, the workspace slug will be automatically regenerated based on the new name.

### Basic Example

```graphql
mutation RenameProject {
  editProject(input: {
    projectId: "project_abc123"
    name: "Q2 Marketing Campaign"
  }) {
    id
    name
    slug
  }
}
```

### Advanced Example

```graphql
mutation EditProjectAdvanced {
  editProject(input: {
    projectId: "project_abc123"
    name: "Q2 Marketing Campaign"
    description: "Campaign for Q2 product launch"
    color: "#3B82F6"
    icon: "campaign"
    category: MARKETING
    todoAlias: "Task"
    hideRecordCount: false
  }) {
    id
    name
    slug
    description
    color
    icon
    category
    todoAlias
    hideRecordCount
  }
}
```

## Input Parameters

### EditProjectInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | The ID of the workspace to edit |
| `name` | String | No | The new name for the workspace |
| `slug` | String | No | Custom URL-friendly slug (auto-generated if not provided) |
| `description` | String | No | Workspace description |
| `color` | String | No | Hex color code for the workspace (e.g., #3B82F6) |
| `icon` | String | No | Icon identifier for the workspace |
| `category` | ProjectCategory | No | Workspace category |
| `todoAlias` | String | No | Custom name for records in this workspace |
| `hideRecordCount` | Boolean | No | Whether to hide record counts in UI |
| `showTimeSpentInTodoList` | Boolean | No | Display time tracking in lists |
| `showTimeSpentInProject` | Boolean | No | Display time tracking in workspace view |
| `image` | ImageInput | No | Workspace image/cover |
| `todoFields` | [TodoFieldInput] | No | Custom field configurations |
| `coverConfig` | TodoCoverConfigInput | No | Cover display configuration |
| `features` | [ProjectFeatureInput] | No | Feature toggles for the workspace |
| `sequenceCustomFieldId` | String | No | Custom field to use for record sequencing |

### ProjectCategory Values

| Value | Description |
|-------|-------------|
| `PERSONAL` | Personal workspaces |
| `BUSINESS` | Business workspaces |
| `MARKETING` | Marketing campaigns |
| `DEVELOPMENT` | Development workspaces |
| `DESIGN` | Design workspaces |
| `OPERATIONS` | Operational tasks |
| `SALES` | Sales activities |
| `SUPPORT` | Support tickets |
| `FINANCE` | Financial tracking |
| `HR` | Human resources |
| `LEGAL` | Legal matters |
| `PROCUREMENT` | Procurement processes |

## Response Fields

Returns the updated Workspace object with all fields. Key fields include:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Workspace ID |
| `name` | String! | Workspace name |
| `slug` | String! | URL-friendly slug |
| `description` | String | Workspace description |
| `color` | String | Hex color code |
| `icon` | String | Icon identifier |
| `category` | ProjectCategory | Workspace category |
| `todoAlias` | String | Custom record name |
| `hideRecordCount` | Boolean! | Record count visibility setting |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |

## Required Permissions

| Role | Can Edit Workspace |
|------|-------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |

## Error Responses

### Workspace Not Found
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to edit this project",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

## Important Notes

- **Slug Generation**: Workspace slugs are automatically generated when name changes. You can also provide a custom slug
- **Slug Conflicts**: If a slug conflicts with existing organization slugs, the system will append numbers (e.g., `my-workspace-1`)
- **HTML Sanitization**: HTML tags are automatically stripped from description fields for security
- **Partial Updates**: All fields are optional except `projectId` - only provide fields you want to update
- **Categories**: Use ProjectCategory enum values for the category field
- **Image Handling**: Supports uploading, updating, or removing workspace images via ImageInput

## Related Operations

- [Create Workspace](/api/workspaces/create-workspace) - Create a new workspace
- [List Workspaces](/api/workspaces/list-workspaces) - Get all workspaces
- [Delete Workspace](/api/workspaces/delete-workspace) - Delete a workspace
- [Archive Workspace](/api/workspaces/archive-workspace) - Archive/unarchive workspaces

### /api/workspaces/templates

Source: https://blue.cc/api/workspaces/templates

## Templates Overview

Blue supports two types of templates:
- **Organization Templates**: Created by your organization for internal use
- **Official Templates**: Created by Blue for all users (industry-standard templates)

Templates preserve the entire workspace structure including todos, lists, custom fields, automations, and more.

## List Templates

### Using the templates Query

```graphql
query GetTemplates {
  templates(
    companyId: "company-123"
    isOfficialTemplate: false
    category: MARKETING
  ) {
    id
    name
    description
    category
    isOfficialTemplate
    icon
    color
    image {
      thumbnail
      small
    }
  }
}
```

### Using projectList with Template Filter

```graphql
query ListTemplates {
  projectList(
    filter: {
      companyIds: ["company-id"]
      isTemplate: true
    }
    sort: [updatedAt_DESC]
    take: 20
    skip: 0
  ) {
    items {
      id
      slug
      name
      description
      category
      isTemplate
      isOfficialTemplate
      color
      icon
      createdAt
      updatedAt
    }
    pageInfo {
      hasNextPage
      totalItems
    }
    totalCount
  }
}
```

## Create Workspace from Template

To create a new workspace from an existing template:

```graphql
mutation CreateFromTemplate {
  createProject(
    input: {
      templateId: "template-id-or-slug"
      name: "Q1 Marketing Campaign"
      companyId: "company-id"
      description: "Marketing initiatives for Q1"
      color: "#10B981"
    }
  ) {
    id
    name
    slug
  }
}
```

<Callout variant="info">
Creating from a template is an asynchronous process. The workspace is created immediately, but content is copied in the background. Use the `copyProjectStatus` query to track progress.
</Callout>

## Convert Workspace to Template

Transform an existing workspace into a reusable template:

```graphql
mutation ConvertToTemplate {
  convertProjectToTemplate(
    input: {
      projectId: "project-123"
      isOfficialTemplate: false
    }
  ) {
    id
    name
    isTemplate
    isOfficialTemplate
  }
}
```

## Remove Template Status

Convert a template back to a regular workspace:

```graphql
mutation RemoveTemplateStatus {
  removeProjectFromTemplates(projectId: "template-123") {
    id
    name
    isTemplate
  }
}
```

## Get Single Template

Retrieve details about a specific template:

```graphql
query GetTemplate {
  template(templateId: "template-123") {
    id
    name
    description
    category
    isOfficialTemplate
    todoLists {
      name
      todos {
        title
      }
    }
  }
}
```

## Query Parameters

### templates Query

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | String | No | Filter templates by organization. Omit to see official templates. |
| `isOfficialTemplate` | Boolean | No | Show only official Blue templates |
| `category` | ProjectCategory | No | Filter by workspace category |

### convertProjectToTemplate Input

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | The workspace to convert to a template |
| `isOfficialTemplate` | Boolean! | ✅ Yes | Mark as official template (Blue employees only) |

### Template Categories

| Value | Description |
|-------|-------------|
| `CRM` | Customer Relationship Management |
| `CROSS_FUNCTIONAL` | Cross-functional team workspaces |
| `CUSTOMER_SUCCESS` | Customer success initiatives |
| `DESIGN` | Design and creative workspaces |
| `ENGINEERING` | Engineering and development |
| `GENERAL` | General workspaces (default) |
| `HR` | Human Resources |
| `IT` | Information Technology |
| `MARKETING` | Marketing campaigns |
| `OPERATIONS` | Operations and logistics |
| `PRODUCT` | Product management |
| `SALES` | Sales and business development |

## What Gets Copied from Templates

When creating a workspace from a template, the following is copied:

- ✅ **Structure**: All todo lists and todos with their positions
- ✅ **Content**: Descriptions, comments, and attachments
- ✅ **Organization**: Tags, labels, and custom fields
- ✅ **Automation**: All automation rules and workflows
- ✅ **Forms**: Workspace forms and their configurations
- ✅ **Documents**: Wiki pages and documentation
- ✅ **Settings**: Cover configurations and display preferences
- ✅ **Roles**: User role definitions (but not user assignments)

Not copied:
- ❌ User assignments (except the creator)
- ❌ Activity history
- ❌ Time tracking data
- ❌ Completed status of todos

## Required Permissions

### Creating Templates

| Action | Required Role |
|--------|--------------|
| Convert workspace to template | Workspace `OWNER` or `ADMIN` |
| Create official template | Blue employee only |
| Remove template status | Workspace `OWNER` or `ADMIN` |

### Using Templates

| Template Type | Who Can Use |
|--------------|-------------|
| Organization templates | Users in the same organization |
| Official templates | All Blue users |

## Error Responses

### Template Not Found
```json
{
  "errors": [{
    "message": "Template not found",
    "extensions": {
      "code": "TEMPLATE_NOT_FOUND"
    }
  }]
}
```

### Too Many Todos
```json
{
  "errors": [{
    "message": "This project has more than 250,000 todos and cannot be used as a template",
    "extensions": {
      "code": "TOO_MANY_TODOS"
    }
  }]
}
```

## Important Notes

- **Size Limit**: Workspaces with more than 250,000 todos cannot be used as templates
- **Async Copying**: Template content is copied in the background via job queue
- **Archive Status**: Converting to template automatically unarchives the workspace
- **Folder Removal**: Templates are removed from folders when converted
- **Access Control**: Official templates are visible to all, organization templates only to members
- **Real-time Updates**: Subscribe to template changes using the `subscribeToProject` subscription

### /api/workspaces/workspace-activity

Source: https://blue.cc/api/workspaces/workspace-activity

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
