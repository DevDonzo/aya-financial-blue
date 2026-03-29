# `AutomationAction`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

Arguments:
No arguments.

### `type`

- Type: `AutomationActionType!`

Arguments:
No arguments.

### `duedIn`

- Type: `Int`

Arguments:
No arguments.

### `customField`

- Type: `CustomField`

Arguments:
No arguments.

### `customFieldOptions`

- Type: `[CustomFieldOption!]`

Arguments:
No arguments.

### `todoList`

- Type: `TodoList`

Arguments:
No arguments.

### `metadata`

- Type: `AutomationActionMetadata`

Arguments:
No arguments.

### `tags`

- Type: `[Tag!]`

Arguments:
No arguments.

### `assignees`

- Type: `[User!]`

Arguments:
No arguments.

### `projects`

- Type: `[Project!]`

Arguments:
No arguments.

### `color`

- Type: `String`

Arguments:
No arguments.

### `assigneeTriggerer`

- Type: `String`

Arguments:
No arguments.

### `portableDocument`

- Type: `PortableDocument`

Arguments:
No arguments.

### `httpOption`

- Type: `AutomationActionHttpOption`

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

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `automationActionTags`

- Type: `[AutomationActionTag!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationActionTagWhereInput` | `` |  |
| `orderBy` | `AutomationActionTagOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automationActionAssignees`

- Type: `[AutomationActionAssignee!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationActionAssigneeWhereInput` | `` |  |
| `orderBy` | `AutomationActionAssigneeOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automation`

- Type: `Automation!`

Arguments:
No arguments.
