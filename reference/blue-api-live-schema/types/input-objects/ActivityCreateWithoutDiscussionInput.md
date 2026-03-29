# `ActivityCreateWithoutDiscussionInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `category` | `ActivityCategory!` | `` |  |
| `inviteeEmail` | `String` | `` |  |
| `metadata` | `String` | `` |  |
| `company` | `CompanyCreateOneWithoutActivitiesInput` | `` |  |
| `project` | `ProjectCreateOneWithoutActivitiesInput` | `` |  |
| `comment` | `CommentCreateOneWithoutActivityInput` | `` |  |
| `statusUpdate` | `StatusUpdateCreateOneWithoutActivityInput` | `` |  |
| `todo` | `TodoCreateOneWithoutActivityInput` | `` |  |
| `todoList` | `TodoListCreateOneWithoutActivityInput` | `` |  |
| `customField` | `CustomFieldCreateOneWithoutActivityInput` | `` |  |
| `userActivities` | `UserActivityCreateManyWithoutActivityInput` | `` |  |
| `createdBy` | `UserCreateOneWithoutCreatedActivitiesInput!` | `` |  |
| `affectedBy` | `UserCreateOneWithoutAffectedActivitiesInput` | `` |  |
| `userAccessLevel` | `UserAccessLevel` | `` |  |
| `question` | `QuestionCreateOneWithoutActivityInput` | `` |  |
