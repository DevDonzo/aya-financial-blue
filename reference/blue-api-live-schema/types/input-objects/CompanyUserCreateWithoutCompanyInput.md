# `CompanyUserCreateWithoutCompanyInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `user` | `UserCreateOneWithoutCompanyUsersInput!` | `` |  |
| `level` | `UserAccessLevel!` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `companyUserNotificationOptions` | `CompanyUserNotificationOptionCreateManyWithoutCompanyUserInput` | `` |  |
| `companyUserFolders` | `CompanyUserFolderCreateManyWithoutCompanyUserInput` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
