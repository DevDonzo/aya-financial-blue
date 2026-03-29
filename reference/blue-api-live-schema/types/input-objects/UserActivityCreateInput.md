# `UserActivityCreateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `activity` | `ActivityCreateOneWithoutUserActivitiesInput!` | `` |  |
| `user` | `UserCreateOneWithoutUserActivitiesInput!` | `` |  |
| `isSeen` | `Boolean` | `` |  |
| `isRead` | `Boolean` | `` |  |
