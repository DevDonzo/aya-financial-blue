# `StatusUpdateCreateWithoutQuestionInput`

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
| `activity` | `ActivityCreateOneWithoutStatusUpdateInput` | `` |  |
| `project` | `ProjectCreateOneWithoutStatusUpdatesInput!` | `` |  |
| `comments` | `CommentCreateManyWithoutStatusUpdateInput` | `` |  |
| `files` | `FileCreateManyWithoutStatusUpdateInput` | `` |  |
