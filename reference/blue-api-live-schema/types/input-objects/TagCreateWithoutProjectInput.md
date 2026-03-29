# `TagCreateWithoutProjectInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String` | `` |  |
| `color` | `String!` | `` |  |
| `todoTags` | `TodoTagCreateManyWithoutTagInput` | `` |  |
| `formTags` | `FormTagCreateManyWithoutTagInput` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagCreateManyWithoutTagInput` | `` |  |
| `automationActionTags` | `AutomationActionTagCreateManyWithoutTagInput` | `` |  |
