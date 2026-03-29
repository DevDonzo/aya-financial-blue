# `CompanyUserUpdateWithoutCompanyUserNotificationOptionsDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `company` | `CompanyUpdateOneRequiredWithoutCompanyUsersInput` | `` |  |
| `user` | `UserUpdateOneRequiredWithoutCompanyUsersInput` | `` |  |
| `level` | `UserAccessLevel` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `companyUserFolders` | `CompanyUserFolderUpdateManyWithoutCompanyUserInput` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
