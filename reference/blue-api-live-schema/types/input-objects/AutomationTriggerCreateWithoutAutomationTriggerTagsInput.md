# `AutomationTriggerCreateWithoutAutomationTriggerTagsInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `type` | `AutomationTriggerType!` | `` |  |
| `todoList` | `TodoListCreateOneWithoutAutomationTriggersInput` | `` |  |
| `automationTriggerAssignees` | `AutomationTriggerAssigneeCreateManyWithoutAutomationTriggerInput` | `` |  |
| `automation` | `AutomationCreateOneWithoutTriggerInput!` | `` |  |
| `metadata` | `String` | `` |  |
