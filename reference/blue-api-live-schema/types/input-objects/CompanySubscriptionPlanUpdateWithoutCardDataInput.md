# `CompanySubscriptionPlanUpdateWithoutCardDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `cusId` | `String` | `` |  |
| `subId` | `String` | `` |  |
| `planId` | `String` | `` |  |
| `planName` | `String` | `` |  |
| `status` | `String` | `` |  |
| `currentPeriodStart` | `DateTime` | `` |  |
| `currentPeriodEnd` | `DateTime` | `` |  |
| `cancelAt` | `DateTime` | `` |  |
| `canceledAt` | `DateTime` | `` |  |
| `cancelAtPeriodEnd` | `Boolean` | `` |  |
| `endedAt` | `DateTime` | `` |  |
| `trialStart` | `DateTime` | `` |  |
| `trialEnd` | `DateTime` | `` |  |
| `isPaid` | `Boolean` | `` |  |
| `paymentIntentId` | `String` | `` |  |
| `paymentIntentStatus` | `String` | `` |  |
| `paymentIntentClientSecret` | `String` | `` |  |
| `company` | `CompanyUpdateOneRequiredWithoutSubscriptionPlanInput` | `` |  |
| `user` | `UserUpdateOneRequiredWithoutSubscriptionPlansInput` | `` |  |
