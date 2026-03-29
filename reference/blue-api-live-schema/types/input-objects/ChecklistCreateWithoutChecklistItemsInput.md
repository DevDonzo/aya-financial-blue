# `ChecklistCreateWithoutChecklistItemsInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String!` | `` |  |
| `position` | `Float!` | `` |  |
| `todo` | `TodoCreateOneWithoutChecklistsInput!` | `` |  |
| `createdBy` | `UserCreateOneWithoutChecklistsInput!` | `` |  |
