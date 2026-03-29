# `NotificationOption`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

Arguments:
No arguments.

### `name`

- Type: `NotificationOptionName!`

Arguments:
No arguments.

### `description`

- Type: `String!`

Arguments:
No arguments.

### `position`

- Type: `Int!`

Arguments:
No arguments.

### `allowEmail`

- Type: `Boolean!`

Arguments:
No arguments.

### `allowPush`

- Type: `Boolean!`

Arguments:
No arguments.

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `companyUserNotificationOption`

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

### `createdAt`

- Type: `DateTime!`

Arguments:
No arguments.

### `updatedAt`

- Type: `DateTime!`

Arguments:
No arguments.
