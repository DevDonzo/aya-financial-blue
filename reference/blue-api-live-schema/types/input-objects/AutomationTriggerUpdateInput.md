# `AutomationTriggerUpdateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `type` | `AutomationTriggerType` | `` |  |
| `todoList` | `TodoListUpdateOneWithoutAutomationTriggersInput` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagUpdateManyWithoutAutomationTriggerInput` | `` |  |
| `automationTriggerAssignees` | `AutomationTriggerAssigneeUpdateManyWithoutAutomationTriggerInput` | `` |  |
| `automation` | `AutomationUpdateOneRequiredWithoutTriggerInput` | `` |  |
| `metadata` | `String` | `` |  |
