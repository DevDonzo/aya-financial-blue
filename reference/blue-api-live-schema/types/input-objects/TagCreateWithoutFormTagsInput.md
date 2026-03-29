# `TagCreateWithoutFormTagsInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String` | `` |  |
| `color` | `String!` | `` |  |
| `project` | `ProjectCreateOneWithoutTagsInput!` | `` |  |
| `todoTags` | `TodoTagCreateManyWithoutTagInput` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagCreateManyWithoutTagInput` | `` |  |
| `automationActionTags` | `AutomationActionTagCreateManyWithoutTagInput` | `` |  |
