# `TodoListCreateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `position` | `Float!` | `` |  |
| `title` | `String!` | `` |  |
| `project` | `ProjectCreateOneWithoutTodoListsInput!` | `` |  |
| `todos` | `TodoCreateManyWithoutTodoListInput` | `` |  |
| `activity` | `ActivityCreateOneWithoutTodoListInput` | `` |  |
| `createdBy` | `UserCreateOneWithoutTodoListsInput` | `` |  |
| `automationTriggers` | `AutomationTriggerCreateManyWithoutTodoListInput` | `` |  |
| `automationActions` | `AutomationActionCreateManyWithoutTodoListInput` | `` |  |
| `forms` | `FormCreateManyWithoutTodoListInput` | `` |  |
