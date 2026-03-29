# `FormCreateWithoutCreatedByInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String!` | `` |  |
| `description` | `String` | `` |  |
| `isActive` | `Boolean!` | `` |  |
| `theme` | `String!` | `` |  |
| `primaryColor` | `String` | `` |  |
| `hideBranding` | `Boolean` | `` |  |
| `responseText` | `String` | `` |  |
| `submitText` | `String` | `` |  |
| `imageURL` | `String` | `` |  |
| `redirectURL` | `String` | `` |  |
| `snapshotURL` | `String` | `` |  |
| `formTags` | `FormTagCreateManyWithoutFormInput` | `` |  |
| `formFields` | `FormFieldCreateManyWithoutFormInput` | `` |  |
| `formUsers` | `FormUserCreateManyWithoutFormInput` | `` |  |
| `todoList` | `TodoListCreateOneWithoutFormsInput` | `` |  |
| `project` | `ProjectCreateOneWithoutFormsInput!` | `` |  |
