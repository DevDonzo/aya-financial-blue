# `Tag`

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

### `title`

- Type: `String!`

Arguments:
No arguments.

### `color`

- Type: `String!`

Arguments:
No arguments.

### `todos`

- Type: `[Todo!]!`

Arguments:
No arguments.

### `project`

- Type: `Project!`

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

### `todoTags`

- Type: `[TodoTag!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoTagWhereInput` | `` |  |
| `orderBy` | `TodoTagOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

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

### `automationTriggerTags`

- Type: `[AutomationTriggerTag!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationTriggerTagWhereInput` | `` |  |
| `orderBy` | `AutomationTriggerTagOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automationActionTags`

- Type: `[AutomationActionTag!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationActionTagWhereInput` | `` |  |
| `orderBy` | `AutomationActionTagOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
