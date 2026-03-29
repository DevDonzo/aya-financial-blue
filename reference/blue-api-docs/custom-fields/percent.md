---
title: Percent Custom Field
description: Create percentage fields to store numeric values with automatic % symbol handling and display formatting
category: Custom Fields
icon: Percent
---

Percent custom fields allow you to store percentage values for records. They automatically handle the % symbol for input and display, while storing the raw numeric value internally. Perfect for completion rates, success rates, or any percentage-based metrics.

## Basic Example

Create a simple percent field:

```graphql
mutation CreatePercentField {
  createCustomField(input: {
    name: "Completion Rate"
    type: PERCENT
  }) {
    id
    name
    type
  }
}
```

## Advanced Example

Create a percent field with description:

```graphql
mutation CreatePercentField {
  createCustomField(input: {
    name: "Success Rate"
    type: PERCENT
    description: "Percentage of successful outcomes for this process"
  }) {
    id
    name
    type
    description
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the percent field |
| `type` | CustomFieldType! | ✅ Yes | Must be `PERCENT` |
| `description` | String | No | Help text shown to users |

**Note**: Project context is automatically determined from your authentication headers. No `projectId` parameter is needed.

**Note**: PERCENT fields do not support min/max constraints or prefix formatting like NUMBER fields.

## Setting Percent Values

Percent fields store numeric values with automatic % symbol handling:

### With Percent Symbol

```graphql
mutation SetPercentWithSymbol {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    number: 75.5
  }) {
    id
    customField {
      value  # Returns { number: 75.5 }
    }
  }
}
```

### Direct Numeric Value

```graphql
mutation SetPercentNumeric {
  setTodoCustomField(input: {
    todoId: "todo_123"
    customFieldId: "field_456"
    number: 100
  }) {
    id
    customField {
      value  # Returns { number: 100.0 }
    }
  }
}
```

### SetTodoCustomFieldInput Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `todoId` | String! | ✅ Yes | ID of the record to update |
| `customFieldId` | String! | ✅ Yes | ID of the percent custom field |
| `number` | Float | No | Numeric percentage value (e.g., 75.5 for 75.5%) |

## Value Storage and Display

### Storage Format
- **Internal storage**: Raw numeric value (e.g., 75.5)
- **Database**: Stored as `Decimal` in `number` column
- **GraphQL**: Returned as `Float` type

### Display Format
- **User interface**: Client applications must append % symbol (e.g., "75.5%")
- **Charts**: Displays with % symbol when output type is PERCENTAGE
- **API responses**: Raw numeric value without % symbol (e.g., 75.5)

## Creating Records with Percent Values

When creating a new record with percent values:

```graphql
mutation CreateRecordWithPercent {
  createTodo(input: {
    title: "Marketing Campaign"
    todoListId: "list_123"
    customFields: [{
      customFieldId: "success_rate_field_id"
      value: "85.5%"
    }]
  }) {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # Percent is accessed here as { number: 85.5 }
      }
    }
  }
}
```

### Supported Input Formats

| Format | Example | Result |
|--------|---------|---------|
| With % symbol | `"75.5%"` | Stored as 75.5 |
| Without % symbol | `"75.5"` | Stored as 75.5 |
| Integer percentage | `"100"` | Stored as 100.0 |
| Decimal percentage | `"33.333"` | Stored as 33.333 |

**Note**: The % symbol is automatically stripped from input and added back during display.

## Querying Percent Values

When querying records with percent custom fields, access the value through the `customField.value.number` path:

```graphql
query GetRecordWithPercent {
  todo(id: "todo_123") {
    id
    title
    customFields {
      id
      customField {
        name
        type
        value  # For PERCENT type, contains { number: 75.5 }
      }
    }
  }
}
```

The response will include the percentage as a raw number:

```json
{
  "data": {
    "todo": {
      "customFields": [{
        "customField": {
          "name": "Completion Rate",
          "type": "PERCENT",
          "value": {
            "number": 75.5
          }
        }
      }]
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | ID! | Unique identifier for the field value |
| `customField` | CustomField! | The custom field definition (contains the percent value) |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last modified |

**Important**: Percent values are accessed through the `customField.value.number` field. The % symbol is not included in stored values and must be added by client applications for display.

## Filtering and Querying

Percent fields support the same filtering as NUMBER fields:

```graphql
query FilterByPercentRange {
  todos(filter: {
    customFields: [{
      customFieldId: "completion_rate_field_id"
      operator: GTE
      number: 80
    }]
  }) {
    id
    title
    customFields {
      number
    }
  }
}
```

### Supported Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `EQ` | Equal to | `percentage = 75` |
| `NE` | Not equal to | `percentage ≠ 75` |
| `GT` | Greater than | `percentage > 75` |
| `GTE` | Greater than or equal | `percentage ≥ 75` |
| `LT` | Less than | `percentage < 75` |
| `LTE` | Less than or equal | `percentage ≤ 75` |
| `IN` | Value in list | `percentage in [50, 75, 100]` |
| `NIN` | Value not in list | `percentage not in [0, 25]` |
| `IS` | Check for null with `values: null` | `percentage is null` |
| `NOT` | Check for not null with `values: null` | `percentage is not null` |

### Range Filtering

For range filtering, use multiple operators:

```graphql
query FilterHighPerformers {
  todos(filter: {
    customFields: [{
      customFieldId: "success_rate_field_id"
      operator: GTE
      number: 90
    }]
  }) {
    id
    title
    customFields {
      customField {
        value  # Returns { number: 95.5 } for example
      }
    }
  }
}
```

## Percentage Value Ranges

### Common Ranges

| Range | Description | Use Case |
|-------|-------------|----------|
| `0-100` | Standard percentage | Completion rates, success rates |
| `0-∞` | Unlimited percentage | Growth rates, performance metrics |
| `-∞-∞` | Any value | Change rates, variance |

### Example Values

| Input | Stored | Display |
|-------|--------|---------|
| `"50%"` | `50.0` | `50%` |
| `"100"` | `100.0` | `100%` |
| `"150.5"` | `150.5` | `150.5%` |
| `"-25"` | `-25.0` | `-25%` |

## Chart Aggregation

Percent fields support aggregation in dashboard charts and reports. Available functions include:

- `AVERAGE` - Mean percentage value
- `COUNT` - Number of records with values
- `MIN` - Lowest percentage value
- `MAX` - Highest percentage value 
- `SUM` - Total of all percentage values

These aggregations are available when creating charts and dashboards, not in direct GraphQL queries.

## Required Permissions

| Action | Required Permission |
|--------|-------------------|
| Create percent field | `OWNER` or `ADMIN` role at project level |
| Update percent field | `OWNER` or `ADMIN` role at project level |
| Set percent value | Standard record edit permissions |
| View percent value | Standard record view permissions |
| Use chart aggregation | Standard chart viewing permissions |

## Error Responses

### Invalid Percentage Format
```json
{
  "errors": [{
    "message": "Invalid percentage value",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

### Not a Number
```json
{
  "errors": [{
    "message": "Value is not a valid number",
    "extensions": {
      "code": "CUSTOM_FIELD_VALUE_PARSE_ERROR"
    }
  }]
}
```

## Best Practices

### Value Entry
- Allow users to enter with or without % symbol
- Validate reasonable ranges for your use case
- Provide clear context about what 100% represents

### Display
- Always show % symbol in user interfaces
- Use appropriate decimal precision
- Consider color coding for ranges (red/yellow/green)

### Data Interpretation
- Document what 100% means in your context
- Handle values over 100% appropriately
- Consider whether negative values are valid

## Common Use Cases

1. **Project Management**
   - Task completion rates
   - Project progress
   - Resource utilization
   - Sprint velocity

2. **Performance Tracking**
   - Success rates
   - Error rates
   - Efficiency metrics
   - Quality scores

3. **Financial Metrics**
   - Growth rates
   - Profit margins
   - Discount amounts
   - Change percentages

4. **Analytics**
   - Conversion rates
   - Click-through rates
   - Engagement metrics
   - Performance indicators

## Integration Features

### With Formulas
- Reference PERCENT fields in calculations
- Automatic % symbol formatting in formula outputs
- Combine with other numeric fields

### With Automations
- Trigger actions based on percentage thresholds
- Send notifications for milestone percentages
- Update status based on completion rates

### With Lookups
- Aggregate percentages from related records
- Calculate average success rates
- Find highest/lowest performing items

### With Charts
- Create percentage-based visualizations
- Track progress over time
- Compare performance metrics

## Differences from NUMBER Fields

### What's Different
- **Input handling**: Automatically strips % symbol
- **Display**: Automatically adds % symbol
- **Constraints**: No min/max validation
- **Formatting**: No prefix support

### What's the Same
- **Storage**: Same database column and type
- **Filtering**: Same query operators
- **Aggregation**: Same aggregation functions
- **Permissions**: Same permission model

## Limitations

- No min/max value constraints
- No prefix formatting options
- No automatic validation of 0-100% range
- No conversion between percentage formats (e.g., 0.75 ↔ 75%)
- Values over 100% are allowed

## Related Resources

- [Custom Fields Overview](/api/custom-fields/list-custom-fields) - General custom field concepts
- [Number Custom Field](/api/custom-fields/number) - For raw numeric values
- [Automations API](/api/automations/index) - Create percentage-based automations
