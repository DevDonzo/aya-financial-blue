# `TodoUpdateWithoutTodoTagsDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `position` | `Float` | `` |  |
| `title` | `String` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `timezone` | `String` | `` |  |
| `text` | `String` | `` |  |
| `html` | `String` | `` |  |
| `archived` | `Boolean` | `` |  |
| `done` | `Boolean` | `` |  |
| `todoList` | `TodoListUpdateOneRequiredWithoutTodosInput` | `` |  |
| `todoUsers` | `TodoUserUpdateManyWithoutTodoInput` | `` |  |
| `activity` | `ActivityUpdateOneWithoutTodoInput` | `` |  |
| `createdBy` | `UserUpdateOneWithoutTodosInput` | `` |  |
| `comments` | `CommentUpdateManyWithoutTodoInput` | `` |  |
| `actions` | `TodoActionUpdateManyWithoutTodoInput` | `` |  |
| `todoCustomFields` | `TodoCustomFieldUpdateManyWithoutTodoInput` | `` |  |
| `files` | `FileUpdateManyWithoutTodoInput` | `` |  |
| `checklists` | `ChecklistUpdateManyWithoutTodoInput` | `` |  |
