# `TodoListUpdateWithoutProjectDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `position` | `Float` | `` |  |
| `title` | `String` | `` |  |
| `todos` | `TodoUpdateManyWithoutTodoListInput` | `` |  |
| `activity` | `ActivityUpdateOneWithoutTodoListInput` | `` |  |
| `createdBy` | `UserUpdateOneWithoutTodoListsInput` | `` |  |
| `automationTriggers` | `AutomationTriggerUpdateManyWithoutTodoListInput` | `` |  |
| `automationActions` | `AutomationActionUpdateManyWithoutTodoListInput` | `` |  |
| `forms` | `FormUpdateManyWithoutTodoListInput` | `` |  |
