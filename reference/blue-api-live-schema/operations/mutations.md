# Mutations

### `acceptInvitation`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `addSelfToProject`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `ID!` | `` |  |

### `addTodoAssignees`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `AddTodoAssigneesInput!` | `` |  |

### `addProjectToTodo`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `AddProjectToTodoInput!` | `` |  |

### `adminMutations`

- Type: `AdminMutations!`

Arguments:
No arguments.

### `aiTag`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `AITagInput!` | `` |  |

### `applyCompanyLicense`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ApplyCompanyLicenseInput!` | `` |  |

### `archiveProject`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String` | `` |  |

### `archiveTodo`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `cancelCompanySubscriptionPlan`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CancelCompanySubscriptionPlanInput!` | `` |  |

### `cancelInvitation`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `cancelTodoImport`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `changeCompanySubscriptionPlan`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ChangeCompanySubscriptionPlanInput!` | `` |  |

### `changeTodoDoneStatus`

- Type: `Boolean`
- Deprecated: yes
- Deprecation reason: Use `Mutation.updateTodoDoneStatus` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `commentTyping`

- Type: `User!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |
| `name` | `CommentTypingSubscriptionName!` | `` |  |

### `convertProjectToTemplate`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ConvertProjectToTemplateInput!` | `` |  |

### `copyChart`

- Type: `Chart!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CopyChartInput!` | `` |  |

### `copyDashboard`

- Type: `Dashboard!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CopyDashboardInput!` | `` |  |

### `copyForm`

- Type: `Form!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CopyFormInput!` | `` |  |

### `copyTodo`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CopyTodoInput!` | `` |  |

### `copyProject`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CopyProjectInput!` | `` |  |

### `copyAutomation`

- Type: `Automation!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CopyAutomationInput!` | `` |  |

### `createAutomation`

- Type: `Automation!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateAutomationInput!` | `` |  |

### `createCalendarSyncToken`

- Type: `String!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCalendarSyncTokenInput!` | `` |  |

### `createChecklist`

- Type: `Checklist!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateChecklistInput!` | `` |  |

### `createChecklistItem`

- Type: `ChecklistItem!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateChecklistItemInput!` | `` |  |

### `createChat`

- Type: `Chat!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateChatInput!` | `` |  |

### `createChatMessage`

- Type: `ChatMessage!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateChatMessageInput!` | `` |  |

### `createComment`

- Type: `Comment!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCommentInput!` | `` |  |

### `createCompany`

- Type: `Company!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCompanyInput!` | `` |  |

### `createCompanyCheckoutURL`

- Type: `String!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCompanyCheckoutURLInput!` | `` |  |

### `createCompanySubscriptionPlan`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCompanySubscriptionPlanInput!` | `` |  |

### `createCustomDomain`

- Type: `CustomDomain!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCustomDomainInput!` | `` |  |

### `createChart`

- Type: `Chart!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateChartInput!` | `` |  |

### `createChartSegment`

- Type: `ChartSegment!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateChartSegmentInput!` | `` |  |

### `createChartSegmentValue`

- Type: `ChartSegmentValue!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateChartSegmentValueInput!` | `` |  |

### `createCustomField`

- Type: `CustomField!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCustomFieldInput!` | `` |  |

### `createCustomFieldOption`

- Type: `CustomFieldOption!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCustomFieldOptionInput!` | `` |  |

### `createCustomFieldOptions`

- Type: `[CustomFieldOption!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCustomFieldOptionsInput!` | `` |  |

### `createDashboard`

- Type: `Dashboard!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateDashboardInput!` | `` |  |

### `createSavedView`

- Type: `SavedView!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateSavedViewInput!` | `` |  |

### `createDiscussion`

- Type: `Discussion!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateDiscussionInput!` | `` |  |

### `createDocument`

- Type: `Document!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateDocumentInput!` | `` |  |

### `createEmailTemplate`

- Type: `EmailTemplate!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateEmailTemplateInput!` | `` |  |

### `createFile`

- Type: `File!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateFileInput!` | `` |  |

### `createForm`

- Type: `Form!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateFormInput!` | `` |  |

### `uploadCompanyImage`

- Type: `Company!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UploadCompanyImageInput!` | `` |  |

### `uploadFile`

- Type: `File!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UploadFileInput!` | `` |  |

### `uploadFiles`

