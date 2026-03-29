# `AutomationActionUpdateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `type` | `AutomationActionType` | `` |  |
| `duedIn` | `Int` | `` |  |
| `todoList` | `TodoListUpdateOneWithoutAutomationActionsInput` | `` |  |
| `automationActionTags` | `AutomationActionTagUpdateManyWithoutAutomationActionInput` | `` |  |
| `automationActionAssignees` | `AutomationActionAssigneeUpdateManyWithoutAutomationActionInput` | `` |  |
| `automation` | `AutomationUpdateOneRequiredWithoutActionsInput` | `` |  |
| `metadata` | `String` | `` |  |
