# `TodoFilterInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `assigneeIds` | `[String!]` | `` |  |
| `unassigned` | `Boolean` | `` |  |
| `colors` | `[String!]` | `` |  |
| `dueEnd` | `DateTime` | `` |  |
| `dueStart` | `DateTime` | `` |  |
| `showCompleted` | `Boolean` | `` |  |
| `projectIds` | `[String!]` | `` |  |
| `q` | `String` | `` |  |
| `tagIds` | `[String!]` | `` |  |
| `tagColors` | `[String!]` | `` |  |
| `tagTitles` | `[String!]` | `` |  |
| `todoListIds` | `[String!]` | `` |  |
| `todoListTitles` | `[String!]` | `` |  |
| `updatedAt_gt` | `DateTime` | `` |  |
| `updatedAt_gte` | `DateTime` | `` |  |
| `fields` | `JSON` | `` |  |
| `op` | `FilterLogicalOperator` | `` | Determine the logical operator to be used for `fields` input; if not provided, the `AND` operator is used. |
| `groups` | `[TodoFilterGroupInput!]` | `` | Nested filter groups. Each group contains its own set of filter conditions. When provided, flat filter fields above are ignored in favor of groups. |
| `groupLinks` | `[FilterLogicalOperator!]` | `` | Logical operators linking adjacent groups. Length should be groups.length - 1. If shorter, the last operator is repeated. |
| `notAssigneeIds` | `[String!]` | `` |  |
| `notTagIds` | `[String!]` | `` |  |
| `notColors` | `[String!]` | `` |  |
| `notTodoListIds` | `[String!]` | `` |  |
| `hasTag` | `Boolean` | `` |  |
| `hasColor` | `Boolean` | `` |  |
| `hasDueDate` | `Boolean` | `` |  |
| `hasDescription` | `Boolean` | `` |  |
| `hasChecklist` | `Boolean` | `` |  |
| `hasDependency` | `Boolean` | `` |  |
| `hasReference` | `Boolean` | `` |  |
| `createdStart` | `DateTime` | `` |  |
| `createdEnd` | `DateTime` | `` |  |
