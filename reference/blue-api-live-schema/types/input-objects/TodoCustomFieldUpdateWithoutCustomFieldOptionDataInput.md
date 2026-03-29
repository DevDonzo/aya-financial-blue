# `TodoCustomFieldUpdateWithoutCustomFieldOptionDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `todo` | `TodoUpdateOneRequiredWithoutTodoCustomFieldsInput` | `` |  |
| `customField` | `CustomFieldUpdateOneRequiredWithoutTodoCustomFieldsInput` | `` |  |
| `number` | `Float` | `` |  |
| `text` | `String` | `` |  |
| `regionCode` | `String` | `` |  |
| `countryCodes` | `String` | `` |  |
| `checked` | `Boolean` | `` |  |
| `latitude` | `Float` | `` |  |
| `longitude` | `Float` | `` |  |
| `todoCustomFieldOptions` | `TodoCustomFieldOptionUpdateManyWithoutTodoCustomFieldInput` | `` |  |
| `todoCustomFieldFiles` | `TodoCustomFieldFileUpdateManyWithoutTodoCustomFieldInput` | `` |  |
