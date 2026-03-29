---
title: Formula Custom Field
description: Create calculated fields that automatically compute values based on other data
category: Custom Fields
icon: Calculator
---

Formula custom fields are used for chart and dashboard calculations within Blue. They define aggregation functions (SUM, AVERAGE, COUNT, etc.) that operate on custom field data to display calculated metrics in charts. Formulas are not calculated at the individual todo level but rather aggregate data across multiple records for visualization purposes.

## Basic Example

Create a formula field for chart calculations:

```graphql
mutation CreateFormulaField {
  createCustomField(input: {
    name: "Budget Total"
    type: FORMULA
    projectId: "proj_123"
    formula: {
      logic: {
        text: "SUM(Budget)"
        html: "<span>SUM(Budget)</span>"
      }
      display: {
        type: NUMBER
        precision: 2
        function: SUM
      }
    }
  }) {
    id
    name
    type
    formula
  }
}
```

## Advanced Example

Create a currency formula with complex calculations:

```graphql
mutation CreateCurrencyFormula {
  createCustomField(input: {
    name: "Profit Margin"
    type: FORMULA
    projectId: "proj_123"
    formula: {
      logic: {
        text: "SUM(Revenue) - SUM(Costs)"
        html: "<span>SUM(Revenue) - SUM(Costs)</span>"
      }
      display: {
        type: CURRENCY
        currency: {
          code: "USD"
          name: "US Dollar"
        }
        precision: 2
      }
    }
    description: "Automatically calculates profit by subtracting costs from revenue"
  }) {
    id
    name
    type
    formula
  }
}
```

## Input Parameters

### CreateCustomFieldInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | String! | ✅ Yes | Display name of the formula field |
| `type` | CustomFieldType! | ✅ Yes | Must be `FORMULA` |
| `projectId` | String! | ✅ Yes | The project ID where this field will be created |
| `formula` | JSON | No | Formula definition for chart calculations |
| `description` | String | No | Help text shown to users |

### Formula Structure

```json
{
  "logic": {
    "text": "Display text for the formula",
    "html": "HTML formatted display text"
  },
  "display": {
    "type": "NUMBER|CURRENCY|PERCENTAGE",
    "currency": {
      "code": "USD",
      "name": "US Dollar"  
    },
    "precision": 2,
    "function": "SUM|AVERAGE|AVERAGEA|COUNT|COUNTA|MAX|MIN"
  }
}
```

## Supported Functions

### Chart Aggregation Functions

Formula fields support the following aggregation functions for chart calculations:

| Function | Description | ChartFunction Enum |
|----------|-------------|-------------------|
| `SUM` | Sum of all values | `SUM` |
| `AVERAGE` | Average of numeric values | `AVERAGE` |
| `AVERAGEA` | Average excluding zeros and nulls | `AVERAGEA` |
| `COUNT` | Count of values | `COUNT` |
| `COUNTA` | Count excluding zeros and nulls | `COUNTA` |
| `MAX` | Maximum value | `MAX` |
| `MIN` | Minimum value | `MIN` |

**Note**: These functions are used in the `display.function` field and operate on aggregated data for chart visualizations. Complex mathematical expressions or field-level calculations are not supported.

## Display Types

### Number Display

```json
{
  "display": {
    "type": "NUMBER",
    "precision": 2
  }
}
```

Result: `1250.75`

### Currency Display

```json
{
  "display": {
    "type": "CURRENCY",
    "currency": {
      "code": "USD",
      "name": "US Dollar"
    },
    "precision": 2
  }
}
```

Result: `$1,250.75`

### Percentage Display

```json
{
  "display": {
    "type": "PERCENTAGE",
    "precision": 1
  }
}
```

Result: `87.5%`

## Editing Formula Fields

Update existing formula fields:

```graphql
mutation EditFormulaField {
  editCustomField(input: {
    customFieldId: "field_456"
    formula: {
      logic: {
        text: "AVERAGE(Score)"
        html: "<span>AVERAGE(Score)</span>"
      }
      display: {
        type: PERCENTAGE
        precision: 1
      }
    }
  }) {
    id
    formula
  }
}
```

## Formula Processing

### Chart Calculation Context

Formula fields are processed in the context of chart segments and dashboards:
- Calculations happen when charts are rendered or updated
- Results are stored in `ChartSegment.formulaResult` as decimal values
- Processing is handled through a dedicated BullMQ queue named 'formula'
- Updates publish to dashboard subscribers for real-time updates

