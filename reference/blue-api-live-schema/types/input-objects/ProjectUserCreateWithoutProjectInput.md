# `ProjectUserCreateWithoutProjectInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `user` | `UserCreateOneWithoutProjectUsersInput!` | `` |  |
| `projectUserFolders` | `ProjectUserFolderCreateManyWithoutProjectUserInput` | `` |  |
| `level` | `UserAccessLevel!` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `position` | `Float` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
