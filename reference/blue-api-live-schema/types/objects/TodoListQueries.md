# `TodoListQueries`

- Kind: `OBJECT`

## Fields

### `todoLists`

- Type: `TodoListsPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TodoListsFilterInput!` | `` |  |
| `sort` | `[TodoListsSort!]` | `[position_ASC]` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |
| `distinct` | `[TodoListsFilterDistinct!]` | `` |  |
