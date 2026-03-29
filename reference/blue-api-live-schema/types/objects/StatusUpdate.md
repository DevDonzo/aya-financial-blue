# `StatusUpdate`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

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

### `date`

- Type: `DateTime!`

Arguments:
No arguments.

### `category`

- Type: `StatusUpdateCategory!`

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

### `user`

- Type: `User!`

Arguments:
No arguments.

### `project`

- Type: `Project!`

Arguments:
No arguments.

### `comments`

- Type: `[Comment!]!`
- Deprecated: yes
- Deprecation reason: Use `Query.commentList` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `skip` | `Int` | `` |  |
| `orderBy` | `CommentOrderByInput` | `` |  |
| `where` | `CommentWhereInput` | `` |  |

### `commentCount`

- Type: `Int!`

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

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `activity`

- Type: `Activity`

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

### `question`

- Type: `Question`

Arguments:
No arguments.
