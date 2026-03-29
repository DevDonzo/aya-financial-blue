# `QuestionUpdateWithoutActivityDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `frequency` | `QuestionFrequency` | `` |  |
| `days` | `String` | `` |  |
| `time` | `String` | `` |  |
| `status` | `Boolean` | `` |  |
| `questionUsers` | `QuestionUserUpdateManyWithoutQuestionInput` | `` |  |
| `statusUpdates` | `StatusUpdateUpdateManyWithoutQuestionInput` | `` |  |
| `createdBy` | `UserUpdateOneRequiredWithoutQuestionsInput` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutQuestionsInput` | `` |  |
