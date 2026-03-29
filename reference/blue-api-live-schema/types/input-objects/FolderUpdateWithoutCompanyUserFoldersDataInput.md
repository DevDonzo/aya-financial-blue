# `FolderUpdateWithoutCompanyUserFoldersDataInput`

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
| `projectUserFolders` | `ProjectUserFolderUpdateManyWithoutFolderInput` | `` |  |
| `files` | `FileUpdateManyWithoutFolderInput` | `` |  |
| `folders` | `FolderUpdateManyWithoutParentInput` | `` |  |
| `metadata` | `String` | `` |  |
