# `TagUpdateWithoutTodoTagsDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `color` | `String` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutTagsInput` | `` |  |
| `formTags` | `FormTagUpdateManyWithoutTagInput` | `` |  |
| `automationTriggerTags` | `AutomationTriggerTagUpdateManyWithoutTagInput` | `` |  |
| `automationActionTags` | `AutomationActionTagUpdateManyWithoutTagInput` | `` |  |
