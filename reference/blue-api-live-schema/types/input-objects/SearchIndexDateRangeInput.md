# `SearchIndexDateRangeInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `since` | `DateTime` | `` | Filter by data created or updated since this date (ISO string) |
| `from` | `DateTime` | `` | Filter by data created or updated from this date (ISO string) |
| `to` | `DateTime` | `` | Filter by data created or updated up to this date (ISO string) |
| `relative` | `SearchIndexRelativeDateRange` | `` | Predefined relative date ranges (e.g., "lastWeek", "lastMonth") |
