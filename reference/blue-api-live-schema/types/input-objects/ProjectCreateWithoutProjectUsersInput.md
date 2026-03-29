# `ProjectCreateWithoutProjectUsersInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `slug` | `String!` | `` |  |
| `name` | `String!` | `` |  |
| `description` | `String` | `` |  |
| `image` | `ImageCreateOneInput` | `` |  |
| `archived` | `Boolean` | `` |  |
| `isTemplate` | `Boolean` | `` |  |
| `isOfficialTemplate` | `Boolean` | `` |  |
| `category` | `ProjectCategory` | `` |  |
| `activities` | `ActivityCreateManyWithoutProjectInput` | `` |  |
| `company` | `CompanyCreateOneWithoutProjectsInput!` | `` |  |
| `customFields` | `CustomFieldCreateManyWithoutProjectInput` | `` |  |
| `discussions` | `DiscussionCreateManyWithoutProjectInput` | `` |  |
| `files` | `FileCreateManyWithoutProjectInput` | `` |  |
| `invitations` | `InvitationCreateManyWithoutProjectInput` | `` |  |
| `questions` | `QuestionCreateManyWithoutProjectInput` | `` |  |
| `statusUpdates` | `StatusUpdateCreateManyWithoutProjectInput` | `` |  |
| `tags` | `TagCreateManyWithoutProjectInput` | `` |  |
| `todoLists` | `TodoListCreateManyWithoutProjectInput` | `` |  |
| `automations` | `AutomationCreateManyWithoutProjectInput` | `` |  |
| `forms` | `FormCreateManyWithoutProjectInput` | `` |  |
| `documents` | `DocumentCreateManyWithoutProjectInput` | `` |  |
| `hideEmailFromRoles` | `String` | `` |  |
