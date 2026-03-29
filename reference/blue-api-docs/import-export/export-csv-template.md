---
title: Export CSV Template
description: Download a pre-formatted CSV template with the correct column headers for bulk-importing records into a workspace.
icon: FileSpreadsheet
---

## Export CSV Template

The `exportCSVTemplate` mutation generates a blank CSV file pre-populated with the correct column headers for a given workspace, including all custom field names. This template can be filled out and then uploaded via the `importTodos` mutation.

### Basic Example

```graphql
mutation DownloadImportTemplate {
  exportCSVTemplate(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  )
}
```

### Advanced Example

Use the returned signed URL to trigger a browser download:

```graphql
mutation DownloadImportTemplate {
  exportCSVTemplate(
    input: {
      projectId: "clm4n8qwx000008l0g4oxdqn7"
    }
  )
}

# Response:
# {
#   "data": {
#     "exportCSVTemplate": "https://storage.example.com/org-slug/workspace-slug/workspace-template-301520032025.csv?X-Amz-Expires=86400&..."
#   }
# }
```

## Input Parameters

### ExportCSVTemplateInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | Yes | ID of the workspace to generate the template for |

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `exportCSVTemplate` | String! | A signed download URL for the generated CSV template file. The URL expires after **24 hours**. |

## Template Columns

The generated CSV contains a header row with the following columns, followed by one empty data row:

| Column | Description |
|--------|-------------|
| `Title` | Record title |
| `List` | Name of the list to place the record in |
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
| `Tags` | Comma-separated tag names |
| *Custom field columns* | One column per custom field in the workspace, ordered by position. Currency-type fields include an additional `Currency Types` column immediately after. |

## Required Permissions

| Access Level | Can Export Template |
|--------------|-------------------|
| `OWNER` | Yes |
| `ADMIN` | Yes |
| `MEMBER` | Yes |
| `CLIENT` | Yes |
| `COMMENT_ONLY` | Yes |
| `VIEW_ONLY` | Yes |

Any user with access to the workspace can generate a CSV template. Creating records from the template still requires record-creation permission.

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
**When**: The specified `projectId` does not exist.

## Important Notes

- **Signed URL**: The returned URL is a pre-signed storage URL that expires after **24 hours**. Download the file promptly or request a new URL.
- **Custom Fields Included**: The template automatically includes columns for every custom field configured in the workspace, ordered by their position. This ensures CSV imports can set custom field values.
- **Currency Fields**: If the workspace has a currency-type custom field, an additional `Currency Types` column is inserted immediately after the currency column for specifying the currency code (e.g., `USD`, `EUR`).
- **Workflow**: The typical bulk-import workflow is:
  1. Call `exportCSVTemplate` to download the template
  2. Fill in record data in the CSV
  3. Upload the CSV file using the file upload API
  4. Call `importTodos` with the `s3Key`, `headers`, and `projectId`
  5. Subscribe to `subscribeToImportExportProgress` to track progress
