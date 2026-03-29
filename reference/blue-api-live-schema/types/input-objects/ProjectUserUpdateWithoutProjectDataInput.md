# `ProjectUserUpdateWithoutProjectDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `user` | `UserUpdateOneRequiredWithoutProjectUsersInput` | `` |  |
| `projectUserFolders` | `ProjectUserFolderUpdateManyWithoutProjectUserInput` | `` |  |
| `level` | `UserAccessLevel` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `position` | `Float` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
