# `Folder`

- Kind: `OBJECT`

## Fields

### `id`

- Type: `ID!`

Arguments:
No arguments.

### `title`

- Type: `String!`

Arguments:
No arguments.

### `type`

- Type: `FolderType!`

Arguments:
No arguments.

### `position`

- Type: `Float!`

Arguments:
No arguments.

### `color`

- Type: `String`

Arguments:
No arguments.

### `createdAt`

- Type: `DateTime`

Arguments:
No arguments.

### `createdBy`

- Type: `User`

Arguments:
No arguments.

### `parent`

- Type: `Folder`

Arguments:
No arguments.

### `metadata`

- Type: `FolderMetadata`

Arguments:
No arguments.

### `uid`

- Type: `String!`

Arguments:
No arguments.

### `updatedAt`

- Type: `DateTime!`

Arguments:
No arguments.

### `companyUserFolders`

- Type: `[CompanyUserFolder!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `CompanyUserFolderWhereInput` | `` |  |
| `orderBy` | `CompanyUserFolderOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |

### `projectUserFolders`

- Type: `[ProjectUserFolder!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `ProjectUserFolderWhereInput` | `` |  |
| `orderBy` | `ProjectUserFolderOrderByInput` | `` |  |
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

### `folders`

- Type: `[Folder!]`

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `where` | `FolderWhereInput` | `` |  |
| `orderBy` | `FolderOrderByInput` | `` |  |
| `skip` | `Int` | `` |  |
| `after` | `String` | `` |  |
| `before` | `String` | `` |  |
| `first` | `Int` | `` |  |
| `last` | `Int` | `` |  |
