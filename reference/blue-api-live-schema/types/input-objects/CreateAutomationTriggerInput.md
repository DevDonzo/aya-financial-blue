# `CreateAutomationTriggerInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `type` | `AutomationTriggerType!` | `` |  |
| `metadata` | `AutomationTriggerMetadataInput` | `` |  |
| `customFieldId` | `String` | `` |  |
| `customFieldOptionIds` | `[String!]` | `` |  |
| `todoListId` | `String` | `` |  |
| `todoListIds` | `[String!]` | `` |  |
| `tagIds` | `[String!]` | `` |  |
| `todoIds` | `[String!]` | `` |  |
| `assigneeIds` | `[String!]` | `` |  |
| `color` | `String` | `` |  |
| `dueStart` | `DateTime` | `` |  |
| `dueEnd` | `DateTime` | `` |  |
| `showCompleted` | `Boolean` | `` |  |
| `colors` | `[String!]` | `` |  |
| `fields` | `JSON` | `` |  |
| `op` | `FilterLogicalOperator` | `` |  |
| `conditionMode` | `ConditionalAutomationMode` | `` |  |
| `filterGroups` | `JSON` | `` |  |
| `filterGroupLinks` | `JSON` | `` |  |
| `schedule` | `CreateAutomationTriggerScheduleInput` | `` |  |
