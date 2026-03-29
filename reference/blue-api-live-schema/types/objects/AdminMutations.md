# `AdminMutations`

- Kind: `OBJECT`

## Fields

### `activateCompanyLicense`

- Type: `Company`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `ActivateCompanyLicenseInput!` | `` |  |

### `banCompany`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `createCompanyLicenses`

- Type: `[CompanyLicense!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `CreateCompanyLicensesInput!` | `` |  |

### `deactivateCompanyLicense`

- Type: `Company`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `DeactivateCompanyLicenseInput!` | `` |  |

### `deleteCompanyLicense`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `deleteUser`

- Type: `User`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `grantLicense`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `GrantLicenseInput!` | `` |  |

### `linkCompanyLicense`

- Type: `CompanyLicense`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `LinkCompanyLicenseInput!` | `` |  |

### `revokeLicense`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `RevokeLicenseInput!` | `` |  |

### `unbanCompany`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `id` | `String!` | `` |  |

### `updateCompany`

- Type: `Company!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateCompanyInput!` | `` |  |

### `updateAdminSettings`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateAdminSettingsInput!` | `` |  |

### `updateLicenses`

- Type: `[CompanyLicense!]!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpdateLicensesInput!` | `` |  |

### `upgradeLicense`

- Type: `Boolean`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `UpgradeLicenseInput!` | `` |  |

### `manageSearchIndex`

- Type: `SearchIndexJobStatus!`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `input` | `SearchIndexManagementInput!` | `` |  |
