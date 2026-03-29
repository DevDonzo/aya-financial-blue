# `StatusUpdateUpdateWithoutCommentsDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `html` | `String` | `` |  |
| `text` | `String` | `` |  |
| `date` | `DateTime` | `` |  |
| `category` | `StatusUpdateCategory` | `` |  |
| `user` | `UserUpdateOneRequiredInput` | `` |  |
| `activity` | `ActivityUpdateOneWithoutStatusUpdateInput` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutStatusUpdatesInput` | `` |  |
| `files` | `FileUpdateManyWithoutStatusUpdateInput` | `` |  |
| `question` | `QuestionUpdateOneWithoutStatusUpdatesInput` | `` |  |
