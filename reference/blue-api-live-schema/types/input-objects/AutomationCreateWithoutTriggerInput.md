# `AutomationCreateWithoutTriggerInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `actions` | `AutomationActionCreateManyWithoutAutomationInput` | `` |  |
| `isActive` | `Boolean` | `` |  |
| `project` | `ProjectCreateOneWithoutAutomationsInput!` | `` |  |
| `createdBy` | `UserCreateOneWithoutAutomationsInput` | `` |  |
