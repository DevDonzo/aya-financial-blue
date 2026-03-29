# `UserCreateWithoutQuestionUsersInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `username` | `String!` | `` |  |
| `email` | `String!` | `` |  |
| `phoneNumber` | `String` | `` |  |
| `firstName` | `String!` | `` |  |
| `lastName` | `String!` | `` |  |
| `dateOfBirth` | `DateTime` | `` |  |
| `isEmailVerified` | `Boolean` | `` |  |
| `jobTitle` | `String` | `` |  |
| `role` | `Role!` | `` |  |
| `locale` | `String` | `` |  |
| `lastActiveAt` | `DateTime` | `` |  |
| `image` | `ImageCreateOneInput` | `` |  |
| `isWelcomeGuideCompleted` | `Boolean` | `` |  |
| `timezone` | `String` | `` |  |
| `theme` | `String` | `` |  |
| `createdActivities` | `ActivityCreateManyWithoutCreatedByInput` | `` |  |
| `affectedActivities` | `ActivityCreateManyWithoutAffectedByInput` | `` |  |
| `userActivities` | `UserActivityCreateManyWithoutUserInput` | `` |  |
| `companyUsers` | `CompanyUserCreateManyWithoutUserInput` | `` |  |
| `projectUsers` | `ProjectUserCreateManyWithoutUserInput` | `` |  |
| `todoUsers` | `TodoUserCreateManyWithoutUserInput` | `` |  |
| `pushTokens` | `UserPushTokenCreateManyWithoutUserInput` | `` |  |
| `todos` | `TodoCreateManyWithoutCreatedByInput` | `` |  |
| `todoLists` | `TodoListCreateManyWithoutCreatedByInput` | `` |  |
| `comments` | `CommentCreateManyWithoutUserInput` | `` |  |
| `invitations` | `InvitationCreateManyWithoutInvitedByInput` | `` |  |
| `subscriptionPlans` | `CompanySubscriptionPlanCreateManyWithoutUserInput` | `` |  |
| `files` | `FileCreateManyWithoutUserInput` | `` |  |
| `checklists` | `ChecklistCreateManyWithoutCreatedByInput` | `` |  |
| `checklistItems` | `ChecklistItemCreateManyWithoutCreatedByInput` | `` |  |
| `checklistItemUsers` | `ChecklistItemUserCreateManyWithoutUserInput` | `` |  |
| `questions` | `QuestionCreateManyWithoutCreatedByInput` | `` |  |
| `automationTriggerAssignees` | `AutomationTriggerAssigneeCreateManyWithoutAssigneeInput` | `` |  |
| `automationActionAssignees` | `AutomationActionAssigneeCreateManyWithoutAssigneeInput` | `` |  |
| `automations` | `AutomationCreateManyWithoutCreatedByInput` | `` |  |
| `forms` | `FormCreateManyWithoutCreatedByInput` | `` |  |
| `formUsers` | `FormUserCreateManyWithoutUserInput` | `` |  |
| `personalAccessTokens` | `PersonalAccessTokenCreateManyWithoutUserInput` | `` |  |
| `links` | `LinkCreateManyWithoutCreatedByInput` | `` |  |
| `documents` | `DocumentCreateManyWithoutCreatedByInput` | `` |  |
