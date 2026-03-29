# `CompanyUser`

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

### `company`

- Type: `Company!`

Arguments:
No arguments.

### `user`

- Type: `User!`

Arguments:
No arguments.

### `level`

- Type: `UserAccessLevel!`

Arguments:
No arguments.

### `allowNotification`

- Type: `Boolean!`

Arguments:
No arguments.

### `companyUserNotificationOptions`

- Type: `[CompanyUserNotificationOption!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CompanyUserNotificationOptionWhereInput` | `` |  |
| `orderBy` | `CompanyUserNotificationOptionOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `companyUserFolders`

- Type: `[CompanyUserFolder!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CompanyUserFolderWhereInput` | `` |  |
| `orderBy` | `CompanyUserFolderOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

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
