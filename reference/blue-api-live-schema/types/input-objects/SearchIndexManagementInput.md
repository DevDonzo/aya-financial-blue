# `SearchIndexManagementInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `operation` | `SearchIndexOperationType!` | `` | The type of search index operation to perform |
| `entity` | `SearchIndexEntity` | `` | Optional entity type to reindex. If not provided, all entities will be reindexed. |
| `dateRange` | `SearchIndexDateRangeInput` | `` | Optional date range to filter data for indexing |
