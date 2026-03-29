# `TodoCreateWithoutTodoCustomFieldsInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `position` | `Float!` | `` |  |
| `title` | `String!` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `timezone` | `String` | `` |  |
| `text` | `String` | `` |  |
| `html` | `String` | `` |  |
| `archived` | `Boolean` | `` |  |
| `done` | `Boolean` | `` |  |
| `todoList` | `TodoListCreateOneWithoutTodosInput!` | `` |  |
| `todoUsers` | `TodoUserCreateManyWithoutTodoInput` | `` |  |
| `activity` | `ActivityCreateOneWithoutTodoInput` | `` |  |
| `createdBy` | `UserCreateOneWithoutTodosInput` | `` |  |
| `comments` | `CommentCreateManyWithoutTodoInput` | `` |  |
| `actions` | `TodoActionCreateManyWithoutTodoInput` | `` |  |
| `todoTags` | `TodoTagCreateManyWithoutTodoInput` | `` |  |
| `files` | `FileCreateManyWithoutTodoInput` | `` |  |
| `checklists` | `ChecklistCreateManyWithoutTodoInput` | `` |  |
