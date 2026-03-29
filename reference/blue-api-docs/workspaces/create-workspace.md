---
title: Create a Workspace
description: Creating workspaces using the Blue API.
icon: Plus
---

## Create a New Workspace

To create a new workspace, you can use the following mutation:

```graphql
mutation {
  createProject(
    input: {
      name: "YOUR PROJECT NEW NAME"
      companyId: "YOUR ORGANIZATION ID OR SLUG"
      description: "Project description"
      color: "#3B82F6"
      icon: "briefcase"
      category: GENERAL
    }
  ) {
    id
    name
    slug
    description
    color
    icon
    category
  }
}
```

Remember to include the required headers in your request:

- `X-Bloo-Token-ID`: Your API token ID
- `X-Bloo-Token-Secret`: Your API token secret
- `X-Bloo-Company-ID`: Your organization ID
- `Content-Type: application/json`

### Response Example

Upon success, the mutation will return the newly created workspace details:

```json
{
  "data": {
    "createProject": {
      "id": "newly-created-project-id",
      "name": "YOUR PROJECT NEW NAME",
      "slug": "your-project-new-name",
      "description": "Project description",
      "color": "#3B82F6",
      "icon": "briefcase",
      "category": "GENERAL"
    }
  }
}
```

## Create from a Template

To create a workspace from an existing template, you can add an optional `templateId` to the mutation.

```graphql
mutation {
  createProject(
    input: {
      templateId: "YOUR TEMPLATE ID OR SLUG"
      name: "YOUR PROJECT NEW NAME"
      companyId: "YOUR ORGANIZATION ID OR SLUG"
    }
  ) {
    id
  }
}
```

Creating a workspace from a template will not create the workspace instantly. Instead, your workspace creation will be queued.

## Advanced Example with Template

Here's a complete example showing all available options when creating from a template:

```graphql
mutation {
  createProject(
    input: {
      templateId: "marketing-template"
      name: "Q1 Marketing Campaign"
      companyId: "acme-corp"
      description: "Marketing initiatives for Q1 2024"
      color: "#10B981"
      icon: "megaphone"
      category: MARKETING
      coverConfig: { enabled: true, fit: COVER, imageSelectionType: FIRST, source: DESCRIPTION }
    }
  ) {
    id
    name
    slug
    description
    color
    icon
    category
  }
}
```

The `coverConfig` parameter currently only works when creating a workspace from a template. For workspaces created from scratch, you'll need to use the `editProject` mutation after creation to configure todo cover images.

## Check Creation Status

To check the status of your workspace creation in the queue, you can use the following query:

```graphql
query {
  copyProjectStatus {
    newProjectName
    isTemplate
    isActive
    queuePosition
    totalQueues
  }
}
```

This query will return the status of your workspace creation in the queue.

## Input Parameters

### CreateProjectInput

| Parameter     | Type                 | Required | Description                                                                                |
| ------------- | -------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `name`        | String               | ✅ Yes   | The workspace name. URLs will be stripped from the name.                                   |
| `companyId`   | String               | ✅ Yes   | The ID or slug of the organization where the workspace will be created.                    |
| `description` | String               | No       | A description of the workspace.                                                            |
| `color`       | String               | No       | Workspace color in hex format (e.g., "#3B82F6").                                           |
| `icon`        | String               | No       | Icon identifier for the workspace (e.g., "briefcase", "rocket").                           |
| `category`    | ProjectCategory      | No       | Workspace category. Defaults to `GENERAL` if not specified.                                |
| `templateId`  | String               | No       | ID of an existing workspace to use as a template.                                          |
| `coverConfig` | TodoCoverConfigInput | No       | Configuration for todo cover images (currently only works with template-based creation).   |

### ProjectCategory Values

| Value              | Description                                 |
| ------------------ | ------------------------------------------- |
| `CRM`              | Customer Relationship Management workspaces |
| `CROSS_FUNCTIONAL` | Cross-functional team workspaces            |
| `CUSTOMER_SUCCESS` | Customer success initiatives                |
| `DESIGN`           | Design and creative workspaces              |
| `ENGINEERING`      | Engineering and development workspaces      |
| `GENERAL`          | General workspaces (default)                |
| `HR`               | Human Resources workspaces                  |
| `IT`               | Information Technology workspaces           |
| `MARKETING`        | Marketing campaigns and initiatives         |
| `OPERATIONS`       | Operations and logistics workspaces         |
| `PRODUCT`          | Product management workspaces               |
| `SALES`            | Sales and business development workspaces   |

### TodoCoverConfigInput

If you want to configure how todo cover images work in your workspace, you can provide the `coverConfig` parameter:

| Parameter            | Type               | Required | Description                                        |
| -------------------- | ------------------ | -------- | -------------------------------------------------- |
| `enabled`            | Boolean            | ✅ Yes   | Whether cover images are enabled for todos         |
| `fit`                | ImageFit           | ✅ Yes   | How images should fit in the cover area            |
| `imageSelectionType` | ImageSelectionType | ✅ Yes   | Which image to select from available options       |
| `source`             | ImageSource        | ✅ Yes   | Where to pull images from                          |
| `sourceId`           | String             | No       | Specific source identifier (e.g., custom field ID) |

**ImageFit Values:** `COVER`, `CONTAIN`, `FILL`, `SCALE_DOWN`

**ImageSelectionType Values:** `FIRST` (first image), `LAST` (last image)

**ImageSource Values:** `DESCRIPTION` (from todo description), `COMMENTS` (from comments), `CUSTOM_FIELD` (from a custom field)

## Response Fields

The createProject mutation returns a Workspace object with the following available fields:

| Field         | Type            | Description                          |
| ------------- | --------------- | ------------------------------------ |
| `id`          | ID!             | Unique identifier for the workspace  |
| `name`        | String!         | Workspace name                       |
| `slug`        | String!         | URL-friendly workspace identifier    |
| `description` | String          | Workspace description                |
| `color`       | String          | Workspace color in hex format        |
| `icon`        | String          | Icon identifier                      |
| `category`    | ProjectCategory | Workspace category enum value        |
| `companyId`   | String!         | ID of the organization               |
| `createdAt`   | DateTime!       | Creation timestamp                   |
| `updatedAt`   | DateTime!       | Last update timestamp                |
| `archived`    | Boolean!        | Whether the workspace is archived    |
| `isTemplate`  | Boolean!        | Whether this is a template workspace |

Note: You can request any combination of these fields in your response.

### Important Notes

- You must have `OWNER`, `ADMIN`, or `MEMBER` level access to the organization to create workspaces
- When creating from a template, the template cannot have more than 250,000 todos
- The creating user is automatically assigned as the workspace `OWNER`
- Workspace names are automatically trimmed of whitespace
- The `coverConfig` parameter is currently only functional when creating from a template

## Error Responses

### Organization Not Found

```json
{
  "errors": [
    {
      "message": "Organization not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

### Template Not Found

```json
{
  "errors": [
    {
      "message": "Template not found",
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

### Template Too Large

```json
{
  "errors": [
    {
      "message": "Template cannot have more than 250000 todos",
      "extensions": {
        "code": "VALIDATION_ERROR"
      }
    }
  ]
}
```

### Permission Denied

```json
{
  "errors": [
    {
      "message": "You do not have permission to create projects in this organization",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```
