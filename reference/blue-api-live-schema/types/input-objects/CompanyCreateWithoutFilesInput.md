# `CompanyCreateWithoutFilesInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `name` | `String!` | `` |  |
| `slug` | `String!` | `` |  |
| `description` | `String` | `` |  |
| `freeTrialStartedAt` | `DateTime` | `` |  |
| `freeTrialExpiredAt` | `DateTime` | `` |  |
| `subscribedAt` | `DateTime` | `` |  |
| `freeTrialExtendedAt` | `DateTime` | `` |  |
| `freeTrialExtendedBy` | `UserCreateOneInput` | `` |  |
| `activities` | `ActivityCreateManyWithoutCompanyInput` | `` |  |
| `companyUsers` | `CompanyUserCreateManyWithoutCompanyInput` | `` |  |
| `image` | `ImageCreateOneInput` | `` |  |
| `license` | `CompanyLicenseCreateOneWithoutCompanyInput` | `` |  |
| `projects` | `ProjectCreateManyWithoutCompanyInput` | `` |  |
| `subscriptionPlan` | `CompanySubscriptionPlanCreateOneWithoutCompanyInput` | `` |  |
| `links` | `LinkCreateManyWithoutCompanyInput` | `` |  |
