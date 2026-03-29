# `Checklist`

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

### `position`

- Type: `Float!`

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

### `todo`

- Type: `Todo!`

Arguments:
No arguments.

### `checklistItems`

- Type: `[ChecklistItem!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ChecklistItemWhereInput` | `` |  |
| `orderBy` | `ChecklistItemOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `createdBy`

- Type: `User!`

Arguments:
No arguments.

### `uid`

- Type: `String!`

Arguments:
No arguments.
