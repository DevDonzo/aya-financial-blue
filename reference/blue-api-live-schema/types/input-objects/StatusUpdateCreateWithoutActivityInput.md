# `StatusUpdateCreateWithoutActivityInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `html` | `String!` | `` |  |
| `text` | `String!` | `` |  |
| `date` | `DateTime!` | `` |  |
| `category` | `StatusUpdateCategory!` | `` |  |
| `user` | `UserCreateOneInput!` | `` |  |
| `project` | `ProjectCreateOneWithoutStatusUpdatesInput!` | `` |  |
| `comments` | `CommentCreateManyWithoutStatusUpdateInput` | `` |  |
| `files` | `FileCreateManyWithoutStatusUpdateInput` | `` |  |
| `question` | `QuestionCreateOneWithoutStatusUpdatesInput` | `` |  |
