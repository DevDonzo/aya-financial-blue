# `FileCreateWithoutFolderInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `name` | `String!` | `` |  |
| `size` | `Float!` | `` |  |
| `type` | `String!` | `` |  |
| `extension` | `String!` | `` |  |
| `shared` | `Boolean` | `` |  |
| `comment` | `CommentCreateOneWithoutFilesInput` | `` |  |
| `discussion` | `DiscussionCreateOneWithoutFilesInput` | `` |  |
| `statusUpdate` | `StatusUpdateCreateOneWithoutFilesInput` | `` |  |
| `todo` | `TodoCreateOneWithoutFilesInput` | `` |  |
| `user` | `UserCreateOneWithoutFilesInput` | `` |  |
| `document` | `DocumentCreateOneInput` | `` |  |
| `project` | `ProjectCreateOneWithoutFilesInput!` | `` |  |
| `company` | `CompanyCreateOneWithoutFilesInput!` | `` |  |
| `todoCustomFieldFile` | `TodoCustomFieldFileCreateOneWithoutFileInput` | `` |  |
