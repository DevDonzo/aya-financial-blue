# `ProjectUserUpdateWithoutUserDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `project` | `ProjectUpdateOneRequiredWithoutProjectUsersInput` | `` |  |
| `projectUserFolders` | `ProjectUserFolderUpdateManyWithoutProjectUserInput` | `` |  |
| `level` | `UserAccessLevel` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `position` | `Float` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
