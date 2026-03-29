# `User`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

Arguments:
No arguments.

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `username`

- Type: `String!`

Arguments:
No arguments.

### `email`

- Type: `String!`

Arguments:
No arguments.

### `dateOfBirth`

- Type: `DateTime`

Arguments:
No arguments.

### `birthday`

- Type: `DateTime`

Arguments:
No arguments.

### `phoneNumber`

- Type: `String`

Arguments:
No arguments.

### `firstName`

- Type: `String!`

Arguments:
No arguments.

### `lastName`

- Type: `String!`

Arguments:
No arguments.

### `fullName`

- Type: `String!`

Arguments:
No arguments.

### `isEmailVerified`

- Type: `Boolean!`

Arguments:
No arguments.

### `jobTitle`

- Type: `String`

Arguments:
No arguments.

### `locale`

- Type: `Locale!`

Arguments:
No arguments.

### `image`

- Type: `Image`

Arguments:
No arguments.

### `dateFormat`

- Type: `String`

Arguments:
No arguments.

### `calendarFirstDay`

- Type: `Int`

Arguments:
No arguments.

### `role`

- Type: `Role!`

Arguments:
No arguments.

### `lastActiveAt`

- Type: `DateTime`

Arguments:
No arguments.

### `createdAt`

- Type: `DateTime!`

Arguments:
No arguments.

### `updatedAt`

- Type: `DateTime!`

Arguments:
No arguments.

### `companyLevel`

- Type: `UserAccessLevel`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |

### `canManageFolders`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |

### `workspaceCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |

### `projectLevel`

- Type: `UserAccessLevel`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String` | `` |  |

### `isOnline`

- Type: `Boolean!`

Arguments:
No arguments.

### `isWelcomeGuideCompleted`

- Type: `Boolean!`

Arguments:
No arguments.

### `timezone`

- Type: `String`

Arguments:
No arguments.

### `theme`

- Type: `JSON`

Arguments:
No arguments.

### `appearance`

- Type: `AppearanceSettings`

Arguments:
No arguments.

### `compactCards`

- Type: `Boolean`

Arguments:
No arguments.

### `companies`

- Type: `[Company!]!`
- Deprecated: yes
- Deprecation reason: Stop using this property.

Arguments:
No arguments.

### `projects`

- Type: `[Project!]!`
- Deprecated: yes
- Deprecation reason: Stop using this property.

Arguments:
No arguments.

### `projectUserRole`

- Type: `ProjectUserRole`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String` | `` |  |

### `createdActivities`

- Type: `[Activity!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ActivityWhereInput` | `` |  |
| `orderBy` | `ActivityOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `affectedActivities`

- Type: `[Activity!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ActivityWhereInput` | `` |  |
| `orderBy` | `ActivityOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `userActivities`

- Type: `[UserActivity!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `UserActivityWhereInput` | `` |  |
| `orderBy` | `UserActivityOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `companyUsers`

- Type: `[CompanyUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CompanyUserWhereInput` | `` |  |
| `orderBy` | `CompanyUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `projectUsers`

- Type: `[ProjectUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ProjectUserWhereInput` | `` |  |
| `orderBy` | `ProjectUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `todoUsers`

- Type: `[TodoUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoUserWhereInput` | `` |  |
| `orderBy` | `TodoUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `pushTokens`

- Type: `[UserPushToken!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `UserPushTokenWhereInput` | `` |  |
| `orderBy` | `UserPushTokenOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `todos`

- Type: `[Todo!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoWhereInput` | `` |  |
| `orderBy` | `TodoOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `todoLists`

- Type: `[TodoList!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TodoListWhereInput` | `` |  |
| `orderBy` | `TodoListOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `comments`

- Type: `[Comment!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CommentWhereInput` | `` |  |
| `orderBy` | `CommentOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `invitations`

- Type: `[Invitation!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `InvitationWhereInput` | `` |  |
| `orderBy` | `InvitationOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `subscriptionPlans`

- Type: `[CompanySubscriptionPlan!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CompanySubscriptionPlanWhereInput` | `` |  |
| `orderBy` | `CompanySubscriptionPlanOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `files`

- Type: `[File!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FileWhereInput` | `` |  |
| `orderBy` | `FileOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `checklists`

- Type: `[Checklist!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ChecklistWhereInput` | `` |  |
| `orderBy` | `ChecklistOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `checklistItems`

- Type: `[ChecklistItem!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ChecklistItemWhereInput` | `` |  |
| `orderBy` | `ChecklistItemOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `checklistItemUsers`

- Type: `[ChecklistItemUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ChecklistItemUserWhereInput` | `` |  |
| `orderBy` | `ChecklistItemUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `questions`

- Type: `[Question!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `QuestionWhereInput` | `` |  |
| `orderBy` | `QuestionOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `questionUsers`

- Type: `[QuestionUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `QuestionUserWhereInput` | `` |  |
| `orderBy` | `QuestionUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automationTriggerAssignees`

- Type: `[AutomationTriggerAssignee!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationTriggerAssigneeWhereInput` | `` |  |
| `orderBy` | `AutomationTriggerAssigneeOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automationActionAssignees`

- Type: `[AutomationActionAssignee!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationActionAssigneeWhereInput` | `` |  |
| `orderBy` | `AutomationActionAssigneeOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `automations`

- Type: `[Automation!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `AutomationWhereInput` | `` |  |
| `orderBy` | `AutomationOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `forms`

- Type: `[Form!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FormWhereInput` | `` |  |
| `orderBy` | `FormOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `formUsers`

- Type: `[FormUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FormUserWhereInput` | `` |  |
| `orderBy` | `FormUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `personalAccessTokens`

- Type: `[PersonalAccessToken!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `PersonalAccessTokenWhereInput` | `` |  |
| `orderBy` | `PersonalAccessTokenOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `links`

- Type: `[Link!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `LinkWhereInput` | `` |  |
| `orderBy` | `LinkOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `documents`

- Type: `[Document!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `DocumentWhereInput` | `` |  |
| `orderBy` | `DocumentOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
