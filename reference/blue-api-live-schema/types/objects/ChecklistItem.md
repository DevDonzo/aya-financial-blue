# `ChecklistItem`

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

### `done`

- Type: `Boolean!`

Arguments:
No arguments.

### `startedAt`

- Type: `DateTime`

Arguments:
No arguments.

### `duedAt`

- Type: `DateTime`

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

### `checklist`

- Type: `Checklist!`

Arguments:
No arguments.

### `createdBy`

- Type: `User!`

Arguments:
No arguments.

### `users`

- Type: `[User!]!`

Arguments:
No arguments.

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `checklistItemUsers`

- Type: `[ChecklistItemUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ChecklistItemUserWhereInput` | `` |  |
| `orderBy` | `ChecklistItemUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
