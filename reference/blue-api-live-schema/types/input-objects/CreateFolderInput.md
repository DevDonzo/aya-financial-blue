# `CreateFolderInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `String` | `` |  |
| `type` | `FolderType!` | `` |  |
| `title` | `String!` | `` |  |
| `companyId` | `String!` | `` |  |
| `projectId` | `String` | `` | Make the folder a project folder (shared by everyone in the project) |
| `parentId` | `String` | `` | Make the folder a subfolder of the given parent folder ID |
