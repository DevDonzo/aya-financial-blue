# `Query`

- Kind: `OBJECT`

## Fields

### `activityList`

- Type: `ActivityList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |
| `projectId` | `String` | `` |  |
| `projectIds` | `[String!]` | `` |  |
| `userId` | `String` | `` |  |
| `userIds` | `[String!]` | `` |  |
| `tagIds` | `[String!]` | `` |  |
| `categories` | `[ActivityCategory!]` | `` |  |
| `startDate` | `DateTime` | `` |  |
| `endDate` | `DateTime` | `` |  |
| `filter` | `TodoFilterInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `orderBy` | `ActivityOrderByInput` | `` |  |

### `adminQueries`

- Type: `AdminQueries!`

Arguments:
No arguments.

### `assignees`

- Type: `[User!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `AssigneesFilterInput` | `` |  |

### `availableSubscriptionPlans`

- Type: `[SubscriptionPlan!]!`

Arguments:
No arguments.

### `automationList`

- Type: `AutomationPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `AutomationFilterInput` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `beaconSignature`

- Type: `String!`

Arguments:
No arguments.

### `checkAuthMethod`

- Type: `AuthMethodPayload!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `email` | `String!` | `` |  |

### `commentList`

- Type: `CommentList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `categoryId` | `String!` | `` |  |
| `category` | `CommentCategory!` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `orderBy` | `DiscussionOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |

### `companies`

- Type: `CompanyPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CompanyFilter` | `` |  |
| `sort` | `[CompanySort!]` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `company`

- Type: `Company!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String` | `` |  |

### `companyLevel`

- Type: `UserAccessLevel`
- Deprecated: yes
- Deprecation reason: Use property `accessLevel` on type `Company` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `companyList`

- Type: `CompanyPagination!`
- Deprecated: yes
- Deprecation reason: Use `Query.companies` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CompanyFilter` | `` |  |
| `sort` | `[CompanySort!]` | `` |  |
| `limit` | `Int` | `20` |  |
| `skip` | `Int` | `0` |  |

### `companySubscriptionPlan`

- Type: `CompanySubscriptionPlan`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |

### `companySubscriptionPlanPortal`

- Type: `String`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |

### `companySubscriptionPlanPromoCode`

- Type: `JSON`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `code` | `String!` | `` |  |

### `companyInvoices`

- Type: `[CompanyInvoice!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |
| `limit` | `Int` | `10` |  |

### `companyBillingAddress`

- Type: `BillingAddress`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |

### `companyUserList`

- Type: `CompanyUserList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |
| `notInProjectId` | `String` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `search` | `String` | `` |  |
| `orderBy` | `UserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |

### `copyProjectStatus`

- Type: `CopyProjectStatus`

Arguments:
No arguments.

### `chats`

- Type: `ChatPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `ChatFilterInput` | `` |  |
| `sort` | `[ChatSort!]` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `chart`

- Type: `Chart!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `charts`

- Type: `ChartPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `ChartFilterInput!` | `` |  |
| `sort` | `[ChartSort!]` | `[position_ASC]` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `checklistItems`

- Type: `ChecklistItemPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `ChecklistItemFilterInput!` | `` |  |
| `sort` | `[TodosSort!]` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `customDomains`

- Type: `CustomDomainPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CustomDomainFilterInput!` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `customFieldList`

- Type: `CustomFieldPagination!`
- Deprecated: yes
- Deprecation reason: Use `Query.customFields` instead.

Arguments:
No arguments.

### `customFields`

- Type: `CustomFieldPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CustomFieldFilterInput` | `` |  |
| `sort` | `CustomFieldSort` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `500` |  |

### `customFieldOption`

- Type: `CustomFieldOption!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `customFieldOptions`

- Type: `CustomFieldOptionPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CustomFieldOptionFilterInput!` | `` |  |
| `sort` | `[CustomFieldOptionSort!]` | `[position_ASC]` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `customFieldReferenceTodos`

- Type: `CustomFieldReferenceTodoPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CustomFieldReferenceTodosFilterInput!` | `` |  |
| `sort` | `[TodosSort!]` | `[]` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `customFieldQueries`

- Type: `CustomFieldQueries!`

Arguments:
No arguments.

