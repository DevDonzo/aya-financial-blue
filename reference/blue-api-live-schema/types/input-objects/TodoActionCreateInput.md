# `TodoActionCreateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `todo` | `TodoCreateOneWithoutActionsInput!` | `` |  |
| `user` | `UserCreateOneInput` | `` |  |
| `type` | `TodoActionType!` | `` |  |
| `newValue` | `String` | `` |  |
| `oldValue` | `String` | `` |  |
| `affectedBy` | `UserCreateOneInput` | `` |  |
| `customField` | `CustomFieldCreateOneWithoutTodoActionsInput` | `` |  |
| `automated` | `Boolean` | `` |  |
