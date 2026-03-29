---
title: Lookup Custom Field
description: Create lookup fields that automatically pull data from referenced records
category: Custom Fields
icon: Search
---

Lookup custom fields automatically pull data from records referenced by [Reference fields](/api/custom-fields/reference), displaying information from linked records without manual copying. They update automatically when referenced data changes.

## Basic Example

Create a lookup field to display tags from referenced records:

```graphql
mutation CreateLookupField {
  createCustomField(input: {
    name: "Related Todo Tags"
    type: LOOKUP
    lookupOption: {
      referenceId: "reference_field_id"
      lookupType: TODO_TAG
    }
    description: "Tags from related todos"
  }) {
    id
    name
    type
    lookupOption
  }
}
```

## Advanced Example

Create a lookup field to extract custom field values from referenced records:

```graphql
mutation CreateCustomFieldLookup {
  createCustomField(input: {
    name: "Referenced Budget Values"
    type: LOOKUP
    lookupOption: {
      referenceId: "project_reference_field_id"
      lookupId: "budget_custom_field_id"
      lookupType: TODO_CUSTOM_FIELD
    }
    description: "Budget values from referenced todos"
  }) {
    id
    name
    type
    lookupOption
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the lookup field |
| `type` | CustomFieldType! | ✅ Yes | Must be `LOOKUP` |
| `lookupOption` | CustomFieldLookupOptionInput! | ✅ Yes | Lookup configuration |
| `description` | String | No | Help text shown to users |

## Lookup Configuration

### CustomFieldLookupOptionInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `referenceId` | String! | ✅ Yes | ID of the reference field to pull data from |
| `lookupId` | String | No | ID of the specific custom field to lookup (required for TODO_CUSTOM_FIELD type) |
| `lookupType` | CustomFieldLookupType! | ✅ Yes | Type of data to extract from referenced records |

## Lookup Types

### CustomFieldLookupType Values

| Type | Description | Returns |
|------|-------------|---------|
| `TODO_DUE_DATE` | Due dates from referenced todos | Array of date objects with start/end dates and timezone |
| `TODO_CREATED_AT` | Creation dates from referenced todos | Array of creation timestamps |
| `TODO_UPDATED_AT` | Last updated dates from referenced todos | Array of update timestamps |
| `TODO_TAG` | Tags from referenced todos | Array of tag objects with id, name, and color |
| `TODO_ASSIGNEE` | Assignees from referenced todos | Array of user objects |
| `TODO_DESCRIPTION` | Descriptions from referenced todos | Array of text descriptions (empty values filtered out) |
| `TODO_LIST` | Todo list names from referenced todos | Array of list titles |
| `TODO_CUSTOM_FIELD` | Custom field values from referenced todos | Array of values based on the field type |

## Response Fields

### CustomField Response (for lookup fields)

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field |
| `name` | String! | Display name of the lookup field |
| `type` | CustomFieldType! | Will be `LOOKUP` |
| `customFieldLookupOption` | CustomFieldLookupOption | Lookup configuration and results |
| `createdAt` | DateTime! | When the field was created |
| `updatedAt` | DateTime! | When the field was last updated |

### CustomFieldLookupOption Structure

| Field | Type | Description |
|-------|------|-------------|
| `lookupType` | CustomFieldLookupType! | Type of lookup being performed |
| `lookupResult` | JSON | The extracted data from referenced records |
| `reference` | CustomField | The reference field being used as source |
| `lookup` | CustomField | The specific field being looked up (for TODO_CUSTOM_FIELD) |
| `parentCustomField` | CustomField | The parent lookup field |
| `parentLookup` | CustomField | Parent lookup in chain (for nested lookups) |

## How Lookups Work

1. **Data Extraction**: Lookups extract specific data from all records linked through a reference field
2. **Automatic Updates**: When referenced records change, lookup values update automatically
3. **Read-Only**: Lookup fields cannot be edited directly - they always reflect current referenced data
4. **No Calculations**: Lookups extract and display data as-is without aggregations or calculations

## TODO_CUSTOM_FIELD Lookups

When using `TODO_CUSTOM_FIELD` type, you must specify which custom field to extract using the `lookupId` parameter:

```graphql
mutation CreateCustomFieldValueLookup {
  createCustomField(input: {
    name: "Project Status Values"
    type: LOOKUP
    lookupOption: {
      referenceId: "linked_projects_reference_field"
      lookupId: "status_custom_field_id"
      lookupType: TODO_CUSTOM_FIELD
    }
  }) {
    id
  }
}
```

This extracts the values of the specified custom field from all referenced records.

## Querying Lookup Data

```graphql
query GetLookupValues {
  todo(id: "todo_123") {
    customFields {
      id
      customField {
        name
        type
        customFieldLookupOption {
          lookupType
          lookupResult
          reference {
            id
            name
          }
          lookup {
            id
            name
            type
          }
        }
      }
    }
  }
}
```

## Example Lookup Results

### Tag Lookup Result
```json
{
  "lookupResult": [
    {
      "id": "tag_123",
      "title": "urgent",
      "color": "#ff0000"
    },
    {
      "id": "tag_456",
      "title": "development",
      "color": "#00ff00"
    }
  ]
}
```

### Assignee Lookup Result
```json
{
  "lookupResult": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

### Custom Field Lookup Result
Results vary based on the custom field type being looked up. For example, a currency field lookup might return:
```json
{
  "lookupResult": [
    {
      "value": 1000,
      "currency": "USD"
    },
    {
      "value": 2500,
      "currency": "EUR"
    }
  ]
}
```

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create lookup field | `OWNER` or `ADMIN` role at project level |
| Update lookup field | `OWNER` or `ADMIN` role at project level |
| View lookup results | Standard record view permissions |
| Access source data | View permissions on referenced project required |

**Important**: Users must have view permissions on both the current project and the referenced project to see lookup results.

## Error Responses

### Invalid Reference Field
```json
{
  "errors": [{
    "message": "Custom field was not found.",
    "extensions": {
      "code": "CUSTOM_FIELD_NOT_FOUND"
    }
  }]
}
```

### Circular Lookup Detected
```json
{
  "errors": [{
    "message": "Circular lookup detected",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

### Missing Lookup ID for TODO_CUSTOM_FIELD
```json
{
  "errors": [{
    "message": "lookupId is required when lookupType is TODO_CUSTOM_FIELD",
    "extensions": {
      "code": "BAD_USER_INPUT"
    }
  }]
}
```

## Best Practices

1. **Clear Naming**: Use descriptive names that indicate what data is being looked up
2. **Appropriate Types**: Choose the lookup type that matches your data needs
3. **Performance**: Lookups process all referenced records, so be mindful of reference fields with many links
4. **Permissions**: Ensure users have access to referenced projects for lookups to work

## Common Use Cases

### Cross-Project Visibility
Display tags, assignees, or statuses from related projects without manual synchronization.

### Dependency Tracking
Show due dates or completion status of tasks that current work depends on.

### Resource Overview
Display all team members assigned to referenced tasks for resource planning.

### Status Aggregation
Collect all unique statuses from related tasks to see project health at a glance.

## Limitations

- Lookup fields are read-only and cannot be edited directly
- No aggregation functions (SUM, COUNT, AVG) - lookups only extract data
- No filtering options - all referenced records are included
- Circular lookup chains are prevented to avoid infinite loops
- Results reflect current data and update automatically

## Related Resources

- [Reference Fields](/api/custom-fields/reference) - Create links to records for lookup sources
- [Custom Field Values](/api/custom-fields/custom-field-values) - Set values on editable custom fields
- [List Custom Fields](/api/custom-fields/list-custom-fields) - Query all custom fields in a project
