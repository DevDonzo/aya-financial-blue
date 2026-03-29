# `AdminQueries`

- Kind: `OBJECT`

## Fields

### `adminSettings`

- Type: `AdminSettings!`

Arguments:
No arguments.

### `companies`

- Type: `CompanyPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CompanyFilter` | `` |  |
| `sort` | `[CompanySort!]` | `` |  |
| `limit` | `Int` | `20` |  |
| `skip` | `Int` | `0` |  |

### `companyLicenses`

- Type: `CompanyLicensePagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `CompanyLicenseFilter` | `` |  |
| `limit` | `Int` | `20` |  |
| `skip` | `Int` | `0` |  |

### `dashboardOverview`

- Type: `AdminOverviewStats!`

Arguments:
No arguments.

### `projects`

- Type: `ProjectPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `ProjectFilterInput` | `` |  |
| `sort` | `[ProjectSort!]` | `[name_ASC]` |  |
| `take` | `Int` | `50` |  |
| `skip` | `Int` | `0` |  |

### `users`

- Type: `UserPagination!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `filter` | `UserListFilter` | `` |  |
| `sort` | `[UserOrderByInput!]` | `` |  |
| `take` | `Int` | `20` |  |
| `skip` | `Int` | `0` |  |
