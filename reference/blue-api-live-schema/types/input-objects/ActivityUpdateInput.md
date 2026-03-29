# `ActivityUpdateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `category` | `ActivityCategory` | `` |  |
| `inviteeEmail` | `String` | `` |  |
| `metadata` | `String` | `` |  |
| `company` | `CompanyUpdateOneWithoutActivitiesInput` | `` |  |
| `project` | `ProjectUpdateOneWithoutActivitiesInput` | `` |  |
| `comment` | `CommentUpdateOneWithoutActivityInput` | `` |  |
| `discussion` | `DiscussionUpdateOneWithoutActivityInput` | `` |  |
| `statusUpdate` | `StatusUpdateUpdateOneWithoutActivityInput` | `` |  |
| `todo` | `TodoUpdateOneWithoutActivityInput` | `` |  |
| `todoList` | `TodoListUpdateOneWithoutActivityInput` | `` |  |
| `customField` | `CustomFieldUpdateOneWithoutActivityInput` | `` |  |
| `userActivities` | `UserActivityUpdateManyWithoutActivityInput` | `` |  |
| `createdBy` | `UserUpdateOneRequiredWithoutCreatedActivitiesInput` | `` |  |
| `affectedBy` | `UserUpdateOneWithoutAffectedActivitiesInput` | `` |  |
| `userAccessLevel` | `UserAccessLevel` | `` |  |
| `question` | `QuestionUpdateOneWithoutActivityInput` | `` |  |
