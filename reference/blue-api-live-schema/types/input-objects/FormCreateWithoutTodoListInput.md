# `FormCreateWithoutTodoListInput`

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
| `createdBy` | `UserCreateOneWithoutFormsInput!` | `` |  |
| `formTags` | `FormTagCreateManyWithoutFormInput` | `` |  |
| `formFields` | `FormFieldCreateManyWithoutFormInput` | `` |  |
| `formUsers` | `FormUserCreateManyWithoutFormInput` | `` |  |
| `project` | `ProjectCreateOneWithoutFormsInput!` | `` |  |
