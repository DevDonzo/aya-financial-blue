# `CreateTodoTagInput`

- Kind: `INPUT_OBJECT`
- Description: Input for creating or connecting a tag to a todo item.
Provides two ways to specify a tag:
- Use `id` to connect an existing tag
- Use `title` and `color` to create a new tag or find an existing one with matching attributes

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `String` | `` |  |
| `title` | `String` | `` |  |
| `color` | `String` | `` |  |
