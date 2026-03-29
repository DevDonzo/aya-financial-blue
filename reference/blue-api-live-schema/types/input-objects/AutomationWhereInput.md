# `AutomationWhereInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `id_not` | `ID` | `` |  |
| `id_in` | `[ID!]` | `` |  |
| `id_not_in` | `[ID!]` | `` |  |
| `id_lt` | `ID` | `` |  |
| `id_lte` | `ID` | `` |  |
| `id_gt` | `ID` | `` |  |
| `id_gte` | `ID` | `` |  |
| `id_contains` | `ID` | `` |  |
| `id_not_contains` | `ID` | `` |  |
| `id_starts_with` | `ID` | `` |  |
| `id_not_starts_with` | `ID` | `` |  |
| `id_ends_with` | `ID` | `` |  |
| `id_not_ends_with` | `ID` | `` |  |
| `uid` | `String` | `` |  |
| `uid_not` | `String` | `` |  |
| `uid_in` | `[String!]` | `` |  |
| `uid_not_in` | `[String!]` | `` |  |
| `uid_lt` | `String` | `` |  |
| `uid_lte` | `String` | `` |  |
| `uid_gt` | `String` | `` |  |
| `uid_gte` | `String` | `` |  |
| `uid_contains` | `String` | `` |  |
| `uid_not_contains` | `String` | `` |  |
| `uid_starts_with` | `String` | `` |  |
| `uid_not_starts_with` | `String` | `` |  |
| `uid_ends_with` | `String` | `` |  |
| `uid_not_ends_with` | `String` | `` |  |
| `trigger` | `AutomationTriggerWhereInput` | `` |  |
| `actions_every` | `AutomationActionWhereInput` | `` |  |
| `actions_some` | `AutomationActionWhereInput` | `` |  |
| `actions_none` | `AutomationActionWhereInput` | `` |  |
| `isActive` | `Boolean` | `` |  |
| `isActive_not` | `Boolean` | `` |  |
| `createdAt` | `DateTime` | `` |  |
| `createdAt_not` | `DateTime` | `` |  |
| `createdAt_in` | `[DateTime!]` | `` |  |
| `createdAt_not_in` | `[DateTime!]` | `` |  |
| `createdAt_lt` | `DateTime` | `` |  |
| `createdAt_lte` | `DateTime` | `` |  |
| `createdAt_gt` | `DateTime` | `` |  |
| `createdAt_gte` | `DateTime` | `` |  |
| `updatedAt` | `DateTime` | `` |  |
| `updatedAt_not` | `DateTime` | `` |  |
| `updatedAt_in` | `[DateTime!]` | `` |  |
| `updatedAt_not_in` | `[DateTime!]` | `` |  |
| `updatedAt_lt` | `DateTime` | `` |  |
| `updatedAt_lte` | `DateTime` | `` |  |
| `updatedAt_gt` | `DateTime` | `` |  |
| `updatedAt_gte` | `DateTime` | `` |  |
| `project` | `ProjectWhereInput` | `` |  |
| `createdBy` | `UserWhereInput` | `` |  |
| `AND` | `[AutomationWhereInput!]` | `` |  |
| `OR` | `[AutomationWhereInput!]` | `` |  |
| `NOT` | `[AutomationWhereInput!]` | `` |  |
