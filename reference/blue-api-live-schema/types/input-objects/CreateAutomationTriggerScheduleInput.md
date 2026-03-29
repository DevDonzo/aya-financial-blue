# `CreateAutomationTriggerScheduleInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `type` | `AutomationScheduleType!` | `` |  |
| `hour` | `Int!` | `` |  |
| `minute` | `Int!` | `` |  |
| `timezone` | `String!` | `` |  |
| `days` | `[Int!]` | `` |  |
| `dayOfWeek` | `[Int!]` | `` |  |
| `dayOfMonth` | `Int` | `` |  |
| `month` | `Int` | `` |  |
| `cronExpression` | `String` | `` |  |
| `isActive` | `Boolean` | `` |  |
