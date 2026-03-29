# `QuestionCreateWithoutQuestionUsersInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String!` | `` |  |
| `frequency` | `QuestionFrequency!` | `` |  |
| `days` | `String!` | `` |  |
| `time` | `String!` | `` |  |
| `status` | `Boolean!` | `` |  |
| `statusUpdates` | `StatusUpdateCreateManyWithoutQuestionInput` | `` |  |
| `createdBy` | `UserCreateOneWithoutQuestionsInput!` | `` |  |
| `project` | `ProjectCreateOneWithoutQuestionsInput!` | `` |  |
| `activity` | `ActivityCreateOneWithoutQuestionInput` | `` |  |
