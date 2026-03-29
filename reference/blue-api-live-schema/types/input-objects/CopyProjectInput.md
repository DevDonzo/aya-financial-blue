# `CopyProjectInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `projectId` | `String!` | `` | The `id` of the project to be copied. |
| `name` | `String!` | `` | The `name` for the new project. |
| `description` | `String` | `` | The `description` for the new project. |
| `imageURL` | `String` | `` | The `imageURL` for the new project. |
| `companyId` | `String` | `` | The `id` of the company, where the new project should go. If not provided, we will use the company of the project to be copied. |
| `options` | `CopyProjectOptionsInput!` | `` | What are we going to copy? |