### `customFieldOptionQueries`

- Type: `CustomFieldOptionQueries!`

Arguments:
No arguments.

### `currentUser`

- Type: `User!`

Arguments:
No arguments.

### `dashboard`

- Type: `Dashboard!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `dashboards`

- Type: `DashboardPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `DashboardFilterInput!` | `` |  |
| `sort` | `[DashboardSort!]` | `[updatedAt_DESC]` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `savedView`

- Type: `SavedView!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `savedViews`

- Type: `SavedViewPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `SavedViewFilterInput!` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `100` |  |

### `document`

- Type: `Document!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `discussions`

- Type: `DiscussionPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `DiscussionFilterInput!` | `` |  |
| `sort` | `[DiscussionSort!]` | `[updatedAt_DESC]` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `documents`

- Type: `DocumentPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `DocumentFilterInput!` | `` |  |
| `sort` | `[DocumentSort!]` | `[updatedAt_DESC]` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `discussion`

- Type: `Discussion!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `discussionList`

- Type: `DiscussionList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `orderBy` | `DiscussionOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |

### `emailTemplate`

- Type: `EmailTemplate`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `type` | `EmailTemplateType!` | `` |  |

### `emailTemplates`

- Type: `EmailTemplatePagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `EmailTemplateFilterInput` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `fileList`

- Type: `FileList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `companyId` | `String` | `` |  |
| `search` | `String` | `` |  |
| `after` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `orderBy` | `FileOrderByInput` | `` |  |

### `files`

- Type: `FilePagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `FileFilterInput` | `` |  |
| `sort` | `[FileSort!]` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `form`

- Type: `Form!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `formFields`

- Type: `[FormField!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `FormFieldFilterInput` | `` |  |

### `forms`

- Type: `FormPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `FormFilterInput` | `` |  |
| `sort` | `FormSort` | `updatedAt_DESC` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `formQueries`

- Type: `FormQueries!`
- Deprecated: yes
- Deprecation reason: Use REST API instead.

Arguments:
No arguments.

### `folder`

- Type: `Folder!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `folders`

- Type: `FolderPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `FolderFilterInput!` | `` |  |
| `sort` | `[FolderSort!]` | `[position_DESC]` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `invitations`

- Type: `[Invitation!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `search` | `String` | `` |  |
| `orderBy` | `UserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `pending` | `Boolean` | `` |  |

### `isCompanySlugAvailable`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `slug` | `String!` | `` |  |

### `isProjectSlugAvailable`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `slug` | `String!` | `` |  |

### `links`

- Type: `LinkPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `LinkFilterInput!` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `mentions`

- Type: `MentionPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `MentionFilter!` | `` |  |
| `sort` | `[MentionSort!]` | `` |  |
| `skip` | `Int` | `0` |  |
| `limit` | `Int` | `20` |  |

### `myInvitations`

- Type: `[Invitation!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |

### `myTodoCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `myTodoList`

- Type: `MyTodoList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |
| `done` | `Boolean` | `` |  |
| `archived` | `Boolean` | `` |  |
| `search` | `String` | `` |  |
| `skip` | `Int` | `` |  |
| `first` | `Int` | `` |  |
| `orderBy` | `TodoOrderByInput` | `` |  |

### `myTodoOverdueCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String!` | `` |  |

### `notificationOptions`

- Type: `[NotificationOption!]!`

Arguments:
No arguments.

### `oauthConnections`

- Type: `OAuthConnectionPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `OAuthConnectionFilterInput` | `` |  |
| `sort` | `OAuthConnectionSort` | `updatedAt_DESC` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `ping`

- Type: `String!`

Arguments:
No arguments.

### `personalAccessTokens`

- Type: `PersonalAccessTokenPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `portableDocument`

- Type: `PortableDocument!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `portableDocuments`

- Type: `PortableDocumentPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `PortableDocumentFilter!` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `previewChart`

- Type: `Chart!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateChartInput!` | `` |  |

### `profile`

- Type: `User!`

Arguments:
No arguments.

### `project`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String` | `` |  |

### `projectLevel`

- Type: `UserAccessLevel`
- Deprecated: yes
- Deprecation reason: Use property `accessLevel` on type `Project` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `report`

