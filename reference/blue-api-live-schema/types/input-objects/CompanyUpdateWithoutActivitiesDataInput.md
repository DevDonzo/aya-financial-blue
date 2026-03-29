# `CompanyUpdateWithoutActivitiesDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `name` | `String` | `` |  |
| `slug` | `String` | `` |  |
| `description` | `String` | `` |  |
| `freeTrialStartedAt` | `DateTime` | `` |  |
| `freeTrialExpiredAt` | `DateTime` | `` |  |
| `subscribedAt` | `DateTime` | `` |  |
| `freeTrialExtendedAt` | `DateTime` | `` |  |
| `freeTrialExtendedBy` | `UserUpdateOneInput` | `` |  |
| `companyUsers` | `CompanyUserUpdateManyWithoutCompanyInput` | `` |  |
| `files` | `FileUpdateManyWithoutCompanyInput` | `` |  |
| `image` | `ImageUpdateOneInput` | `` |  |
| `license` | `CompanyLicenseUpdateOneWithoutCompanyInput` | `` |  |
| `projects` | `ProjectUpdateManyWithoutCompanyInput` | `` |  |
| `subscriptionPlan` | `CompanySubscriptionPlanUpdateOneWithoutCompanyInput` | `` |  |
| `links` | `LinkUpdateManyWithoutCompanyInput` | `` |  |
