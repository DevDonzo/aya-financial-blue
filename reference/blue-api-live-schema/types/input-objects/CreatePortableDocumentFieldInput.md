# `CreatePortableDocumentFieldInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `pageId` | `String!` | `` |  |
| `positionX` | `Float!` | `` |  |
| `positionY` | `Float!` | `` |  |
| `width` | `Float` | `` |  |
| `height` | `Float` | `` |  |
| `id` | `String` | `` | if id is not provided, a new field will be created |
| `field` | `String!` | `` | The available field types are: title, description, dueEnd, assignees, tags, customField |
| `customFieldId` | `String` | `` | If a field is a custom field, you must provide the custom field id. |
