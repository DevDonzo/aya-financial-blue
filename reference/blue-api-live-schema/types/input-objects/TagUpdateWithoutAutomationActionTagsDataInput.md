# `TagUpdateWithoutAutomationActionTagsDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `color` | `String` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutTagsInput` | `` |  |
| `todoTags` | `TodoTagUpdateManyWithoutTagInput` | `` |  |
| `formTags` | `FormTagUpdateManyWithoutTagInput` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagUpdateManyWithoutTagInput` | `` |  |
