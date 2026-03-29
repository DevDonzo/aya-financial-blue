# `ChecklistCreateWithoutCreatedByInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String!` | `` |  |
| `position` | `Float!` | `` |  |
| `todo` | `TodoCreateOneWithoutChecklistsInput!` | `` |  |
| `checklistItems` | `ChecklistItemCreateManyWithoutChecklistInput` | `` |  |
