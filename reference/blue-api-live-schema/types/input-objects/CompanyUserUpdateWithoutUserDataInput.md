# `CompanyUserUpdateWithoutUserDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `company` | `CompanyUpdateOneRequiredWithoutCompanyUsersInput` | `` |  |
| `level` | `UserAccessLevel` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `companyUserNotificationOptions` | `CompanyUserNotificationOptionUpdateManyWithoutCompanyUserInput` | `` |  |
| `companyUserFolders` | `CompanyUserFolderUpdateManyWithoutCompanyUserInput` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
