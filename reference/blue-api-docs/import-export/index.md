---
title: Import/Export API
description: Import records from CSV files, export records, and track progress via real-time subscriptions.
icon: ArrowUpDown
---

## Overview

The Import/Export API lets you bulk-import records from CSV files into a workspace, export records as CSV, and download pre-formatted CSV templates. Long-running import and export operations publish real-time progress through the `subscribeToImportExportProgress` subscription.

## Available Operations

| Operation | Description | Link |
|-----------|-------------|------|
| **Import Records** | Bulk-import records from a CSV file | [See below](#import-records) |
| **Cancel Import** | Cancel an in-progress import | [See below](#cancel-import) |
| **Export Records** | Export workspace records to CSV | [View Details →](/api/import-export/export-records) |
| **Export CSV Template** | Download a blank CSV template with workspace columns | [View Details →](/api/import-export/export-csv-template) |

---

## Import Records

The `importTodos` mutation bulk-imports records into a workspace from a CSV file that has already been uploaded to storage. The CSV is parsed in streaming chunks and records are created inside a database transaction. Progress is broadcast in real time through the `subscribeToImportExportProgress` subscription.

### Basic Example

```graphql
mutation ImportRecords {
  importTodos(
    input: {
      s3Key: "uploads/org-slug/workspace-slug/import-file.csv"
      headers: ["Title", "List", "Done", "Due Date", "Description", "Assignees", "Tags"]
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  )
}
```

### Advanced Example

Import records using the optimized Rust-based importer:

```graphql
mutation ImportRecordsAdvanced {
  importTodos(
    input: {
      s3Key: "uploads/org-slug/workspace-slug/import-file.csv"
      headers: [
        "Title",
        "List",
        "Done",
        "Start Date",
        "Due Date",
        "Description",
        "Assignees",
        "Created At",
        "Updated At",
        "Created By",
        "Color",
        "Project",
        "Tags",
        "Budget",
        "Priority"
      ]
      projectId: "clm4n8qwx000008l0g4oxdqn7"
      useRustImport: true
    }
  )
}
```

## Input Parameters

### ImportTodosInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `s3Key` | String! | Yes | The storage key of the uploaded CSV file |
| `headers` | JSON! | Yes | An ordered array of column header names that maps CSV columns to record fields |
| `projectId` | String! | Yes | ID of the workspace to import records into |
| `useRustImport` | Boolean | No | Use the optimized Rust-based import pipeline (recommended for large files) |

### Recognized Header Values

The `headers` array tells the importer how to interpret each CSV column. The following header names are recognized:

| Header | Description |
|--------|-------------|
| `Title` | Record title (recommended) |
| `List` | Name of the list to place the record in (created if it does not exist) |
| `Done` | Completion status (`true` / `false`) |
| `Start Date` | Start date of the record |
| `Due Date` | Due date of the record |
| `Description` | Record description |
| `Assignees` | Comma-separated assignee names or emails |
| `Created At` | Original creation timestamp |
| `Updated At` | Original last-updated timestamp |
| `Created By` | Original creator name or email |
| `Color` | Record color |
| `Project` | Workspace name |
| `Tags` | Comma-separated tag names (created if they do not exist) |
| *Custom field name* | Any other header is matched to a custom field by name |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `importTodos` | Boolean! | Returns `true` when the import has been accepted and is processing |

## Tracking Import Progress

Subscribe to real-time progress updates while an import is running:

```graphql
subscription TrackImportProgress {
  subscribeToImportExportProgress(
    projectId: "clm4n8qwx000008l0g4oxdqn7"
    userId: "user_123"
  )
}
```

The subscription returns a JSON payload with the following shape:

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | `"IMPORT"` or `"EXPORT"` |
| `userId` | String | ID of the user who initiated the operation |
| `username` | String | First name of the user |
| `projectId` | String | Workspace slug |
| `projectName` | String | Workspace name |
| `status` | String | `IN_PROGRESS`, `COMPLETE`, `CANCELLED`, or `ERROR` |
| `progress` | Float | Percentage complete (0 - 100) |
| `error` | String | Error message (only present when `status` is `ERROR`) |

---

## Cancel Import

The `cancelTodoImport` mutation cancels an import that is currently in progress.

### Basic Example

```graphql
mutation CancelImport {
  cancelTodoImport(projectId: "clm4n8qwx000008l0g4oxdqn7")
}
```

### Input Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID or slug of the workspace whose import should be cancelled |

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `cancelTodoImport` | Boolean! | Returns `true` when the cancellation has been recorded |

## Required Permissions

| Operation | Access Level | Notes |
|-----------|-------------|-------|
| `importTodos` | `MEMBER` or above | User must have record-creation permission in the workspace |
| `cancelTodoImport` | `ADMIN` or `OWNER` | Only workspace administrators can cancel imports |

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
**When**: The specified `projectId` does not exist or the user does not have access to it.

### TodoImportLimitError
```json
{
  "errors": [{
    "message": "You are importing too many todos.",
    "extensions": {
      "code": "TODO_IMPORT_LIMIT"
    }
  }]
}
```
**When**: The CSV contains more than 2,500 records and the organization is not on an Enterprise plan.

### ImportAlreadyInProgressError
```json
{
  "errors": [{
    "message": "Import already in progress.",
    "extensions": {
      "code": "IMPORT_ALREADY_IN_PROGRESS"
    }
  }]
}
```
**When**: An import is already running for this workspace. Only one import can run at a time per workspace.

## Important Notes

- **Record Limit**: Non-enterprise organizations are limited to importing **2,500 records** per CSV file. Enterprise organizations have no limit.
- **One Import at a Time**: Only one import can be active per workspace. Attempting a second import while one is in progress will return an error (or silently succeed if using the Rust importer).
- **List Auto-Creation**: Lists referenced in the CSV that do not already exist in the workspace are created automatically.
- **Tag Auto-Creation**: Tags referenced in the CSV that do not already exist are created automatically.
- **Custom Fields**: Any CSV header that does not match a built-in field name is treated as a custom field and matched by name against existing custom fields in the workspace.
- **Transaction Safety**: The standard importer runs inside a database transaction. If an error occurs mid-import, all changes from the current chunk are rolled back.
- **File Upload**: The CSV file must be uploaded to storage before calling `importTodos`. Use the file upload API to obtain the `s3Key`.
