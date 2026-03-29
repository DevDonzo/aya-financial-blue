# `ProjectUserCreateWithoutProjectUserFoldersInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `project` | `ProjectCreateOneWithoutProjectUsersInput!` | `` |  |
| `user` | `UserCreateOneWithoutProjectUsersInput!` | `` |  |
| `level` | `UserAccessLevel!` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `position` | `Float` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