- Type: `[File!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UploadFilesInput!` | `` |  |

### `uploadImage`

- Type: `Image!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UploadImageInput!` | `` |  |

### `uploadProfileImage`

- Type: `User!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UploadProfileImageInput!` | `` |  |

### `uploadProjectImage`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UploadProjectImageInput!` | `` |  |

### `createFolder`

- Type: `Folder!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateFolderInput!` | `` |  |

### `createLink`

- Type: `Link!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateLinkInput!` | `` |  |

### `createPersonalAccessToken`

- Type: `PersonalAccessToken!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreatePersonalAccessTokenInput!` | `` |  |

### `createPortableDocument`

- Type: `PortableDocument!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreatePortableDocumentInput!` | `` |  |

### `createPortableDocumentField`

- Type: `PortableDocumentField!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreatePortableDocumentFieldInput!` | `` |  |

### `createProject`

- Type: `Project`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateProjectInput!` | `` |  |

### `createProjectUserRole`

- Type: `ProjectUserRole!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateProjectUserRoleInput!` | `` |  |

### `createReport`

- Type: `Report!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateReportInput!` | `` |  |

### `updateReport`

- Type: `Report!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |
| `input` | `UpdateReportInput!` | `` |  |

### `deleteReport`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `duplicateReport`

- Type: `Report!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |
| `input` | `DuplicateReportInput` | `` |  |

### `refreshReportAggregations`

- Type: `Report!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `reportId` | `String!` | `` |  |

### `createRepeatingTodo`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateRepeatingTodoInput!` | `` |  |

### `createSmtpCredential`

- Type: `SmtpCredential!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateSmtpCredentialInput!` | `` |  |

### `createStatusUpdate`

- Type: `StatusUpdate!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateStatusUpdateInput!` | `` |  |

### `createWhiteLabelSubscriptionPortalURL`

- Type: `String!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateWhiteLabelSubscriptionPortalURLInput!` | `` |  |

### `createWhiteLabelSubscriptionCheckoutURL`

- Type: `String!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateWhiteLabelSubscriptionCheckoutURLInput!` | `` |  |

### `createTag`

- Type: `Tag!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateTagInput!` | `` |  |

### `createTodo`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateTodoInput!` | `` |  |

### `createTodoAction`

- Type: `TodoAction`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateTodoActionInput!` | `` |  |

### `createTodoCustomFieldFile`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateTodoCustomFieldFileInput!` | `` |  |

### `createTodoDependency`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateTodoDependencyInput!` | `` |  |

### `createTodoList`

- Type: `TodoList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateTodoListInput!` | `` |  |

### `createWebhook`

- Type: `Webhook!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateWebhookInput!` | `` |  |

### `createOAuthConnection`

- Type: `OAuthConnection!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateOAuthConnectionInput!` | `` |  |

### `deleteAutomation`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteChat`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteChart`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteChartSegment`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteChartSegmentValue`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteChecklist`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteChecklistItem`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteComment`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteCompany`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteCompanyInput!` | `` |  |

### `deleteCompanyRequest`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteCompanyRequestInput!` | `` |  |

### `deleteCustomDomain`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteCustomField`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteCustomFieldOption`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `customFieldId` | `String!` | `` |  |
| `optionId` | `String!` | `` |  |
| `todoId` | `String` | `` |  |

### `deleteDashboard`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteSavedView`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteDiscussion`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteDocument`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteEmailTemplate`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteFile`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteFiles`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `ids` | `[String!]!` | `` |  |

### `deleteFolder`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteFolderInput!` | `` |  |

### `deleteForm`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteFormField`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteLink`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteLinkInput!` | `` |  |

### `deletePersonalAccessToken`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeletePersonalAccessTokenInput!` | `` |  |

### `deletePortableDocument`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deletePortableDocumentField`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteProject`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteProjectUserRole`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteProjectUserRoleInput!` | `` |  |

### `deleteRepeatingTodo`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteSmtpCredential`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteStatusUpdate`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteTag`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteTodo`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteTodoInput!` | `` |  |

### `deleteTodoCustomFieldFile`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteTodoCustomFieldFileInput!` | `` |  |

### `deleteTodoDependency`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteTodoDependencyInput!` | `` |  |

### `deleteTodoList`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteTodoListInput!` | `` |  |

### `deleteWebhook`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteWebhookInput!` | `` |  |

