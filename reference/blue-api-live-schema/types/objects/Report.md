# `Report`

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

### `title`

- Type: `String!`

Arguments:
No arguments.

### `description`

- Type: `String`

Arguments:
No arguments.

### `config`

- Type: `JSONObject`

Arguments:
No arguments.

### `company`

- Type: `Company!`

Arguments:
No arguments.

### `createdBy`

- Type: `User!`

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

### `lastGeneratedAt`

- Type: `DateTime`

Arguments:
No arguments.

### `dataSources`

- Type: `[ReportDataSource!]!`

Arguments:
No arguments.

### `reportUsers`

- Type: `[ReportUser!]!`

Arguments:
No arguments.

### `projectIds`

- Type: `[String!]`
- Description: Union of all project IDs from all data sources that the report creator has access to.
Returns all accessible projects if any data source has null projectIds (all projects).
Useful for filtering custom fields and other operations that need the complete set of projects.

Arguments:
No arguments.

### `aggregations`

- Type: `[FieldAggregation!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `fields` | `[AggregationFieldInput!]!` | `` |  |
| `filter` | `TodosFilter` | `` |  |

### `todos`

- Type: `[Todo!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TodosFilter` | `` |  |
| `sort` | `[TodosSort!]` | `` |  |
| `limit` | `Int` | `` |  |
| `skip` | `Int` | `` |  |

### `todoCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TodosFilter` | `` |  |
