# `Activity`

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

### `category`

- Type: `ActivityCategory!`

Arguments:
No arguments.

### `isSeen`

- Type: `Boolean!`

Arguments:
No arguments.

### `isRead`

- Type: `Boolean!`

Arguments:
No arguments.

### `text`

- Type: `String!`
- Deprecated: yes
- Deprecation reason: Use `Activity.html` instead.

Arguments:
No arguments.

### `html`

- Type: `String!`

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

### `company`

- Type: `Company`

Arguments:
No arguments.

### `project`

- Type: `Project`

Arguments:
No arguments.

### `comment`

- Type: `Comment`

Arguments:
No arguments.

### `discussion`

- Type: `Discussion`

Arguments:
No arguments.

### `statusUpdate`

- Type: `StatusUpdate`

Arguments:
No arguments.

### `todo`

- Type: `Todo`

Arguments:
No arguments.

### `todoList`

- Type: `TodoList`

Arguments:
No arguments.

### `createdBy`

- Type: `User!`

Arguments:
No arguments.

### `inviteeEmail`

- Type: `String`

Arguments:
No arguments.

### `affectedBy`

- Type: `User`

Arguments:
No arguments.

### `metadata`

- Type: `String`

Arguments:
No arguments.

### `customField`

- Type: `CustomField`

Arguments:
No arguments.

### `userActivities`

- Type: `[UserActivity!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `UserActivityWhereInput` | `` |  |
| `orderBy` | `UserActivityOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `userAccessLevel`

- Type: `UserAccessLevel`

Arguments:
No arguments.

### `question`

- Type: `Question`

Arguments:
No arguments.
