# `FolderUpdateWithoutFilesDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `type` | `FolderType` | `` |  |
| `color` | `String` | `` |  |
| `createdBy` | `UserUpdateOneRequiredInput` | `` |  |
| `parent` | `FolderUpdateOneWithoutFoldersInput` | `` |  |
| `companyUserFolders` | `CompanyUserFolderUpdateManyWithoutFolderInput` | `` |  |
| `projectUserFolders` | `ProjectUserFolderUpdateManyWithoutFolderInput` | `` |  |
| `folders` | `FolderUpdateManyWithoutParentInput` | `` |  |
| `metadata` | `String` | `` |  |
