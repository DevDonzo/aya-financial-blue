---
title: Recurring Records
description: Create, update, and delete recurring (repeating) schedules on records to automatically generate copies on a defined cadence.
icon: Repeat
---

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
