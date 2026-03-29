---
title: Create a Checklist
description: Create a new checklist on a record in Blue and query checklist items across your organization.
icon: CheckSquare
---

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
