# `Question`

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

### `frequency`

- Type: `QuestionFrequency!`

Arguments:
No arguments.

### `days`

- Type: `String!`

Arguments:
No arguments.

### `time`

- Type: `String!`

Arguments:
No arguments.

### `status`

- Type: `Boolean!`

Arguments:
No arguments.

### `questionUsers`

- Type: `[QuestionUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `QuestionUserWhereInput` | `` |  |
| `orderBy` | `QuestionUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `statusUpdates`

- Type: `[StatusUpdate!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `StatusUpdateWhereInput` | `` |  |
| `orderBy` | `StatusUpdateOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `createdBy`

- Type: `User!`

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

### `activity`

- Type: `Activity`

Arguments:
No arguments.
