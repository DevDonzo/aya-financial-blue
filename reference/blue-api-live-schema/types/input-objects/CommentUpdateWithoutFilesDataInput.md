# `CommentUpdateWithoutFilesDataInput`

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
| `discussion` | `DiscussionUpdateOneWithoutCommentsInput` | `` |  |
| `statusUpdate` | `StatusUpdateUpdateOneWithoutCommentsInput` | `` |  |
| `todo` | `TodoUpdateOneWithoutCommentsInput` | `` |  |
