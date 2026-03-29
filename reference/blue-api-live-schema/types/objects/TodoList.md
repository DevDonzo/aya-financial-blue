# `TodoList`

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

### `isDisabled`

- Type: `Boolean!`

Arguments:
No arguments.

### `isLocked`

- Type: `Boolean`

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

### `createdBy`

- Type: `User`

Arguments:
No arguments.

### `project`

- Type: `Project!`

Arguments:
No arguments.

### `todos`

- Type: `[Todo!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `search` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `skip` | `Int` | `` |  |
| `tagIds` | `[String!]` | `` |  |
| `assigneeIds` | `[String!]` | `` |  |
| `unassigned` | `Boolean` | `` |  |
| `duedAtStart` | `DateTime` | `` |  |
| `duedAtEnd` | `DateTime` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `orderBy` | `TodoOrderByInput` | `` |  |
| `done` | `Boolean` | `` |  |
| `fields` | `JSON` | `` |  |
| `op` | `FilterLogicalOperator` | `` |  |
| `where` | `TodoWhereInput` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `last` | `Int` | `` |  |

### `todosCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `search` | `String` | `` |  |
| `tagIds` | `[String!]` | `` |  |
| `assigneeIds` | `[String!]` | `` |  |
| `unassigned` | `Boolean` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `done` | `Boolean` | `` |  |
| `fields` | `JSON` | `` |  |
| `op` | `FilterLogicalOperator` | `` |  |

### `todosMaxPosition`

- Type: `Float!`

Arguments:
No arguments.

### `assignees`

- Type: `[User!]!`

Arguments:
No arguments.

### `tags`

- Type: `[Tag!]!`

Arguments:
No arguments.

### `completed`

- Type: `Boolean`

Arguments:
No arguments.

### `editable`

- Type: `Boolean`

Arguments:
No arguments.

### `deletable`

- Type: `Boolean`

Arguments:
No arguments.

### `automationTriggers`

- Type: `[AutomationTrigger!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationTriggerWhereInput` | `` |  |
| `orderBy` | `AutomationTriggerOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automationActions`

- Type: `[AutomationAction!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationActionWhereInput` | `` |  |
| `orderBy` | `AutomationActionOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `forms`

- Type: `[Form!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FormWhereInput` | `` |  |
| `orderBy` | `FormOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
