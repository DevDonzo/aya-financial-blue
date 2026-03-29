# `Company`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

Arguments:
No arguments.

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `name`

- Type: `String!`

Arguments:
No arguments.

### `slug`

- Type: `String!`

Arguments:
No arguments.

### `description`

- Type: `String`

Arguments:
No arguments.

### `image`

- Type: `Image`

Arguments:
No arguments.

### `createdAt`

- Type: `DateTime!`

Arguments:
No arguments.

### `updatedAt`

- Type: `DateTime!`

Arguments:
No arguments.

### `owner`

- Type: `User`

Arguments:
No arguments.

### `customFields`

- Type: `[CustomField!]`
- Deprecated: yes
- Deprecation reason: Use `Query.customFields` instead.

Arguments:
No arguments.

### `projects`

- Type: `[Project!]`
- Deprecated: yes
- Deprecation reason: Use `Query.projects` instead.

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ProjectWhereInput` | `` |  |
| `orderBy` | `ProjectOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `allowNotification`

- Type: `Boolean!`

Arguments:
No arguments.

### `freeTrialStartedAt`

- Type: `DateTime`

Arguments:
No arguments.

### `freeTrialExpiredAt`

- Type: `DateTime`

Arguments:
No arguments.

### `freeTrialExtendedAt`

- Type: `DateTime`

Arguments:
No arguments.

### `subscriptionActive`

- Type: `Boolean!`

Arguments:
No arguments.

### `subscriptionTrialing`

- Type: `Boolean!`

Arguments:
No arguments.

### `subscriptionStatus`

- Type: `String!`

Arguments:
No arguments.

### `subscriptionPlan`

- Type: `CompanySubscriptionPlan`

Arguments:
No arguments.

### `subscribedAt`

- Type: `DateTime`

Arguments:
No arguments.

### `projectsCount`

- Type: `Int!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `archived` | `Boolean` | `` |  |
| `isTemplate` | `Boolean` | `` |  |

### `accessLevel`

- Type: `UserAccessLevel!`

Arguments:
No arguments.

### `canManageFolders`

- Type: `Boolean!`

Arguments:
No arguments.

### `license`

- Type: `CompanyLicense`

Arguments:
No arguments.

### `isLocked`

- Type: `Boolean`

Arguments:
No arguments.

### `theme`

- Type: `JSON`

Arguments:
No arguments.

### `appearance`

- Type: `AppearanceSettings`

Arguments:
No arguments.

### `whiteLabelSubscription`

- Type: `WhiteLabelSubscription`

Arguments:
No arguments.

### `whiteLabelSettings`

- Type: `JSON`

Arguments:
No arguments.

### `googleMapsSettings`

- Type: `GoogleMapsSettings`

Arguments:
No arguments.

### `workspaceAlias`

- Type: `String`

Arguments:
No arguments.

### `isEnterprise`

- Type: `Boolean`

Arguments:
No arguments.

### `isMapEnabled`

- Type: `Boolean`

Arguments:
No arguments.

### `isAIEnabled`

- Type: `Boolean`

Arguments:
No arguments.

### `isBanned`

- Type: `Boolean`

Arguments:
No arguments.

### `isUpgradableLTD`

- Type: `Boolean`

Arguments:
No arguments.

### `freeTrialExtendedBy`

- Type: `User`

Arguments:
No arguments.

### `activities`

- Type: `[Activity!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ActivityWhereInput` | `` |  |
| `orderBy` | `ActivityOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `companyUsers`

- Type: `[CompanyUser!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CompanyUserWhereInput` | `` |  |
| `orderBy` | `CompanyUserOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `files`

- Type: `[File!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FileWhereInput` | `` |  |
| `orderBy` | `FileOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `links`

- Type: `[Link!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `LinkWhereInput` | `` |  |
| `orderBy` | `LinkOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
