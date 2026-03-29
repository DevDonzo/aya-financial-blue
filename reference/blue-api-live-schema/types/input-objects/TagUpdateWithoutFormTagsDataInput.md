# `TagUpdateWithoutFormTagsDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `color` | `String` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutTagsInput` | `` |  |
| `todoTags` | `TodoTagUpdateManyWithoutTagInput` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagUpdateManyWithoutTagInput` | `` |  |
| `automationActionTags` | `AutomationActionTagUpdateManyWithoutTagInput` | `` |  |
