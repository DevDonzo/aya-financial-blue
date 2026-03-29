# `CompanyUserCreateWithoutCompanyUserFoldersInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `company` | `CompanyCreateOneWithoutCompanyUsersInput!` | `` |  |
| `user` | `UserCreateOneWithoutCompanyUsersInput!` | `` |  |
| `level` | `UserAccessLevel!` | `` |  |
| `allowNotification` | `Boolean` | `` |  |
| `companyUserNotificationOptions` | `CompanyUserNotificationOptionCreateManyWithoutCompanyUserInput` | `` |  |
| `lastAccessedAt` | `DateTime` | `` |  |
