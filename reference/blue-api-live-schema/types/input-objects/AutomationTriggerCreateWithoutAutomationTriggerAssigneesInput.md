# `AutomationTriggerCreateWithoutAutomationTriggerAssigneesInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `type` | `AutomationTriggerType!` | `` |  |
| `todoList` | `TodoListCreateOneWithoutAutomationTriggersInput` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagCreateManyWithoutAutomationTriggerInput` | `` |  |
| `automation` | `AutomationCreateOneWithoutTriggerInput!` | `` |  |
| `metadata` | `String` | `` |  |
