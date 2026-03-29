# `FolderUpdateWithoutParentDataInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `uid` | `String` | `` |  |
| `title` | `String` | `` |  |
| `type` | `FolderType` | `` |  |
| `color` | `String` | `` |  |
| `createdBy` | `UserUpdateOneRequiredInput` | `` |  |
| `companyUserFolders` | `CompanyUserFolderUpdateManyWithoutFolderInput` | `` |  |
| `projectUserFolders` | `ProjectUserFolderUpdateManyWithoutFolderInput` | `` |  |
| `files` | `FileUpdateManyWithoutFolderInput` | `` |  |
| `folders` | `FolderUpdateManyWithoutParentInput` | `` |  |
| `metadata` | `String` | `` |  |
