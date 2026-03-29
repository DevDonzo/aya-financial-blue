# `EditTodoInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `todoListId` | `String` | `` |  |
| `todoId` | `String!` | `` |  |
| `position` | `Float` | `` |  |
| `title` | `String` | `` |  |
| `html` | `String` | `` |  |
| `text` | `String` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `color` | `String` | `` |  |
| `cover` | `String` | `` |  |
| `tags` | `[CreateTodoTagInput!]` | `` | Tags to associate with this todo. Will replace existing tags. |
