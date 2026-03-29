# `FolderCreateWithoutProjectUserFoldersInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String!` | `` |  |
| `type` | `FolderType!` | `` |  |
| `color` | `String` | `` |  |
| `createdBy` | `UserCreateOneInput!` | `` |  |
| `parent` | `FolderCreateOneWithoutFoldersInput` | `` |  |
| `companyUserFolders` | `CompanyUserFolderCreateManyWithoutFolderInput` | `` |  |
| `files` | `FileCreateManyWithoutFolderInput` | `` |  |
| `folders` | `FolderCreateManyWithoutParentInput` | `` |  |
| `metadata` | `String` | `` |  |
