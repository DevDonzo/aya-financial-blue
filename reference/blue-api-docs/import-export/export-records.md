---
title: Export Records
description: Export workspace records to a CSV file, with optional filters for assignees, tags, dates, and custom fields.
icon: Download
---

## Export Records

The `exportTodos` mutation starts an asynchronous CSV export of records from a workspace. When the export finishes, a download link is emailed to the requesting user. Progress can be tracked in real time through the `subscribeToImportExportProgress` subscription.

For cross-workspace exports from a report, use the `exportReport` mutation instead.

### Basic Example

Export all records from a workspace:

```graphql
mutation ExportRecords {
  exportTodos(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  )
}
```

### Advanced Example

Export filtered records using the optimized Rust-based exporter:

```graphql
mutation ExportFilteredRecords {
  exportTodos(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
      useRustExport: true
      filter: {
        companyIds: ["org_abc123"]
        done: false
        assigneeIds: ["user_123", "user_456"]
        tagIds: ["tag_789"]
        dueStart: "2025-01-01T00:00:00Z"
        dueEnd: "2025-03-31T23:59:59Z"
        q: "launch"
        fields: [{ id: "cf_status_456", values: ["In Progress"] }]
        op: AND
      }
    }
  )
}
```

## Input Parameters

### ExportTodosInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID of the workspace to export records from |
| `useRustExport` | Boolean | No | Use the optimized Rust-based export pipeline (recommended for large workspaces) |
| `filter` | TodosFilter | No | Filter criteria to limit which records are exported. If omitted, all records are exported |

### TodosFilter

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyIds` | [String!]! | Yes | Organization IDs to scope the export |
| `projectIds` | [String!] | No | Additional workspace IDs to include |
| `todoIds` | [String!] | No | Export only these specific record IDs |
| `assigneeIds` | [String!] | No | Filter by assigned user IDs |
| `unassigned` | Boolean | No | When `true`, include only unassigned records |
| `tagIds` | [String!] | No | Filter by tag IDs |
| `tagColors` | [String!] | No | Filter by tag hex colors |
| `tagTitles` | [String!] | No | Filter by tag titles |
| `todoListIds` | [String!] | No | Filter by list IDs |
| `todoListTitles` | [String!] | No | Filter by list titles |
| `done` | Boolean | No | Filter by completion status |
| `showCompleted` | Boolean | No | Include completed records |
| `startedAt` | DateTime | No | Filter records with a start date on or after this value |
| `duedAt` | DateTime | No | Filter records with a due date on or before this value |
| `dueStart` | DateTime | No | Due date range start |
| `dueEnd` | DateTime | No | Due date range end |
| `duedAtStart` | DateTime | No | Alternative due date range start |
| `duedAtEnd` | DateTime | No | Alternative due date range end |
| `updatedAt_gt` | DateTime | No | Records updated after this timestamp |
| `updatedAt_gte` | DateTime | No | Records updated at or after this timestamp |
| `search` | String | No | Full-text search query |
| `q` | String | No | Quick search query |
| `excludeArchivedProjects` | Boolean | No | Exclude records from archived workspaces |
| `fields` | JSON | No | Custom field filter conditions (array of `{ id, values }` objects) |
| `op` | FilterLogicalOperator | No | Logical operator for combining filters: `AND` (default) or `OR` |
| `coordinates` | JSON | No | Geographic bounding box for map-view filtering |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `exportTodos` | Boolean! | Returns `true` when the export job has been queued |

The actual CSV file is delivered by email once the export completes. The email contains a download link that expires after **24 hours**.

## Export a Report

The `exportReport` mutation exports records across multiple workspaces that belong to a report.

### Example

```graphql
mutation ExportReport {
  exportReport(
    input: {
      reportId: "report_abc123"
    }
  )
}
```

### ExportReportInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reportId` | String! | Yes | ID of the report to export |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `exportReport` | Boolean! | Returns `true` when the export job has been queued |

## Export a Chart

The `exportChartCSV` mutation exports the data behind a dashboard chart as a CSV file.

### Example

```graphql
mutation ExportChart {
  exportChartCSV(
    chartId: "chart_xyz789"
    filter: {
      assigneeIds: ["user_123"]
      done: false
    }
  )
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chartId` | ID! | Yes | ID of the chart to export |
| `filter` | TodoFilterInput | No | Optional filter to scope the chart data |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `exportChartCSV` | Boolean! | Returns `true` when the chart export job has been queued |

## Tracking Export Progress

Subscribe to real-time progress updates:

```graphql
subscription TrackExportProgress {
  subscribeToImportExportProgress(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    userId: "user_123"
  )
}
```

See the [Import/Export overview](/api/import-export) for the full subscription payload shape.

## Required Permissions

| Operation | Access Level | Notes |
|-----------|-------------|-------|
| `exportTodos` | `MEMBER` or above | User must be a member of the workspace |
| `exportReport` | Report member or org member | User must have access to the report |
| `exportChartCSV` | Org member | User must belong to the organization that owns the dashboard |

## Error Responses

### ProjectNotFoundError
```json
{
  "errors": [{
    "message": "Project was not found.",
    "extensions": {
      "code": "PROJECT_NOT_FOUND"
    }
  }]
}
```
**When**: The workspace does not exist or the user is not a member.

### ReportNotFoundError
```json
{
  "errors": [{
    "message": "Report was not found.",
    "extensions": {
      "code": "REPORT_NOT_FOUND"
    }
  }]
}
```
**When**: The report does not exist or the user does not have access.

### ChartNotFoundError
```json
{
  "errors": [{
    "message": "Chart was not found.",
    "extensions": {
      "code": "CHART_NOT_FOUND"
    }
  }]
}
```
**When**: The chart does not exist or the user is not a member of the owning organization.

### ChartAlreadyExportingError
```json
{
  "errors": [{
    "message": "Chart is already being exported.",
    "extensions": {
      "code": "CHART_ALREADY_EXPORTING"
    }
  }]
}
```
**When**: A chart export for the same chart and user is already in progress. Chart exports are deduplicated for up to 6 hours.

## Important Notes

- **Asynchronous Delivery**: All export mutations return immediately. The CSV file is generated in the background and a download link is sent to the user's email.
- **Download Link Expiry**: Export download links expire after **24 hours**.
- **Chart Export Deduplication**: Only one chart export per chart per user can run at a time. Subsequent requests within 6 hours will be rejected.
- **Report Exports**: Report exports combine records from all workspaces referenced by the report's data sources, applying any report-level filters.
- **Large Exports**: For workspaces with many records, enable `useRustExport: true` for significantly faster export times.
