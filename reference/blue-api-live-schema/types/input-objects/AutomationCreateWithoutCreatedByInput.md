# `AutomationCreateWithoutCreatedByInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `trigger` | `AutomationTriggerCreateOneWithoutAutomationInput!` | `` |  |
| `actions` | `AutomationActionCreateManyWithoutAutomationInput` | `` |  |
| `isActive` | `Boolean` | `` |  |
| `project` | `ProjectCreateOneWithoutAutomationsInput!` | `` |  |