### `deleteOAuthConnection`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `disableWebhook`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DisableWebhookInput!` | `` |  |

### `editAutomation`

- Type: `Automation!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditAutomationInput!` | `` |  |

### `editChart`

- Type: `Chart!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditChartInput!` | `` |  |

### `editChartSegment`

- Type: `ChartSegment!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditChartSegmentInput!` | `` |  |

### `editChartSegmentValue`

- Type: `ChartSegmentValue!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditChartSegmentValueInput!` | `` |  |

### `editChecklist`

- Type: `Checklist!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditChecklistInput!` | `` |  |

### `editChecklistItem`

- Type: `ChecklistItem!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditChecklistItemInput!` | `` |  |

### `editComment`

- Type: `Comment!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditCommentInput!` | `` |  |

### `editCompany`

- Type: `Company!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditCompanyInput!` | `` |  |

### `editCustomField`

- Type: `CustomField!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditCustomFieldInput!` | `` |  |

### `editCustomFieldOption`

- Type: `CustomFieldOption!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditCustomFieldOptionInput!` | `` |  |

### `editDashboard`

- Type: `Dashboard!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditDashboardInput!` | `` |  |

### `editSavedView`

- Type: `SavedView!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditSavedViewInput!` | `` |  |

### `updateSavedViewPosition`

- Type: `SavedView!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |
| `position` | `Float!` | `` |  |

### `setWorkspaceDefaultView`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `viewId` | `String` | `` |  |

### `setUserDefaultView`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `viewId` | `String` | `` |  |

### `editFolder`

- Type: `Folder!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditFolderInput!` | `` |  |

### `editProfile`

- Type: `User!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditProfileInput!` | `` |  |

### `editProject`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditProjectInput!` | `` |  |

### `editTag`

- Type: `Tag!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditTagInput!` | `` |  |

### `editTodo`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditTodoInput!` | `` |  |

### `editTodoList`

- Type: `TodoList!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `EditTodoListInput!` | `` |  |

### `exportCSVTemplate`

- Type: `String!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ExportCSVTemplateInput!` | `` |  |

### `exportChartCSV`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `chartId` | `ID!` | `` |  |
| `filter` | `TodoFilterInput` | `` |  |

### `exportTodos`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ExportTodosInput!` | `` |  |

### `exportReport`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ExportReportInput!` | `` |  |

### `extendFreeTrial`

- Type: `Company!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ExtendFreeTrialInput!` | `` |  |

### `generateAISummary`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `GenerateAISummaryInput!` | `` |  |

### `handleTodoReminder`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `key` | `String!` | `` |  |

### `hideProjectEmails`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `HideProjectEmailsInput!` | `` |  |

### `importTodos`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ImportTodosInput!` | `` |  |

### `invitationSignUp`

- Type: `AuthPayload!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `InvitationSignUpInput!` | `` |  |

### `inviteUser`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `InviteUserInput!` | `` |  |

### `leaveCompany`

- Type: `Boolean`

Arguments:
No arguments.

### `leaveProject`

- Type: `Boolean`

Arguments:
No arguments.

### `markMentionAsRead`

- Type: `Mention!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `MarkMentionAsReadInput!` | `` |  |

### `markMentionAsUnread`

- Type: `Mention!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `MarkMentionAsUnreadInput!` | `` |  |

### `markAllMentionsAsRead`

- Type: `[Mention!]`

Arguments:
No arguments.

### `markActivityAsRead`

- Type: `Boolean!`
- Deprecated: yes
- Deprecation reason: Use markMentionAsRead instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `MarkActivityAsReadInput!` | `` |  |

### `markActivityAsUnread`

- Type: `Boolean!`
- Deprecated: yes
- Deprecation reason: Use markMentionAsUnread instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `MarkActivityAsUnreadInput!` | `` |  |

### `markAllActivityAsRead`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `MarkAllActivityAsReadInput!` | `` |  |

### `markAllActivityAsSeen`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `MarkAllActivityAsSeenInput!` | `` |  |

### `markAllMentionAsRead`

- Type: `Boolean!`
- Deprecated: yes
- Deprecation reason: Use markAllMentionsAsRead instead.

Arguments:
No arguments.

### `markTodoListAsDone`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `todoListId` | `String!` | `` |  |
| `filter` | `TodosFilter` | `` |  |

### `markTodoListAsUndone`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `todoListId` | `String!` | `` |  |
| `filter` | `TodosFilter` | `` |  |

### `moveTodo`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `MoveTodoInput!` | `` |  |

### `updateTodos`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateTodosInput!` | `` |  |

