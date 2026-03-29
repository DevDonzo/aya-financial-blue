# `CreateTodoInputCustomField`

- Kind: `INPUT_OBJECT`
- Description: Input for setting custom field values when creating a todo.

- `customFieldId`: The ID of the custom field to set a value for
- `value`: The value to set for the custom field. The format depends on the custom field type:
  - TEXT_SINGLE, TEXT_MULTI, EMAIL, URL: String value
  - NUMBER, PERCENT, RATING: Numeric value as string
  - CHECKBOX: "true", "false", "1", "0", or "checked"
  - SELECT_SINGLE: ID of the selected option
  - SELECT_MULTI: Comma-separated list of option IDs
  - DATE: Single date or date range as "startDate,endDate"; ISO 8601 format (e.g., "2025-01-01T00:00:00Z")
  - LOCATION: Coordinates as "latitude,longitude"
  - PHONE: Phone number must include country code in one of these formats:
    - E.164 format (preferred): +12345678900
    - International format: +1 234 567 8900
    - International with punctuation: +1 (234) 567-8900
    - Country code and national number: +1-234-567-8900
    Note: National formats without country code (like (234) 567-8900) will not work
  - CURRENCY: Amount with optional currency code (e.g., "100.00 USD")
  - COUNTRY: Either a country name (e.g., "United States") or a valid ISO Alpha-2 code (e.g., "US")

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `customFieldId` | `String` | `` |  |
| `value` | `String` | `` |  |
