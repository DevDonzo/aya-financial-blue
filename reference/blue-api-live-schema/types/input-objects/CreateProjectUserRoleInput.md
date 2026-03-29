# `CreateProjectUserRoleInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` |  |
| `name` | `String!` | `` |  |
| `description` | `String` | `` |  |
| `allowInviteOthers` | `Boolean` | `` |  |
| `allowMarkRecordsAsDone` | `Boolean` | `` |  |
| `showOnlyAssignedTodos` | `Boolean` | `` |  |
| `showOnlyMentionedComments` | `Boolean` | `` |  |
| `isActivityEnabled` | `Boolean` | `` |  |
| `isFormsEnabled` | `Boolean` | `` |  |
| `isWikiEnabled` | `Boolean` | `` |  |
| `isChatEnabled` | `Boolean` | `` |  |
| `isDocsEnabled` | `Boolean` | `` |  |
| `isFilesEnabled` | `Boolean` | `` |  |
| `isRecordsEnabled` | `Boolean` | `` |  |
| `isPeopleEnabled` | `Boolean` | `` |  |
| `canCreateRecords` | `Boolean` | `` |  |
| `canDeleteRecords` | `Boolean` | `` |  |
| `canDeleteFiles` | `Boolean` | `` |  |
| `canEditLists` | `Boolean` | `` |  |
| `recordTagFilter` | `RecordTagFilterInput` | `` |  |
| `recordFilter` | `RecordFilterInput` | `` |  |
| `customFields` | `[CreateProjectUserRoleCustomFieldInput!]` | `` |  |
| `todoLists` | `[CreateProjectUserRoleTodoListInput!]` | `` |  |
| `todoFields` | `[CreateProjectUserRoleTodoFieldInput!]` | `` |  |
