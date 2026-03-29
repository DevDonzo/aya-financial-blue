---
title: Rename Workspace
description: Update the name of an existing workspace in Blue
icon: FileEdit
---

## Rename a Workspace

Updates the name and other properties of an existing workspace. When the name is changed, the workspace slug will be automatically regenerated based on the new name.

### Basic Example

```graphql
mutation RenameProject {
  editProject(input: {
    projectId: "project_abc123"
    name: "Q2 Marketing Campaign"
  }) {
    id
    name
    slug
  }
}
```

### Advanced Example

```graphql
mutation EditProjectAdvanced {
  editProject(input: {
    projectId: "project_abc123"
    name: "Q2 Marketing Campaign"
    description: "Campaign for Q2 product launch"
    color: "#3B82F6"
    icon: "campaign"
    category: MARKETING
    todoAlias: "Task"
    hideRecordCount: false
  }) {
    id
    name
    slug
    description
    color
    icon
    category
    todoAlias
    hideRecordCount
  }
}
```

## Input Parameters

### EditProjectInput

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `projectId` | String! | ✅ Yes | The ID of the workspace to edit |
| `name` | String | No | The new name for the workspace |
| `slug` | String | No | Custom URL-friendly slug (auto-generated if not provided) |
| `description` | String | No | Workspace description |
| `color` | String | No | Hex color code for the workspace (e.g., #3B82F6) |
| `icon` | String | No | Icon identifier for the workspace |
| `category` | ProjectCategory | No | Workspace category |
| `todoAlias` | String | No | Custom name for records in this workspace |
| `hideRecordCount` | Boolean | No | Whether to hide record counts in UI |
| `showTimeSpentInTodoList` | Boolean | No | Display time tracking in lists |
| `showTimeSpentInProject` | Boolean | No | Display time tracking in workspace view |
| `image` | ImageInput | No | Workspace image/cover |
| `todoFields` | [TodoFieldInput] | No | Custom field configurations |
| `coverConfig` | TodoCoverConfigInput | No | Cover display configuration |
| `features` | [ProjectFeatureInput] | No | Feature toggles for the workspace |
| `sequenceCustomFieldId` | String | No | Custom field to use for record sequencing |

### ProjectCategory Values

| Value | Description |
|-------|-------------|
| `PERSONAL` | Personal workspaces |
| `BUSINESS` | Business workspaces |
| `MARKETING` | Marketing campaigns |
| `DEVELOPMENT` | Development workspaces |
| `DESIGN` | Design workspaces |
| `OPERATIONS` | Operational tasks |
| `SALES` | Sales activities |
| `SUPPORT` | Support tickets |
| `FINANCE` | Financial tracking |
| `HR` | Human resources |
| `LEGAL` | Legal matters |
| `PROCUREMENT` | Procurement processes |

## Response Fields

Returns the updated Workspace object with all fields. Key fields include:

| Field | Type | Description |
|-------|------|-------------|
| `id` | String! | Workspace ID |
| `name` | String! | Workspace name |
| `slug` | String! | URL-friendly slug |
| `description` | String | Workspace description |
| `color` | String | Hex color code |
| `icon` | String | Icon identifier |
| `category` | ProjectCategory | Workspace category |
| `todoAlias` | String | Custom record name |
| `hideRecordCount` | Boolean! | Record count visibility setting |
| `createdAt` | DateTime! | Creation timestamp |
| `updatedAt` | DateTime! | Last update timestamp |

## Required Permissions

| Role | Can Edit Workspace |
|------|-------------------|
| `OWNER` | ✅ Yes |
| `ADMIN` | ✅ Yes |
| `MEMBER` | ❌ No |

## Error Responses

### Workspace Not Found
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

### Insufficient Permissions
```json
{
  "errors": [{
    "message": "You don't have permission to edit this project",
    "extensions": {
      "code": "FORBIDDEN"
    }
  }]
}
```

## Important Notes

- **Slug Generation**: Workspace slugs are automatically generated when name changes. You can also provide a custom slug
- **Slug Conflicts**: If a slug conflicts with existing organization slugs, the system will append numbers (e.g., `my-workspace-1`)
- **HTML Sanitization**: HTML tags are automatically stripped from description fields for security
- **Partial Updates**: All fields are optional except `projectId` - only provide fields you want to update
- **Categories**: Use ProjectCategory enum values for the category field
- **Image Handling**: Supports uploading, updating, or removing workspace images via ImageInput

## Related Operations

- [Create Workspace](/api/workspaces/create-workspace) - Create a new workspace
- [List Workspaces](/api/workspaces/list-workspaces) - Get all workspaces
- [Delete Workspace](/api/workspaces/delete-workspace) - Delete a workspace
- [Archive Workspace](/api/workspaces/archive-workspace) - Archive/unarchive workspaces
