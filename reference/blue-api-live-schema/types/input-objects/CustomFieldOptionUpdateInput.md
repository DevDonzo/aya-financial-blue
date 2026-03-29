# `CustomFieldOptionUpdateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `color` | `String` | `` |  |
| `position` | `Float` | `` |  |
| `customField` | `CustomFieldUpdateOneRequiredWithoutCustomFieldOptionsInput` | `` |  |
| `todoCustomField` | `TodoCustomFieldUpdateOneWithoutCustomFieldOptionInput` | `` |  |
| `todoCustomFieldOptions` | `TodoCustomFieldOptionUpdateManyWithoutCustomFieldOptionInput` | `` |  |
