# `CustomFieldCreateWithoutCustomFieldOptionsInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `name` | `String!` | `` |  |
| `type` | `CustomFieldType!` | `` |  |
| `position` | `Float!` | `` |  |
| `description` | `String` | `` |  |
| `min` | `Float` | `` |  |
| `max` | `Float` | `` |  |
| `currency` | `String` | `` |  |
| `prefix` | `String` | `` |  |
| `project` | `ProjectCreateOneWithoutCustomFieldsInput!` | `` |  |
| `todoCustomFields` | `TodoCustomFieldCreateManyWithoutCustomFieldInput` | `` |  |
| `activity` | `ActivityCreateOneWithoutCustomFieldInput` | `` |  |
| `todoActions` | `TodoActionCreateManyWithoutCustomFieldInput` | `` |  |
| `formFields` | `FormFieldCreateManyWithoutCustomFieldInput` | `` |  |
