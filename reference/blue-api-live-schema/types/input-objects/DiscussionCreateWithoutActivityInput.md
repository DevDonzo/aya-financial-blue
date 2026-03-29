# `DiscussionCreateWithoutActivityInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String!` | `` |  |
| `html` | `String!` | `` |  |
| `text` | `String!` | `` |  |
| `user` | `UserCreateOneInput!` | `` |  |
| `project` | `ProjectCreateOneWithoutDiscussionsInput!` | `` |  |
| `comments` | `CommentCreateManyWithoutDiscussionInput` | `` |  |
| `files` | `FileCreateManyWithoutDiscussionInput` | `` |  |
