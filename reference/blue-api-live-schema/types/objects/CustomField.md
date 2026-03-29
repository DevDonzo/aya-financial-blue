# `CustomField`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

Arguments:
No arguments.

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `name`

- Type: `String!`

Arguments:
No arguments.

### `type`

- Type: `CustomFieldType!`

Arguments:
No arguments.

### `position`

- Type: `Float!`

Arguments:
No arguments.

### `buttonType`

- Type: `String`

Arguments:
No arguments.

### `buttonConfirmText`

- Type: `String`

Arguments:
No arguments.

### `buttonColor`

- Type: `String`

Arguments:
No arguments.

### `urlDisplayAsButton`

- Type: `Boolean`

Arguments:
No arguments.

### `urlButtonLabel`

- Type: `String`

Arguments:
No arguments.

### `urlButtonColor`

- Type: `String`

Arguments:
No arguments.

### `currencyFieldId`

- Type: `String`

Arguments:
No arguments.

### `conversionDateType`

- Type: `String`

Arguments:
No arguments.

### `conversionDate`

- Type: `String`

Arguments:
No arguments.

### `description`

- Type: `String`

Arguments:
No arguments.

### `min`

- Type: `Float`

Arguments:
No arguments.

### `max`

- Type: `Float`

Arguments:
No arguments.

### `latitude`

- Type: `Float`

Arguments:
No arguments.

### `longitude`

- Type: `Float`

Arguments:
No arguments.

### `startDate`

- Type: `DateTime`

Arguments:
No arguments.

### `endDate`

- Type: `DateTime`

Arguments:
No arguments.

### `timezone`

- Type: `String`

Arguments:
No arguments.

### `currency`

- Type: `String`

Arguments:
No arguments.

### `prefix`

- Type: `String`

Arguments:
No arguments.

### `isDueDate`

- Type: `Boolean`

Arguments:
No arguments.

### `formula`

- Type: `JSON`

Arguments:
No arguments.

### `createdAt`

- Type: `DateTime!`

Arguments:
No arguments.

### `updatedAt`

- Type: `DateTime!`

Arguments:
No arguments.

### `customFieldOptions`

- Type: `[CustomFieldOption!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CustomFieldOptionWhereInput` | `` |  |
| `orderBy` | `CustomFieldOptionOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `regionCode`

- Type: `String`

Arguments:
No arguments.

### `countryCodes`

- Type: `[String!]`

Arguments:
No arguments.

### `text`

- Type: `String`

Arguments:
No arguments.

### `number`

- Type: `Float`

Arguments:
No arguments.

### `checked`

- Type: `Boolean`

Arguments:
No arguments.

### `selectedOption`

- Type: `CustomFieldOption`

Arguments:
No arguments.

### `selectedOptions`

- Type: `[CustomFieldOption!]`

Arguments:
No arguments.

### `selectedTodos`

- Type: `[Todo!]`

Arguments:
No arguments.

### `files`

- Type: `[File!]`

Arguments:
No arguments.

### `value`

- Type: `JSON`

Arguments:
No arguments.

### `todo`

- Type: `Todo`

Arguments:
No arguments.

### `viewable`

- Type: `Boolean`

Arguments:
No arguments.

### `editable`

- Type: `Boolean`

Arguments:
No arguments.

### `projectUserRole`

- Type: `ProjectUserRole`

Arguments:
No arguments.

### `metadata`

- Type: `JSON`
- Deprecated: yes
- Deprecation reason: This field is no longer in use.

Arguments:
No arguments.

### `timeDurationDisplay`

- Type: `CustomFieldTimeDurationDisplayType`

Arguments:
No arguments.

### `timeDurationTargetTime`

- Type: `Float`

Arguments:
No arguments.

### `timeDurationStart`

- Type: `CustomFieldTimeDuration`

Arguments:
No arguments.

### `timeDurationEnd`

- Type: `CustomFieldTimeDuration`

Arguments:
No arguments.

### `referenceProject`

- Type: `Project`

Arguments:
No arguments.

### `referenceFilter`

- Type: `TodoFilter`

Arguments:
No arguments.

### `referenceMultiple`

- Type: `Boolean`

Arguments:
No arguments.

### `customFieldLookupOption`

- Type: `CustomFieldLookupOption`

Arguments:
No arguments.

### `useSequenceUniqueId`

- Type: `Boolean`

Arguments:
No arguments.

### `enableBulkAction`

- Type: `Boolean`

Arguments:
No arguments.

### `sequenceDigits`

- Type: `Int`

Arguments:
No arguments.

### `sequenceStartingNumber`

- Type: `Int`

Arguments:
No arguments.

### `sequenceId`

- Type: `Int`

Arguments:
No arguments.

### `automations`

- Type: `[Automation!]`

Arguments:
No arguments.

### `project`

- Type: `Project!`

Arguments:
No arguments.

### `todoCustomFields`

- Type: `[TodoCustomField!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoCustomFieldWhereInput` | `` |  |
| `orderBy` | `TodoCustomFieldOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `activity`

- Type: `Activity`

Arguments:
No arguments.

### `todoActions`

- Type: `[TodoAction!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoActionWhereInput` | `` |  |
| `orderBy` | `TodoActionOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `formFields`

- Type: `[FormField!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FormFieldWhereInput` | `` |  |
| `orderBy` | `FormFieldOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
