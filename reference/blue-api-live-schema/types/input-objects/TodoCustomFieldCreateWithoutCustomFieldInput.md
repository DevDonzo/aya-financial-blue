# `TodoCustomFieldCreateWithoutCustomFieldInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `todo` | `TodoCreateOneWithoutTodoCustomFieldsInput!` | `` |  |
| `number` | `Float` | `` |  |
| `text` | `String` | `` |  |
| `regionCode` | `String` | `` |  |
| `countryCodes` | `String` | `` |  |
| `checked` | `Boolean` | `` |  |
| `latitude` | `Float` | `` |  |
| `longitude` | `Float` | `` |  |
| `customFieldOption` | `CustomFieldOptionCreateOneWithoutTodoCustomFieldInput` | `` |  |
| `todoCustomFieldOptions` | `TodoCustomFieldOptionCreateManyWithoutTodoCustomFieldInput` | `` |  |
| `todoCustomFieldFiles` | `TodoCustomFieldFileCreateManyWithoutTodoCustomFieldInput` | `` |  |
