# `Project`

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

### `slug`

- Type: `String!`

Arguments:
No arguments.

### `name`

- Type: `String!`

Arguments:
No arguments.

### `description`

- Type: `String`

Arguments:
No arguments.

### `archived`

- Type: `Boolean`

Arguments:
No arguments.

### `image`

- Type: `Image`

Arguments:
No arguments.

### `color`

- Type: `String`

Arguments:
No arguments.

### `icon`

- Type: `String`

Arguments:
No arguments.

### `company`

- Type: `Company!`

Arguments:
No arguments.

### `customFields`

- Type: `[CustomField!]!`
- Deprecated: yes
- Deprecation reason: Use customFields query instead

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CustomFieldWhereInput` | `` |  |
| `orderBy` | `CustomFieldOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `folder`

- Type: `Folder`

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

### `accessLevel`

- Type: `UserAccessLevel`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `userId` | `String` | `` |  |

### `allowNotification`

- Type: `Boolean!`

Arguments:
No arguments.

### `position`

- Type: `Float!`

Arguments:
No arguments.

### `unseenActivity`

- Type: `Int!`
- Deprecated: yes
- Deprecation reason: User Project.unseenActivityCount property instead.

Arguments:
No arguments.

### `unseenActivityCount`

- Type: `Int!`

Arguments:
No arguments.

### `todoListsMaxPosition`

- Type: `Float!`

Arguments:
No arguments.

### `lastAccessedAt`

- Type: `DateTime`

Arguments:
No arguments.

### `category`

- Type: `ProjectCategory!`

Arguments:
No arguments.

### `isTemplate`

- Type: `Boolean!`

Arguments:
No arguments.

### `isOfficialTemplate`

- Type: `Boolean!`

Arguments:
No arguments.

### `automationsCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `isActive` | `Boolean` | `` |  |

### `totalFileCount`

- Type: `Int`

Arguments:
No arguments.

### `totalFileSize`

- Type: `Float`

Arguments:
No arguments.

### `hideEmailFromRoles`

- Type: `[UserAccessLevel!]`

Arguments:
No arguments.

### `hideStatusUpdate`

- Type: `Boolean`

Arguments:
No arguments.

### `todoAlias`

- Type: `String`

Arguments:
No arguments.

### `hideRecordCount`

- Type: `Boolean`

Arguments:
No arguments.

### `showTimeSpentInTodoList`

- Type: `Boolean`

Arguments:
No arguments.

### `showTimeSpentInProject`

- Type: `Boolean`

Arguments:
No arguments.

### `duplicateDetection`

- Type: `Boolean`

Arguments:
No arguments.

### `compactCards`

- Type: `Boolean`

Arguments:
No arguments.

### `todoFields`

- Type: `[TodoField]`

Arguments:
No arguments.

### `features`

- Type: `[ProjectFeature!]`

Arguments:
No arguments.

### `sequenceCustomField`

- Type: `CustomField`

Arguments:
No arguments.

### `coverConfig`

- Type: `TodoCoverConfig`

Arguments:
No arguments.

### `cardConfig`

- Type: `TodoCardConfig`

Arguments:
No arguments.

### `members`

- Type: `[ProjectMember!]!`
- Description: Returns project members filtered by userIds from parent projectList query.
Only populated when projectList is called with userIds filter.

Arguments:
No arguments.

### `defaultSavedView`

- Type: `SavedView`
- Description: The workspace-wide default saved view (set by admin/owner)

Arguments:
No arguments.

### `userDefaultSavedView`

- Type: `SavedView`
- Description: The current user's personal default saved view for this workspace

Arguments:
No arguments.

### `nameFormula`

- Type: `JSON`
- Description: Name formula configuration for auto-generating record titles

Arguments:
No arguments.

### `nameFormulaEnabled`

- Type: `Boolean!`
- Description: Whether the name formula is enabled for this project

Arguments:
No arguments.

### `nameFormulaDisplay`

- Type: `String`
- Description: Human-readable display of the name formula with field names instead of UIDs

Arguments:
No arguments.

### `bulkActionComplete`

- Type: `Boolean`

Arguments:
No arguments.

### `bulkActionAssignee`

- Type: `Boolean`

Arguments:
No arguments.

### `bulkActionTag`

- Type: `Boolean`

Arguments:
No arguments.

### `bulkActionDueDate`

- Type: `Boolean`

Arguments:
No arguments.

### `activities`

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

### `discussions`

- Type: `[Discussion!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `DiscussionWhereInput` | `` |  |
| `orderBy` | `DiscussionOrderByInput` | `` |  |
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

### `statusUpdates`

- Type: `[StatusUpdate!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `StatusUpdateWhereInput` | `` |  |
| `orderBy` | `StatusUpdateOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `tags`

- Type: `[Tag!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `TagWhereInput` | `` |  |
| `orderBy` | `TagOrderByInput` | `` |  |
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
