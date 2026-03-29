# `TodoListUpdateWithoutCreatedByDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `position` | `Float` | `` |  |
| `title` | `String` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutTodoListsInput` | `` |  |
| `todos` | `TodoUpdateManyWithoutTodoListInput` | `` |  |
| `activity` | `ActivityUpdateOneWithoutTodoListInput` | `` |  |
| `automationTriggers` | `AutomationTriggerUpdateManyWithoutTodoListInput` | `` |  |
| `automationActions` | `AutomationActionUpdateManyWithoutTodoListInput` | `` |  |
| `forms` | `FormUpdateManyWithoutTodoListInput` | `` |  |
