# `TodoActionUpdateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `todo` | `TodoUpdateOneRequiredWithoutActionsInput` | `` |  |
| `user` | `UserUpdateOneInput` | `` |  |
| `type` | `TodoActionType` | `` |  |
| `newValue` | `String` | `` |  |
| `oldValue` | `String` | `` |  |
| `affectedBy` | `UserUpdateOneInput` | `` |  |
| `customField` | `CustomFieldUpdateOneWithoutTodoActionsInput` | `` |  |
| `automated` | `Boolean` | `` |  |
