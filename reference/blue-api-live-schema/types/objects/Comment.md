# `Comment`

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

### `html`

- Type: `String!`

Arguments:
No arguments.

### `text`

- Type: `String!`

Arguments:
No arguments.

### `category`

- Type: `CommentCategory!`

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

### `deletedAt`

- Type: `DateTime`

Arguments:
No arguments.

### `deletedBy`

- Type: `User`

Arguments:
No arguments.

### `activity`

- Type: `Activity`

Arguments:
No arguments.

### `user`

- Type: `User!`

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

### `isRead`

- Type: `Boolean`

Arguments:
No arguments.

### `isSeen`

- Type: `Boolean`

Arguments:
No arguments.

### `aiSummary`

- Type: `Boolean`

Arguments:
No arguments.

### `parentId`

- Type: `String`

Arguments:
No arguments.

### `parent`

- Type: `Comment`

Arguments:
No arguments.

### `replies`

- Type: `[Comment!]!`

Arguments:
No arguments.

### `replyCount`

- Type: `Int!`

Arguments:
No arguments.

### `files`

- Type: `[File!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FileWhereInput` | `` |  |
| `orderBy` | `FileOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
