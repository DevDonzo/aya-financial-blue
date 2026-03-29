# `TodoCustomFieldCreateWithoutTodoCustomFieldFilesInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `todo` | `TodoCreateOneWithoutTodoCustomFieldsInput!` | `` |  |
| `customField` | `CustomFieldCreateOneWithoutTodoCustomFieldsInput!` | `` |  |
| `number` | `Float` | `` |  |
| `text` | `String` | `` |  |
| `regionCode` | `String` | `` |  |
| `countryCodes` | `String` | `` |  |
| `checked` | `Boolean` | `` |  |
| `latitude` | `Float` | `` |  |
| `longitude` | `Float` | `` |  |
| `customFieldOption` | `CustomFieldOptionCreateOneWithoutTodoCustomFieldInput` | `` |  |
| `todoCustomFieldOptions` | `TodoCustomFieldOptionCreateManyWithoutTodoCustomFieldInput` | `` |  |
