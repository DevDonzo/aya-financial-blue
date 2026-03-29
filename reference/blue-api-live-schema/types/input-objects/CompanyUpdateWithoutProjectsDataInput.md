# `CompanyUpdateWithoutProjectsDataInput`

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
| `activities` | `ActivityUpdateManyWithoutCompanyInput` | `` |  |
| `companyUsers` | `CompanyUserUpdateManyWithoutCompanyInput` | `` |  |
| `files` | `FileUpdateManyWithoutCompanyInput` | `` |  |
| `image` | `ImageUpdateOneInput` | `` |  |
| `license` | `CompanyLicenseUpdateOneWithoutCompanyInput` | `` |  |
| `subscriptionPlan` | `CompanySubscriptionPlanUpdateOneWithoutCompanyInput` | `` |  |
| `links` | `LinkUpdateManyWithoutCompanyInput` | `` |  |
