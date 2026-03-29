---
title: Record Dependencies
description: Create, update, and delete dependencies between records (todos) in Blue to define blocking relationships.
icon: GitBranch
---

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
