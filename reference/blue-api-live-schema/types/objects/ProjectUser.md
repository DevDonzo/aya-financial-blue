# `ProjectUser`

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

### `project`

- Type: `Project!`

Arguments:
No arguments.

### `user`

- Type: `User!`

Arguments:
No arguments.

### `projectUserFolders`

- Type: `[ProjectUserFolder!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ProjectUserFolderWhereInput` | `` |  |
| `orderBy` | `ProjectUserFolderOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `level`

- Type: `UserAccessLevel!`

Arguments:
No arguments.

### `allowNotification`

- Type: `Boolean!`

Arguments:
No arguments.

### `position`

- Type: `Float`

Arguments:
No arguments.

### `lastAccessedAt`

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
