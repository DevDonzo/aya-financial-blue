# `CommentUpdateWithoutDiscussionDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `html` | `String` | `` |  |
| `text` | `String` | `` |  |
| `category` | `CommentCategory` | `` |  |
| `activity` | `ActivityUpdateOneWithoutCommentInput` | `` |  |
| `user` | `UserUpdateOneRequiredWithoutCommentsInput` | `` |  |
| `statusUpdate` | `StatusUpdateUpdateOneWithoutCommentsInput` | `` |  |
| `todo` | `TodoUpdateOneWithoutCommentsInput` | `` |  |
| `files` | `FileUpdateManyWithoutCommentInput` | `` |  |