### `notifyTodoChecklistItemOverdue`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `todoChecklistItemId` | `String!` | `` |  |

### `printPortableDocument`

- Type: `String`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `pdfId` | `String!` | `` |  |
| `todoId` | `String!` | `` |  |

### `reactivateCompanySubscriptionPlan`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ReactivateCompanySubscriptionPlanInput!` | `` |  |

### `recalculateCharts`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `RecalculateChartsInput!` | `` |  |

### `rejectInvitation`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `removeCompanyUser`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `RemoveCompanyUserInput!` | `` |  |

### `removeProjectUser`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `RemoveProjectUserInput!` | `` |  |

### `removeProjectFromTemplates`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `RemoveProjectFromTemplatesInput!` | `` |  |

### `removeProjectFromTodo`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `RemoveProjectFromTodoInput!` | `` |  |

### `removeTodoAssignees`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `RemoveTodoAssigneesInput!` | `` |  |

### `repositionProjects`

- Type: `[Project!]!`

Arguments:
No arguments.

### `resendInvitation`

- Type: `Invitation!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `sendTestEmail`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SendTestEmailInput!` | `` |  |

### `setProfileImage`

- Type: `User!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ImageInput` | `` |  |

### `setProfileLocale`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `locale` | `Locale` | `` |  |

### `setProjectFolder`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetProjectFolderInput!` | `` |  |

### `setFileFolder`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetFileFolderInput!` | `` |  |

### `setParentFolder`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetParentFolderInput!` | `` |  |

### `setTodoAssignees`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetTodoAssigneesInput!` | `` |  |

### `setTodoReminder`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetTodoReminderInput!` | `` |  |

### `setChecklistItemAssignees`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetChecklistItemAssigneesInput!` | `` |  |

### `setTodoCoverConfig`

- Type: `TodoCoverConfig!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetTodoCoverConfigInput!` | `` |  |

### `setTodoCover`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetTodoCoverInput!` | `` |  |

### `createTodoCardConfig`

- Type: `TodoCardConfig!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateTodoCardConfigInput!` | `` |  |

### `upsertTodoCardField`

- Type: `TodoCardConfig!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpsertTodoCardFieldInput!` | `` |  |

### `deleteTodoCardField`

- Type: `TodoCardConfig!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeleteTodoCardFieldInput!` | `` |  |

### `resetTodoCardConfig`

- Type: `TodoCardConfig!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ResetTodoCardConfigInput!` | `` |  |

### `setTodoCustomField`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetTodoCustomFieldInput!` | `` |  |

### `bulkSetCustomField`

- Type: `BulkOperationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `BulkSetCustomFieldInput!` | `` |  |

### `bulkClickButton`

- Type: `BulkOperationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `BulkClickButtonInput!` | `` |  |

### `setTodoTags`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SetTodoTagsInput!` | `` |  |

### `signIn`

- Type: `AuthPayload!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SignInInput!` | `` |  |

### `signInRequest`

- Type: `SignInRequestResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `email` | `String!` | `` |  |
| `cb` | `String` | `` |  |

### `signInSilent`

- Type: `AuthPayload`

Arguments:
No arguments.

### `socialAuth`

- Type: `SocialAuthPayload!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `idToken` | `String!` | `` |  |

### `signOut`

- Type: `Boolean`

Arguments:
No arguments.

### `signUp`

- Type: `AuthPayload!`
- Deprecated: yes
- Deprecation reason: Use `Mutation.invitationSignUp` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SignUpInput!` | `` |  |

### `subscribeToPushNotifications`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `token` | `String!` | `` |  |
| `unsubscribingToken` | `String` | `` |  |

### `submitForm`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SubmitFormInput!` | `` |  |

### `syncPG`

- Type: `Boolean`
- Deprecated: yes
- Deprecation reason: This API is no longer available.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `secret` | `String!` | `` |  |

### `toggleCompanyNotification`

- Type: `Boolean!`

Arguments:
No arguments.

### `toggleEmailNotificationOption`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `name` | `NotificationOptionName!` | `` |  |

### `toggleProjectNotification`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |

