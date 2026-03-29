# `DiscussionUpdateWithoutProjectDataInput`

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
| `comments` | `CommentUpdateManyWithoutDiscussionInput` | `` |  |
| `files` | `FileUpdateManyWithoutDiscussionInput` | `` |  |
