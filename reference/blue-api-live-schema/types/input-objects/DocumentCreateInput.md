# `DocumentCreateInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `ID` | `` |  |
| `uid` | `String!` | `` |  |
| `title` | `String` | `` |  |
| `content` | `String` | `` |  |
| `contentBase64` | `String` | `` |  |
| `wiki` | `Boolean` | `` |  |
| `project` | `ProjectCreateOneWithoutDocumentsInput!` | `` |  |
| `createdBy` | `UserCreateOneWithoutDocumentsInput!` | `` |  |
