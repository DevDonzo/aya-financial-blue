# `TodoCustomFieldUpdateWithoutTodoDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `customField` | `CustomFieldUpdateOneRequiredWithoutTodoCustomFieldsInput` | `` |  |
| `number` | `Float` | `` |  |
| `text` | `String` | `` |  |
| `regionCode` | `String` | `` |  |
| `countryCodes` | `String` | `` |  |
| `checked` | `Boolean` | `` |  |
| `latitude` | `Float` | `` |  |
| `longitude` | `Float` | `` |  |
| `customFieldOption` | `CustomFieldOptionUpdateOneWithoutTodoCustomFieldInput` | `` |  |
| `todoCustomFieldOptions` | `TodoCustomFieldOptionUpdateManyWithoutTodoCustomFieldInput` | `` |  |
| `todoCustomFieldFiles` | `TodoCustomFieldFileUpdateManyWithoutTodoCustomFieldInput` | `` |  |
