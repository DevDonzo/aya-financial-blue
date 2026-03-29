---
title: Rating Custom Field
description: Create rating fields to store numeric ratings with configurable scales and validation
category: Custom Fields
icon: Star
---

Rating custom fields allow you to store numeric ratings in records with configurable minimum and maximum values. They're ideal for performance ratings, satisfaction scores, priority levels, or any numeric scale-based data in your projects.

## Basic Example

Create a simple rating field with default 0-5 scale:

```graphql
mutation CreateRatingField {
  createCustomField(input: {
    name: "Performance Rating"
    type: RATING
    projectId: "proj_123"
    max: 5
  }) {
    id
    name
    type
    min
    max
  }
}
```

## Advanced Example

Create a rating field with custom scale and description:

```graphql
mutation CreateDetailedRatingField {
  createCustomField(input: {
    name: "Customer Satisfaction"
    type: RATING
    projectId: "proj_123"
    description: "Rate customer satisfaction from 1-10"
    min: 1
    max: 10
  }) {
    id
    name
    type
    description
    min
    max
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the rating field |
| `type` | CustomFieldType! | ✅ Yes | Must be `RATING` |
| `projectId` | String! | ✅ Yes | The project ID where this field will be created |
| `description` | String | No | Help text shown to users |
| `min` | Float | No | Minimum rating value (no default) |
| `max` | Float | No | Maximum rating value |

## Setting Rating Values

To set or update a rating value on a record:

```graphql
mutation SetRatingValue {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    value: "4.5"
  })
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the rating custom field |
| `value` | String! | ✅ Yes | Rating value as string (within the configured range) |

## Creating Records with Rating Values

When creating a new record with rating values:

```graphql
mutation CreateRecordWithRating {
  createTodo(input: {
    title: "Review customer feedback"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "rating_field_id"
      value: "4.5"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        min
        max
      }
      value
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition |
| `value` | Float | The stored rating value (accessed via customField.value) |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

**Note**: The rating value is actually accessed via `customField.value.number` in queries.

### CustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field |
| `name` | String! | Display name of the rating field |
| `type` | CustomFieldType! | Always `RATING` |
| `min` | Float | Minimum allowed rating value |
| `max` | Float | Maximum allowed rating value |
| `description` | String | Help text for the field |

## Rating Validation

### Value Constraints
- Rating values must be numeric (Float type)
- Values must be within the configured min/max range
- If no minimum is specified, there is no default value
- Maximum value is optional but recommended

### Validation Rules
**Important**: Validation only occurs when submitting forms, not when using `setTodoCustomField` directly.

- Input is parsed as a float number (when using forms)
- Must be greater than or equal to the minimum value (when using forms)
- Must be less than or equal to the maximum value (when using forms)
- `setTodoCustomField` accepts any string value without validation

### Valid Rating Examples
For a field with min=1, max=5:
```
1       # Minimum value
5       # Maximum value
3.5     # Decimal values allowed
2.75    # Precise decimal ratings
```

### Invalid Rating Examples
For a field with min=1, max=5:
```
0       # Below minimum
6       # Above maximum
-1      # Negative value (below min)
abc     # Non-numeric value
```

## Configuration Options

### Rating Scale Setup
```graphql
# 1-5 star rating
mutation CreateStarRating {
  createCustomField(input: {
    name: "Star Rating"
    type: RATING
    projectId: "proj_123"
    min: 1
    max: 5
  }) {
    id
    min
    max
  }
}

# 0-100 percentage rating
mutation CreatePercentageRating {
  createCustomField(input: {
    name: "Completion Percentage"
    type: RATING
    projectId: "proj_123"
    min: 0
    max: 100
  }) {
    id
    min
    max
  }
}
```

### Common Rating Scales
- **1-5 Stars**: `min: 1, max: 5`
- **0-10 NPS**: `min: 0, max: 10`
- **1-10 Performance**: `min: 1, max: 10`
- **0-100 Percentage**: `min: 0, max: 100`
- **Custom Scale**: Any numeric range

## Required Permissions

Custom field operations follow standard role-based permissions:

| Action | Required Role |
|--------|---------------|
| Create rating field | Project member with appropriate role |
| Update rating field | Project member with appropriate role |
| Set rating value | Project member with field edit permissions |
| View rating value | Project member with view permissions |

**Note**: The specific roles required depend on your project's custom role configuration and field-level permissions.

## Error Responses

### Validation Error (Forms Only)
```json
{
  "errors": [{
    "message": "Validation error message",
    "extensions": {
      "code": "VALIDATION_ERROR"
    }
  }]
}
```

**Important**: Rating value validation (min/max constraints) only occurs when submitting forms, not when using `setTodoCustomField` directly.

### Custom Field Not Found
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

## Best Practices

### Scale Design
- Use consistent rating scales across similar fields
- Consider user familiarity (1-5 stars, 0-10 NPS)
- Set appropriate minimum values (0 vs 1)
- Define clear meaning for each rating level

### Data Quality
- Validate rating values before storing
- Use decimal precision appropriately
- Consider rounding for display purposes
- Provide clear guidance on rating meanings

### User Experience
- Display rating scales visually (stars, progress bars)
- Show current value and scale limits
- Provide context for rating meanings
- Consider default values for new records

## Common Use Cases

1. **Performance Management**
   - Employee performance ratings
   - Project quality scores
   - Task completion ratings
   - Skill level assessments

2. **Customer Feedback**
   - Satisfaction ratings
   - Product quality scores
   - Service experience ratings
   - Net Promoter Score (NPS)

3. **Priority and Importance**
   - Task priority levels
   - Urgency ratings
   - Risk assessment scores
   - Impact ratings

4. **Quality Assurance**
   - Code review ratings
   - Testing quality scores
   - Documentation quality
   - Process adherence ratings

## Integration Features

### With Automations
- Trigger actions based on rating thresholds
- Send notifications for low ratings
- Create follow-up tasks for high ratings
- Route work based on rating values

### With Lookups
- Calculate average ratings across records
- Find records by rating ranges
- Reference rating data from other records
- Aggregate rating statistics

### With Blue Frontend
- Automatic range validation in form contexts
- Visual rating input controls
- Real-time validation feedback
- Star or slider input options

## Activity Tracking

Rating field changes are automatically tracked:
- Old and new rating values are logged
- Activity shows numeric changes
- Timestamps for all rating updates
- User attribution for changes

## Limitations

- Only numeric values are supported
- No built-in visual rating display (stars, etc.)
- Decimal precision depends on database configuration
- No rating metadata storage (comments, context)
- No automatic rating aggregation or statistics
- No built-in rating conversion between scales
- **Critical**: Min/max validation only works in forms, not via `setTodoCustomField`

## Related Resources

- [Number Fields](/api/5.custom%20fields/number) - For general numeric data
- [Percent Fields](/api/5.custom%20fields/percent) - For percentage values
- [Select Fields](/api/5.custom%20fields/select-single) - For discrete choice ratings
- [Custom Fields Overview](/api/5.custom%20fields/2.list-custom-fields) - General concepts