### Display Formatting

The `getFormulaDisplayValue` function formats the calculated results based on the display type:
- **NUMBER**: Displays as plain number with optional precision
- **PERCENTAGE**: Adds % suffix with optional precision  
- **CURRENCY**: Formats using the specified currency code

## Formula Result Storage

Results are stored in the `formulaResult` field:

```json
{
  "number": 1250.75,
  "formulaResult": {
    "number": 1250.75,
    "display": {
      "type": "CURRENCY",
      "currency": {
        "code": "USD",
        "name": "US Dollar"
      },
      "precision": 2
    }
  }
}
```

## Response Fields

### TodoCustomField Response

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Unique identifier for the field value |
| `customField` | CustomField! | The formula field definition |
| `number` | Float | Calculated numeric result |
| `formulaResult` | JSON | Full result with display formatting |
| `todo` | Todo! | The record this value belongs to |
| `createdAt` | DateTime! | When the value was created |
| `updatedAt` | DateTime! | When the value was last calculated |

## Data Context

### Chart Data Source

Formula fields operate within the chart data source context:
- Formulas aggregate custom field values across todos in a project
- The aggregation function specified in `display.function` determines the calculation
- Results are computed using SQL aggregate functions (avg, sum, count, etc.)
- Calculations are performed at the database level for efficiency

## Common Formula Examples

### Total Budget (Chart Display)

```json
{
  "logic": {
    "text": "Total Budget",
    "html": "<span>Total Budget</span>"
  },
  "display": {
    "type": "CURRENCY",
    "currency": { "code": "USD", "name": "US Dollar" },
    "precision": 2,
    "function": "SUM"
  }
}
```

### Average Score (Chart Display)

```json
{
  "logic": {
    "text": "Average Quality Score",
    "html": "<span>Average Quality Score</span>"
  },
  "display": {
    "type": "NUMBER",
    "precision": 1,
    "function": "AVERAGE"
  }
}
```

### Task Count (Chart Display)

```json
{
  "logic": {
    "text": "Total Tasks",
    "html": "<span>Total Tasks</span>"
  },
  "display": {
    "type": "NUMBER",
    "precision": 0,
    "function": "COUNT"
  }
}
```

## Required Permissions

Custom field operations follow standard role-based permissions:

| Action | Required Role |
|--------|---------------|
| Create formula field | Project member with appropriate role |
| Update formula field | Project member with appropriate role |
| View formula results | Project member with view permissions |
| Delete formula field | Project member with appropriate role |

**Note**: The specific roles required depend on your project's custom role configuration. There are no special permission constants like CUSTOM_FIELDS_CREATE.

## Error Handling

### Validation Error
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

### Formula Design
- Use clear, descriptive names for formula fields
- Add descriptions explaining the calculation logic
- Test formulas with sample data before deployment
- Keep formulas simple and readable

### Performance Optimization
- Avoid deeply nested formula dependencies
- Use specific field references rather than wildcards
- Consider caching strategies for complex calculations
- Monitor formula performance in large projects

### Data Quality
- Validate source data before using in formulas
- Handle empty or null values appropriately
- Use appropriate precision for display types
- Consider edge cases in calculations

## Common Use Cases

1. **Financial Tracking**
   - Budget calculations
   - Profit/loss statements
   - Cost analysis
   - Revenue projections

2. **Project Management**
   - Completion percentages
   - Resource utilization
   - Timeline calculations
   - Performance metrics

3. **Quality Control**
   - Average scores
   - Pass/fail rates
   - Quality metrics
   - Compliance tracking

4. **Business Intelligence**
   - KPI calculations
   - Trend analysis
   - Comparative metrics
   - Dashboard values

## Limitations

- Formulas are for chart/dashboard aggregations only, not todo-level calculations
- Limited to the seven supported aggregation functions (SUM, AVERAGE, etc.)
- No complex mathematical expressions or field-to-field calculations
- Cannot reference multiple fields in a single formula
- Results are only visible in charts and dashboards
- The `logic` field is for display text only, not actual calculation logic

## Related Resources

- [Number Fields](/api/5.custom%20fields/number) - For static numeric values
- [Currency Fields](/api/5.custom%20fields/currency) - For monetary values
- [Reference Fields](/api/5.custom%20fields/reference) - For cross-project data
- [Lookup Fields](/api/5.custom%20fields/lookup) - For aggregated data
- [Custom Fields Overview](/api/5.custom%20fields/2.list-custom-fields) - General concepts
