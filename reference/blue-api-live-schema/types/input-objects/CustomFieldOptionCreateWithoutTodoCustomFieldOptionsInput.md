# `CustomFieldOptionCreateWithoutTodoCustomFieldOptionsInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String` | `` |  |
| `color` | `String` | `` |  |
| `position` | `Float!` | `` |  |
| `customField` | `CustomFieldCreateOneWithoutCustomFieldOptionsInput!` | `` |  |
| `todoCustomField` | `TodoCustomFieldCreateOneWithoutCustomFieldOptionInput` | `` |  |
