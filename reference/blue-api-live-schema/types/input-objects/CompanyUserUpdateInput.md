# `CompanyUserUpdateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `company` | `CompanyUpdateOneRequiredWithoutCompanyUsersInput` | `` |  |
| `user` | `UserUpdateOneRequiredWithoutCompanyUsersInput` | `` |  |
| `level` | `UserAccessLevel` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `companyUserNotificationOptions` | `CompanyUserNotificationOptionUpdateManyWithoutCompanyUserInput` | `` |  |
| `companyUserFolders` | `CompanyUserFolderUpdateManyWithoutCompanyUserInput` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
