# `AutomationActionCreateWithoutAutomationActionAssigneesInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `type` | `AutomationActionType!` | `` |  |
| `duedIn` | `Int` | `` |  |
| `todoList` | `TodoListCreateOneWithoutAutomationActionsInput` | `` |  |
| `automationActionTags` | `AutomationActionTagCreateManyWithoutAutomationActionInput` | `` |  |
| `automation` | `AutomationCreateOneWithoutActionsInput!` | `` |  |
| `metadata` | `String` | `` |  |