- Type: `Report`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `reports`

- Type: `ReportPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `ReportFilter!` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `projectList`

- Type: `ProjectPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `ProjectListFilter!` | `` |  |
| `sort` | `[ProjectSort!]` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |
| `orderBy` | `ProjectOrderByInput` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `projects`

- Type: `[Project!]!`
- Deprecated: yes
- Deprecation reason: Use `Query.projectList` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `companyId` | `String` | `` |  |
| `archived` | `Boolean` | `` |  |
| `first` | `Int` | `` |  |
| `skip` | `Int` | `` |  |

### `projectUserList`

- Type: `ProjectUserList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `search` | `String` | `` |  |
| `orderBy` | `UserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |

### `projectUserRole`

- Type: `ProjectUserRole!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `projectUserRoles`

- Type: `[ProjectUserRole!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `ProjectUserRoleFilter!` | `` |  |

### `recentProjects`

- Type: `[Project!]!`

Arguments:
No arguments.

### `search`

- Type: `SearchResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `query` | `String!` | `` |  |
| `companyId` | `String!` | `` |  |

### `getSearchToken`

- Type: `SearchToken!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `options` | `GetSearchTokenOptions` | `` |  |

### `smtpCredentials`

- Type: `SmtpCredentialPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `stats`

- Type: `Stats!`

Arguments:
No arguments.

### `statusUpdate`

- Type: `StatusUpdate!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `statusUpdateList`

- Type: `StatusUpdateList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `userId` | `String` | `` |  |
| `dateFrom` | `DateTime` | `` |  |
| `dateTo` | `DateTime` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `orderBy` | `StatusUpdateOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |

### `tagList`

- Type: `TagPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TagListFilter!` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `500` |  |
| `last` | `Int` | `` |  |
| `orderBy` | `TagOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `distinct` | `[TagListFilterDistinct!]` | `` |  |

### `tags`

- Type: `[Tag!]!`

Arguments:
No arguments.

### `template`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TemplateFilterInput` | `` |  |

### `templates`

- Type: `TemplatePagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TemplateFilterInput` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `todo`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `todoActions`

- Type: `TodoActionPagination!`
- Deprecated: yes
- Deprecation reason: This API is no longer maintained.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TodoActionsFilter!` | `` |  |
| `orderBy` | `TodoActionOrderByInput` | `` |  |
| `first` | `Int` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `last` | `Int` | `` |  |

### `todoActivity`

- Type: `TodoActivityPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TodoActivityFilter!` | `` |  |
| `orderBy` | `TodoActivityOrderBy` | `` |  |
| `limit` | `Int` | `` |  |
| `skip` | `Int` | `` |  |

### `todoGroups`

- Type: `TodoGroupPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `type` | `TodoGroupType!` | `` |  |
| `filter` | `TodosFilter` | `` |  |
| `sort` | `[TodosSort!]` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `todoList`

- Type: `TodoList`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `todoLists`

- Type: `[TodoList!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `todoListQueries`

- Type: `TodoListQueries!`

Arguments:
No arguments.

### `todoQueries`

- Type: `TodoQueries!`

Arguments:
No arguments.

### `todosCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `TodoFilterInput` | `` |  |
| `refetchedAt` | `DateTime` | `` |  |

### `unreadMentionCount`

- Type: `Int!`

Arguments:
No arguments.

### `user`

- Type: `User!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `userList`

- Type: `UserPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `UserListFilter!` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
| `orderBy` | `UserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |

### `verifyAcceptInvitation`

- Type: `VerifyAcceptInvitationPayload!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `verifySecurityCode`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `email` | `String!` | `` |  |
| `code` | `String!` | `` |  |

### `verifyPromoCode`

- Type: `String`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `code` | `String!` | `` |  |

### `webhook`

- Type: `Webhook!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `webhooks`

- Type: `WebhookPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `WebhookFilter` | `` |  |
| `skip` | `Int` | `0` |  |
| `take` | `Int` | `20` |  |

### `whiteLabelSubscription`

- Type: `WhiteLabelSubscription`

Arguments:
No arguments.

### `automationExecutions`

- Type: `[AutomationExecution!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `AutomationExecutionFilterInput!` | `` |  |
