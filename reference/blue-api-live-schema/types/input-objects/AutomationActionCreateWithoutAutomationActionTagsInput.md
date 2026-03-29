# `AutomationActionCreateWithoutAutomationActionTagsInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `type` | `AutomationActionType!` | `` |  |
| `duedIn` | `Int` | `` |  |
| `todoList` | `TodoListCreateOneWithoutAutomationActionsInput` | `` |  |
| `automationActionAssignees` | `AutomationActionAssigneeCreateManyWithoutAutomationActionInput` | `` |  |
| `automation` | `AutomationCreateOneWithoutActionsInput!` | `` |  |
| `metadata` | `String` | `` |  |
