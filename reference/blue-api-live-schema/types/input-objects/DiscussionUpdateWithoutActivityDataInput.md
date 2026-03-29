# `DiscussionUpdateWithoutActivityDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `html` | `String` | `` |  |
| `text` | `String` | `` |  |
| `user` | `UserUpdateOneRequiredInput` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutDiscussionsInput` | `` |  |
| `comments` | `CommentUpdateManyWithoutDiscussionInput` | `` |  |
| `files` | `FileUpdateManyWithoutDiscussionInput` | `` |  |
