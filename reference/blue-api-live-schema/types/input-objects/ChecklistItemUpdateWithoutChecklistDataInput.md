# `ChecklistItemUpdateWithoutChecklistDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `done` | `Boolean` | `` |  |
| `position` | `Float` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `createdBy` | `UserUpdateOneRequiredWithoutChecklistItemsInput` | `` |  |
| `checklistItemUsers` | `ChecklistItemUserUpdateManyWithoutChecklistItemInput` | `` |  |
