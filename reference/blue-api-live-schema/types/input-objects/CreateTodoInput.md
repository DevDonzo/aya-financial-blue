# `CreateTodoInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `todoListId` | `String` | `` |  |
| `title` | `String!` | `` |  |
| `position` | `Float` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `notify` | `Boolean` | `` |  |
| `description` | `String` | `` |  |
| `placement` | `CreateTodoInputPlacement` | `` |  |
| `assigneeIds` | `[String!]` | `` |  |
| `checklists` | `[CreateChecklistWithoutTodoInput!]` | `` |  |
| `customFields` | `[CreateTodoInputCustomField]` | `` |  |
| `tags` | `[CreateTodoTagInput!]` | `` |  |
