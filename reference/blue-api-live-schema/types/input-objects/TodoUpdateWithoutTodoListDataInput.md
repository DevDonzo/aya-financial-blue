# `TodoUpdateWithoutTodoListDataInput`

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
| `todoUsers` | `TodoUserUpdateManyWithoutTodoInput` | `` |  |
| `activity` | `ActivityUpdateOneWithoutTodoInput` | `` |  |
| `createdBy` | `UserUpdateOneWithoutTodosInput` | `` |  |
| `comments` | `CommentUpdateManyWithoutTodoInput` | `` |  |
| `actions` | `TodoActionUpdateManyWithoutTodoInput` | `` |  |
| `todoTags` | `TodoTagUpdateManyWithoutTodoInput` | `` |  |
| `todoCustomFields` | `TodoCustomFieldUpdateManyWithoutTodoInput` | `` |  |
| `files` | `FileUpdateManyWithoutTodoInput` | `` |  |
| `checklists` | `ChecklistUpdateManyWithoutTodoInput` | `` |  |
