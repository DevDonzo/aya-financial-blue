# `AutomationTriggerCreateWithoutTodoListInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `type` | `AutomationTriggerType!` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagCreateManyWithoutAutomationTriggerInput` | `` |  |
| `automationTriggerAssignees` | `AutomationTriggerAssigneeCreateManyWithoutAutomationTriggerInput` | `` |  |
| `automation` | `AutomationCreateOneWithoutTriggerInput!` | `` |  |
| `metadata` | `String` | `` |  |
