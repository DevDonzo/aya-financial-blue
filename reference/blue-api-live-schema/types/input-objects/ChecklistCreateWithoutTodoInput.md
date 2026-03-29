# `ChecklistCreateWithoutTodoInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String!` | `` |  |
| `position` | `Float!` | `` |  |
| `createdBy` | `UserCreateOneWithoutChecklistsInput!` | `` |  |
| `checklistItems` | `ChecklistItemCreateManyWithoutChecklistInput` | `` |  |
