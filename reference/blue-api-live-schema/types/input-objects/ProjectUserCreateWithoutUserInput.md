# `ProjectUserCreateWithoutUserInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `project` | `ProjectCreateOneWithoutProjectUsersInput!` | `` |  |
| `projectUserFolders` | `ProjectUserFolderCreateManyWithoutProjectUserInput` | `` |  |
| `level` | `UserAccessLevel!` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `position` | `Float` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
