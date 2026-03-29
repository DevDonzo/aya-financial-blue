# `UserUpdateWithoutChecklistsDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `username` | `String` | `` |  |
| `email` | `String` | `` |  |
| `phoneNumber` | `String` | `` |  |
| `firstName` | `String` | `` |  |
| `lastName` | `String` | `` |  |
| `dateOfBirth` | `DateTime` | `` |  |
| `isEmailVerified` | `Boolean` | `` |  |
| `jobTitle` | `String` | `` |  |
| `role` | `Role` | `` |  |
| `locale` | `String` | `` |  |
| `lastActiveAt` | `DateTime` | `` |  |
| `image` | `ImageUpdateOneInput` | `` |  |
| `isWelcomeGuideCompleted` | `Boolean` | `` |  |
| `timezone` | `String` | `` |  |
| `theme` | `String` | `` |  |
| `createdActivities` | `ActivityUpdateManyWithoutCreatedByInput` | `` |  |
| `affectedActivities` | `ActivityUpdateManyWithoutAffectedByInput` | `` |  |
| `userActivities` | `UserActivityUpdateManyWithoutUserInput` | `` |  |
| `companyUsers` | `CompanyUserUpdateManyWithoutUserInput` | `` |  |
| `projectUsers` | `ProjectUserUpdateManyWithoutUserInput` | `` |  |
| `todoUsers` | `TodoUserUpdateManyWithoutUserInput` | `` |  |
| `pushTokens` | `UserPushTokenUpdateManyWithoutUserInput` | `` |  |
| `todos` | `TodoUpdateManyWithoutCreatedByInput` | `` |  |
| `todoLists` | `TodoListUpdateManyWithoutCreatedByInput` | `` |  |
| `comments` | `CommentUpdateManyWithoutUserInput` | `` |  |
| `invitations` | `InvitationUpdateManyWithoutInvitedByInput` | `` |  |
| `subscriptionPlans` | `CompanySubscriptionPlanUpdateManyWithoutUserInput` | `` |  |
| `files` | `FileUpdateManyWithoutUserInput` | `` |  |
| `checklistItems` | `ChecklistItemUpdateManyWithoutCreatedByInput` | `` |  |
| `checklistItemUsers` | `ChecklistItemUserUpdateManyWithoutUserInput` | `` |  |
| `questions` | `QuestionUpdateManyWithoutCreatedByInput` | `` |  |
| `questionUsers` | `QuestionUserUpdateManyWithoutUserInput` | `` |  |
| `automationTriggerAssignees` | `AutomationTriggerAssigneeUpdateManyWithoutAssigneeInput` | `` |  |
| `automationActionAssignees` | `AutomationActionAssigneeUpdateManyWithoutAssigneeInput` | `` |  |
| `automations` | `AutomationUpdateManyWithoutCreatedByInput` | `` |  |
| `forms` | `FormUpdateManyWithoutCreatedByInput` | `` |  |
| `formUsers` | `FormUserUpdateManyWithoutUserInput` | `` |  |
| `personalAccessTokens` | `PersonalAccessTokenUpdateManyWithoutUserInput` | `` |  |
| `links` | `LinkUpdateManyWithoutCreatedByInput` | `` |  |
| `documents` | `DocumentUpdateManyWithoutCreatedByInput` | `` |  |
