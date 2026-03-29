# `ProjectUserUpdateWithoutProjectUserFoldersDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutProjectUsersInput` | `` |  |
| `user` | `UserUpdateOneRequiredWithoutProjectUsersInput` | `` |  |
| `level` | `UserAccessLevel` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `position` | `Float` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
