---
title: Copy a Workspace
description: Create a complete copy of an existing workspace with configurable options for what to include.
icon: Copy
---

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
