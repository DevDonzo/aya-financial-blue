# `AutomationCreateWithoutActionsInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `trigger` | `AutomationTriggerCreateOneWithoutAutomationInput!` | `` |  |
| `isActive` | `Boolean` | `` |  |
| `project` | `ProjectCreateOneWithoutAutomationsInput!` | `` |  |
| `createdBy` | `UserCreateOneWithoutAutomationsInput` | `` |  |
