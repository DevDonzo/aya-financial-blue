# Subscriptions

### `onAddedToProject`

- Type: `Project!`

Arguments:
No arguments.

### `onArchiveProject`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `onConvertToTemplate`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `onCopyProjectFinished`

- Type: `CopyProjectStatus`

Arguments:
No arguments.

### `onCopyProjectStarted`

- Type: `CopyProjectStatus`

Arguments:
No arguments.

### `onCustomFieldOptionsCreated`

- Type: `[CustomFieldOption!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `customFieldId` | `String!` | `` |  |

### `onDeleteFiles`

- Type: `[File!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `onMarkAllActivityAsSeen`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `userId` | `String!` | `` |  |

### `onMarkTodoListAsDone`

- Type: `TodoList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String` | `` |  |

### `onMarkTodoListAsUndone`

- Type: `TodoList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String` | `` |  |

### `onMarkAllMentionsAsRead`

- Type: `[Mention!]!`

Arguments:
No arguments.

### `onMoveTodo`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `onRemovedFromProject`

- Type: `Project!`

Arguments:
No arguments.

### `onRemovedFromTemplate`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `onSetProjectFolder`

- Type: `ProjectSubscriptionPayload!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |
| `folderId` | `String` | `` |  |

### `onUnarchiveProject`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `subscribeToActivity`

- Type: `ActivitySubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |
| `projectId` | `String` | `` |  |

### `subscribeToAITagProgress`

- Type: `AITagProgress!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `subscribeToCoverGenerationProgress`

- Type: `CoverGenerationProgressPayload!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CoverGenerationProgressFilter!` | `` |  |

### `subscribeToAutomation`

- Type: `AutomationSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `subscribeToChart`

- Type: `ChartSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `SubscribeToChartFilterInput!` | `` |  |

### `subscribeToChat`

- Type: `ChatSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `SubscribeToChatFilterInput!` | `` |  |

### `subscribeToComment`

- Type: `CommentSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `categoryId` | `String!` | `` |  |
| `category` | `CommentCategory!` | `` |  |
| `showOnlyMentionedComments` | `Boolean` | `` |  |

### `subscribeToCommentTyping`

- Type: `User!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |
| `name` | `CommentTypingSubscriptionName` | `` |  |

### `subscribeToCompany`

- Type: `CompanySubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CompanyFilter` | `` |  |

### `subscribeToCompanyPeopleList`

- Type: `UserSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `subscribeToCustomField`

- Type: `CustomFieldSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `subscribeToCustomFieldOption`

- Type: `CustomFieldOptionSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SubscribeToCustomFieldOptionInput!` | `` |  |

### `subscribeToDashboard`

- Type: `DashboardSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `SubscribeToDashboardFilterInput!` | `` |  |

### `subscribeToDiscussion`

- Type: `DiscussionSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `subscribeToDocument`

- Type: `DocumentSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SubscribeToDocumentInput!` | `` |  |

### `subscribeToFile`

- Type: `FileSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |
| `projectId` | `String` | `` |  |
| `folderId` | `String` | `` |  |

### `subscribeToFolder`

- Type: `FolderSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |
| `type` | `FolderType!` | `` |  |
| `projectId` | `String` | `` |  |
| `parentId` | `String` | `` |  |

### `subscribeToForm`

- Type: `FormSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `SubscribeToFormFilterInput` | `` |  |

### `subscribeToImportExportProgress`

- Type: `JSON`
- Description: Return: `{ status: 'IN_PROGRESS' | 'DONE' | 'ERROR' }`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `userId` | `String!` | `` |  |

### `subscribeToInvitation`

- Type: `InvitationSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String` | `` |  |

### `subscribeToLink`

- Type: `LinkSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |

### `subscribeToLookupProgress`

- Type: `JSON`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `LookupProgressFilter!` | `` |  |

### `subscribeToMention`

- Type: `MentionSubscriptionPayload_DEPRECATED`
- Deprecated: yes
- Deprecation reason: use subscribeToMyMention instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `MentionFilter!` | `` |  |

### `subscribeToMyMention`

- Type: `MentionSubscriptionPayload!`

Arguments:
No arguments.

### `subscribeToMyTodoCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `subscribeToNetworkStatus`

- Type: `User`
- Deprecated: yes
- Deprecation reason: Use subscribeToUserPresence instead

Arguments:
No arguments.

### `subscribeToOAuthConnection`

- Type: `OAuthConnectionSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SubscribeToOAuthConnectionInput!` | `` |  |

### `subscribeToProject`

- Type: `ProjectSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |
| `folderId` | `String` | `` |  |
| `archived` | `Boolean` | `` |  |
| `isTemplate` | `Boolean` | `` |  |

### `subscribeToProjectPeopleList`

- Type: `UserSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `subscribeToProjectUserRole`

- Type: `ProjectUserRoleSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SubscribeToProjectUserRoleInput!` | `` |  |

### `subscribeToSavedView`

- Type: `SavedViewSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `subscribeToRecentActiveUser`

- Type: `UserSubscriptionPayload`
- Deprecated: yes
- Deprecation reason: This subscription was never implemented and has no publisher

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `subscribeToStatusUpdate`

- Type: `StatusUpdateSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `subscribeToTag`

- Type: `TagSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `subscribeToTodo`

- Type: `TodoSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String` | `` |  |
| `projectId` | `String` | `` |  |
| `filter` | `SubscribeToTodoFilter` | `` |  |

### `subscribeToTodoAction`

- Type: `TodoActionSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `SubscribeToTodoActionFilter!` | `` |  |

### `subscribeToTodoList`

- Type: `TodoListSubscriptionPayload`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String` | `` |  |

### `subscribeToUserPresence`

- Type: `User!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `UserPresenceFilter` | `` |  |

### `subscribeToAutomationExecution`

- Type: `AutomationExecution!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `AutomationExecutionSubscriptionFilter!` | `` |  |
