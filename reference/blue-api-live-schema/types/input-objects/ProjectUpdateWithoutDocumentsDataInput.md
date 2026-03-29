# `ProjectUpdateWithoutDocumentsDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `slug` | `String` | `` |  |
| `name` | `String` | `` |  |
| `description` | `String` | `` |  |
| `image` | `ImageUpdateOneInput` | `` |  |
| `archived` | `Boolean` | `` |  |
| `isTemplate` | `Boolean` | `` |  |
| `isOfficialTemplate` | `Boolean` | `` |  |
| `category` | `ProjectCategory` | `` |  |
| `activities` | `ActivityUpdateManyWithoutProjectInput` | `` |  |
| `company` | `CompanyUpdateOneRequiredWithoutProjectsInput` | `` |  |
| `customFields` | `CustomFieldUpdateManyWithoutProjectInput` | `` |  |
| `discussions` | `DiscussionUpdateManyWithoutProjectInput` | `` |  |
| `files` | `FileUpdateManyWithoutProjectInput` | `` |  |
| `invitations` | `InvitationUpdateManyWithoutProjectInput` | `` |  |
| `projectUsers` | `ProjectUserUpdateManyWithoutProjectInput` | `` |  |
| `questions` | `QuestionUpdateManyWithoutProjectInput` | `` |  |
| `statusUpdates` | `StatusUpdateUpdateManyWithoutProjectInput` | `` |  |
| `tags` | `TagUpdateManyWithoutProjectInput` | `` |  |
| `todoLists` | `TodoListUpdateManyWithoutProjectInput` | `` |  |
| `automations` | `AutomationUpdateManyWithoutProjectInput` | `` |  |
| `forms` | `FormUpdateManyWithoutProjectInput` | `` |  |
| `hideEmailFromRoles` | `String` | `` |  |
