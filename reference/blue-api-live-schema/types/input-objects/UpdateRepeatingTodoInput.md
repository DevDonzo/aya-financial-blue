# `UpdateRepeatingTodoInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `todoId` | `String!` | `` |  |
| `todoListId` | `String!` | `` |  |
| `type` | `RepeatingTodoRepeatType!` | `` |  |
| `fields` | `[RepeatingTodoAllowedField]!` | `` |  |
| `from` | `DateTime!` | `` |  |
| `interval` | `RepeatingTodoIntervalInput` | `` |  |
| `end` | `RepeatingTodoEndInput` | `` |  |
| `repeatCounts` | `Int` | `` |  |