### `togglePushNotificationOption`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `name` | `NotificationOptionName!` | `` |  |

### `triggerScheduleAutomation`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `unarchiveProject`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String` | `` |  |

### `unsubscribeFromPushNotifications`

- Type: `MutationResult!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `token` | `String!` | `` |  |

### `updateChat`

- Type: `Chat!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateChatInput!` | `` |  |

### `updateCompanyAccessLevel`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateCompanyAccessLevelInput!` | `` |  |

### `updateCompanyUserFolderPermission`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateCompanyUserFolderPermissionInput!` | `` |  |

### `updateCompanySubscriptionPlanCard`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateCompanySubscriptionPlanCardInput!` | `` |  |

### `updateCompanyBillingAddress`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateCompanyBillingAddressInput!` | `` |  |

### `updateCompanyTheme`

- Type: `Company!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateCompanyThemeInput!` | `` |  |

### `updateCustomDomain`

- Type: `CustomDomain!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateCustomDomainInput!` | `` |  |

### `updateChecklistItemDueDate`

- Type: `ChecklistItem!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateChecklistItemDueDateInput!` | `` |  |

### `updateCurrentUserLastActiveAt`

- Type: `User!`

Arguments:
No arguments.

### `updateDiscussion`

- Type: `Discussion!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateDiscussionInput!` | `` |  |

### `updateDocument`

- Type: `Document!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateDocumentInput!` | `` |  |

### `updateEmail`

- Type: `User!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateEmailInput!` | `` |  |

### `updateEmailRequest`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateEmailRequestInput!` | `` |  |

### `updateEmailTemplate`

- Type: `EmailTemplate!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateEmailTemplateInput!` | `` |  |

### `updateFile`

- Type: `File!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateFileInput!` | `` |  |

### `updateForm`

- Type: `Form!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateFormInput!` | `` |  |

### `updateFolderPosition`

- Type: `Folder!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateFolderPositionInput!` | `` |  |

### `updateImportProgress`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateImportProgressInput!` | `` |  |

### `updateLink`

- Type: `Link!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateLinkInput!` | `` |  |

### `updatePortableDocument`

- Type: `PortableDocument!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdatePortableDocumentInput!` | `` |  |

### `updatePortableDocumentField`

- Type: `PortableDocumentField!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdatePortableDocumentFieldInput!` | `` |  |

### `updateProjectAccessLevel`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateProjectAccessLevelInput!` | `` |  |

### `updateProjectLastAccessedAt`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateProjectLastAccessedAtInput!` | `` |  |

### `updateProjectPosition`

- Type: `Project!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `position` | `Float!` | `` |  |
| `folderId` | `String` | `` |  |

### `updateProjectUserRole`

- Type: `ProjectUserRole!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateProjectUserRoleInput!` | `` |  |

### `updateRepeatingTodo`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateRepeatingTodoInput!` | `` |  |

### `updateSmtpCredential`

- Type: `SmtpCredential!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateSmtpCredentialInput!` | `` |  |

### `updateTodoDependency`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateTodoDependencyInput!` | `` |  |

### `updateTodoDoneStatus`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `todoId` | `String!` | `` |  |

### `updateTodoDueDate`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `todoId` | `String!` | `` |  |
| `startedAt` | `DateTime` | `` |  |
| `duedAt` | `DateTime` | `` |  |
| `timezone` | `String` | `` |  |

### `updateTodoTitle`

- Type: `Todo!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `todoId` | `String!` | `` |  |
| `title` | `String!` | `` |  |

### `updateWebhook`

- Type: `Webhook!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateWebhookInput!` | `` |  |

### `updateOAuthConnection`

- Type: `OAuthConnection!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateOAuthConnectionInput!` | `` |  |

### `upgradeCompanyCheckoutURL`

- Type: `String!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpgradeCompanyCheckoutURLInput!` | `` |  |

### `upgradeCompanyLicense`

- Type: `String!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpgradeCompanyLicenseInput!` | `` |  |

### `upsertFormField`

- Type: `FormField!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpsertFormFieldInput!` | `` |  |

### `undoAITag`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UndoAITagInput!` | `` |  |

### `verifyCustomDomain`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `name` | `String!` | `` |  |

### `verifySmtpCredential`

- Type: `Boolean!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `VerifySmtpCredentialInput!` | `` |  |
