# `CommentCreateWithoutFilesInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `html` | `String!` | `` |  |
| `text` | `String!` | `` |  |
| `category` | `CommentCategory!` | `` |  |
| `activity` | `ActivityCreateOneWithoutCommentInput` | `` |  |
| `user` | `UserCreateOneWithoutCommentsInput!` | `` |  |
| `discussion` | `DiscussionCreateOneWithoutCommentsInput` | `` |  |
| `statusUpdate` | `StatusUpdateCreateOneWithoutCommentsInput` | `` |  |
| `todo` | `TodoCreateOneWithoutCommentsInput` | `` |  |
