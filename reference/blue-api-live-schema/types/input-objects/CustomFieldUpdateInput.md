# `CustomFieldUpdateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `name` | `String` | `` |  |
| `type` | `CustomFieldType` | `` |  |
| `position` | `Float` | `` |  |
| `description` | `String` | `` |  |
| `min` | `Float` | `` |  |
| `max` | `Float` | `` |  |
| `currency` | `String` | `` |  |
| `prefix` | `String` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutCustomFieldsInput` | `` |  |
| `customFieldOptions` | `CustomFieldOptionUpdateManyWithoutCustomFieldInput` | `` |  |
| `todoCustomFields` | `TodoCustomFieldUpdateManyWithoutCustomFieldInput` | `` |  |
| `activity` | `ActivityUpdateOneWithoutCustomFieldInput` | `` |  |
| `todoActions` | `TodoActionUpdateManyWithoutCustomFieldInput` | `` |  |
| `formFields` | `FormFieldUpdateManyWithoutCustomFieldInput` | `` |  |
