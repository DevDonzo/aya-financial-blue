# `TodoListUpdateWithoutTodosDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `position` | `Float` | `` |  |
| `title` | `String` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutTodoListsInput` | `` |  |
| `activity` | `ActivityUpdateOneWithoutTodoListInput` | `` |  |
| `createdBy` | `UserUpdateOneWithoutTodoListsInput` | `` |  |
| `automationTriggers` | `AutomationTriggerUpdateManyWithoutTodoListInput` | `` |  |
| `automationActions` | `AutomationActionUpdateManyWithoutTodoListInput` | `` |  |
| `forms` | `FormUpdateManyWithoutTodoListInput` | `` |  |
