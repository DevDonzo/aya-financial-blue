# `ChecklistItemCreateWithoutCreatedByInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String!` | `` |  |
| `done` | `Boolean` | `` |  |
| `position` | `Float!` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `checklist` | `ChecklistCreateOneWithoutChecklistItemsInput!` | `` |  |
| `checklistItemUsers` | `ChecklistItemUserCreateManyWithoutChecklistItemInput` | `` |  |
