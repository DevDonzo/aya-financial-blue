# Directives

## `@deprecated`

Marks an element of a GraphQL schema as no longer supported.

Locations: FIELD_DEFINITION, ARGUMENT_DEFINITION, INPUT_FIELD_DEFINITION, ENUM_VALUE

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `reason` | `String` | `"No longer supported"` | Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/). |

## `@include`

Directs the executor to include this field or fragment only when the `if` argument is true.

Locations: FIELD, FRAGMENT_SPREAD, INLINE_FRAGMENT

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `if` | `Boolean!` | `` | Included when true. |

## `@oneOf`

Indicates exactly one field must be supplied and this field must not be `null`.

Locations: INPUT_OBJECT

Arguments:
No arguments.

## `@skip`

Directs the executor to skip this field or fragment when the `if` argument is true.

Locations: FIELD, FRAGMENT_SPREAD, INLINE_FRAGMENT

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `if` | `Boolean!` | `` | Skipped when true. |

## `@specifiedBy`

Exposes a URL that specifies the behavior of this scalar.

Locations: SCALAR

Arguments:
| Argument | Type | Default | Description |
|---|---|---|---|
| `url` | `String!` | `` | The URL that specifies the behavior of this scalar. |
