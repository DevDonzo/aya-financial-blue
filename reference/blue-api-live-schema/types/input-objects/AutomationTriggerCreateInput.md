# `AutomationTriggerCreateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `type` | `AutomationTriggerType!` | `` |  |
| `todoList` | `TodoListCreateOneWithoutAutomationTriggersInput` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagCreateManyWithoutAutomationTriggerInput` | `` |  |
| `automationTriggerAssignees` | `AutomationTriggerAssigneeCreateManyWithoutAutomationTriggerInput` | `` |  |
| `automation` | `AutomationCreateOneWithoutTriggerInput!` | `` |  |
| `metadata` | `String` | `` |  |
