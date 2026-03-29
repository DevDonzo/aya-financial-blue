# `Todo`

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

### `position`

- Type: `Float!`

Arguments:
No arguments.

### `title`

- Type: `String!`

Arguments:
No arguments.

### `text`

- Type: `String!`

Arguments:
No arguments.

### `html`

- Type: `String!`

Arguments:
No arguments.

### `todoList`

- Type: `TodoList!`

Arguments:
No arguments.

### `todoLists`

- Type: `[TodoList!]`

Arguments:
No arguments.

### `repeatingTodoList`

- Type: `TodoList`

Arguments:
No arguments.

### `users`

- Type: `[User!]!`

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

### `timezone`

- Type: `String`

Arguments:
No arguments.

### `color`

- Type: `String`

Arguments:
No arguments.

### `comments`

- Type: `[Comment!]!`
- Deprecated: yes
- Deprecation reason: Use `Query.commentList` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `orderBy` | `CommentOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `where` | `CommentWhereInput` | `` |  |

### `commentCount`

- Type: `Int!`

Arguments:
No arguments.

### `createdBy`

- Type: `User`

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

### `cover`

- Type: `String`

Arguments:
No arguments.

### `coverLocked`

- Type: `Boolean`

Arguments:
No arguments.

### `archived`

- Type: `Boolean!`

Arguments:
No arguments.

### `done`

- Type: `Boolean!`

Arguments:
No arguments.

### `actions`

- Type: `[TodoAction!]!`
- Deprecated: yes
- Deprecation reason: Use `Query.todoActions` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoActionWhereInput` | `` |  |
| `orderBy` | `TodoActionOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `todoTags`

- Type: `[TodoTag!]!`
- Deprecated: yes
- Deprecation reason: Use field tags instead.

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

### `tags`

- Type: `[Tag!]!`

Arguments:
No arguments.

### `checklists`

- Type: `[Checklist!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ChecklistWhereInput` | `` |  |
| `orderBy` | `ChecklistOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `checklistCount`

- Type: `Int!`

Arguments:
No arguments.

### `checklistCompletedCount`

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

### `customFields`

- Type: `[CustomField!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TodoCustomFieldFilterInput` | `` |  |

### `isRepeating`

- Type: `Boolean!`

Arguments:
No arguments.

### `repeating`

- Type: `JSON`

Arguments:
No arguments.

### `reminder`

- Type: `JSON`

Arguments:
No arguments.

### `dependOn`

- Type: `[Todo!]`

Arguments:
No arguments.

### `dependBy`

- Type: `[Todo!]`

Arguments:
No arguments.

### `referencedBy`

- Type: `[Todo!]`

Arguments:
No arguments.

### `timeTracking`

- Type: `TimeTracking`

Arguments:
No arguments.

### `completedAt`

- Type: `DateTime`

Arguments:
No arguments.

### `todoUsers`

- Type: `[TodoUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoUserWhereInput` | `` |  |
| `orderBy` | `TodoUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `activity`

- Type: `Activity`

Arguments:
No arguments.

### `todoCustomFields`

- Type: `[TodoCustomField!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoCustomFieldWhereInput` | `` |  |
| `orderBy` | `TodoCustomFieldOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

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
