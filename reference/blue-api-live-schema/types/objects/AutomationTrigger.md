# `AutomationTrigger`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

Arguments:
No arguments.

### `type`

- Type: `AutomationTriggerType!`

Arguments:
No arguments.

### `metadata`

- Type: `AutomationTriggerMetadata`

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

### `todos`

- Type: `[CustomFieldReferenceTodo!]`

Arguments:
No arguments.

### `todoList`

- Type: `TodoList`

Arguments:
No arguments.

### `todoLists`

- Type: `[TodoList!]!`

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

### `color`

- Type: `String`

Arguments:
No arguments.

### `colors`

- Type: `[String!]`

Arguments:
No arguments.

### `dueStart`

- Type: `DateTime`

Arguments:
No arguments.

### `dueEnd`

- Type: `DateTime`

Arguments:
No arguments.

### `showCompleted`

- Type: `Boolean`

Arguments:
No arguments.

### `fields`

- Type: `JSON`

Arguments:
No arguments.

### `op`

- Type: `FilterLogicalOperator`

Arguments:
No arguments.

### `conditionMode`

- Type: `ConditionalAutomationMode`

Arguments:
No arguments.

### `filterGroups`

- Type: `JSON`

Arguments:
No arguments.

### `filterGroupLinks`

- Type: `JSON`

Arguments:
No arguments.

### `schedule`

- Type: `AutomationTriggerSchedule`

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

### `automationTriggerTags`

- Type: `[AutomationTriggerTag!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationTriggerTagWhereInput` | `` |  |
| `orderBy` | `AutomationTriggerTagOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automationTriggerAssignees`

- Type: `[AutomationTriggerAssignee!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationTriggerAssigneeWhereInput` | `` |  |
| `orderBy` | `AutomationTriggerAssigneeOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automation`

- Type: `Automation!`

Arguments:
No arguments.
