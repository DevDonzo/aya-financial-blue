# `TodosFilter`

- Kind: `INPUT_OBJECT`
- Description: The input `TodosFilter` is deprecated. Use `TodoFilterInput` instead.

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `companyIds` | `[String!]!` | `` |  |
| `projectIds` | `[String!]` | `` |  |
| `todoIds` | `[String!]` | `` |  |
| `assigneeIds` | `[String!]` | `` |  |
| `unassigned` | `Boolean` | `` |  |
| `tagIds` | `[String!]` | `` |  |
| `tagColors` | `[String!]` | `` |  |
| `tagTitles` | `[String!]` | `` |  |
| `todoListIds` | `[String!]` | `` |  |
| `todoListTitles` | `[String!]` | `` |  |
| `updatedAt_gt` | `DateTime` | `` |  |
| `updatedAt_gte` | `DateTime` | `` |  |
| `done` | `Boolean` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `duedAtStart` | `DateTime` | `` |  |
| `duedAtEnd` | `DateTime` | `` |  |
| `dueEnd` | `DateTime` | `` |  |
| `dueStart` | `DateTime` | `` |  |
| `search` | `String` | `` |  |
| `excludeArchivedProjects` | `Boolean` | `` |  |
| `coordinates` | `JSON` | `` |  |
| `fields` | `JSON` | `` |  |
| `q` | `String` | `` |  |
| `showCompleted` | `Boolean` | `` |  |
| `op` | `FilterLogicalOperator` | `` | Determine the logical operator to be used for `fields` input; if not provided, the `AND` operator is used. |
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
| `groups` | `[TodoFilterGroupInput!]` | `` | Nested filter groups. Each group contains its own set of filter conditions. When provided, flat filter fields above are ignored in favor of groups. |
| `groupLinks` | `[FilterLogicalOperator!]` | `` | Logical operators linking adjacent groups. Length should be groups.length - 1. If shorter, the last operator is repeated. |
