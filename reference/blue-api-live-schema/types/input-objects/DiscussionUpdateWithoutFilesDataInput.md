# `DiscussionUpdateWithoutFilesDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `html` | `String` | `` |  |
| `text` | `String` | `` |  |
| `user` | `UserUpdateOneRequiredInput` | `` |  |
| `activity` | `ActivityUpdateOneWithoutDiscussionInput` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutDiscussionsInput` | `` |  |
| `comments` | `CommentUpdateManyWithoutDiscussionInput` | `` |  |
