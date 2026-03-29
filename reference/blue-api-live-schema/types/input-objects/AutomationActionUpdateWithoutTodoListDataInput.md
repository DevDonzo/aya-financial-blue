# `AutomationActionUpdateWithoutTodoListDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `type` | `AutomationActionType` | `` |  |
| `duedIn` | `Int` | `` |  |
| `automationActionTags` | `AutomationActionTagUpdateManyWithoutAutomationActionInput` | `` |  |
| `automationActionAssignees` | `AutomationActionAssigneeUpdateManyWithoutAutomationActionInput` | `` |  |
| `automation` | `AutomationUpdateOneRequiredWithoutActionsInput` | `` |  |
| `metadata` | `String` | `` |  |
