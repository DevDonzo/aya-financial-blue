# `Form`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

Arguments:
No arguments.

### `title`

- Type: `String!`

Arguments:
No arguments.

### `description`

- Type: `String`

Arguments:
No arguments.

### `footerText`

- Type: `String`

Arguments:
No arguments.

### `showFooter`

- Type: `Boolean`

Arguments:
No arguments.

### `isActive`

- Type: `Boolean!`

Arguments:
No arguments.

### `theme`

- Type: `String!`

Arguments:
No arguments.

### `primaryColor`

- Type: `String!`

Arguments:
No arguments.

### `hideBranding`

- Type: `Boolean!`

Arguments:
No arguments.

### `responseText`

- Type: `String`

Arguments:
No arguments.

### `submitText`

- Type: `String`

Arguments:
No arguments.

### `imageURL`

- Type: `String`

Arguments:
No arguments.

### `redirectURL`

- Type: `String`

Arguments:
No arguments.

### `snapshotURL`

- Type: `String`

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

### `createdBy`

- Type: `User!`

Arguments:
No arguments.

### `formFields`

- Type: `[FormField!]!`

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

### `assignees`

- Type: `[User!]!`

Arguments:
No arguments.

### `tags`

- Type: `[Tag!]!`

Arguments:
No arguments.

### `todoList`

- Type: `TodoList`

Arguments:
No arguments.

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `formTags`

- Type: `[FormTag!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FormTagWhereInput` | `` |  |
| `orderBy` | `FormTagOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `formUsers`

- Type: `[FormUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FormUserWhereInput` | `` |  |
| `orderBy` | `FormUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `project`

- Type: `Project!`

Arguments:
No arguments.
