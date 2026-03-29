# `UploadImageInput`

- Kind: `INPUT_OBJECT`

## Input Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `file` | `Upload!` | `` | The image file to upload |
| `type` | `ImageType!` | `` | The type of image being uploaded |
| `entityId` | `String!` | `` | The ID of the entity this image belongs to (User ID for PROFILE, Company ID for COMPANY, Project ID for PROJECT, Form ID for FORM) |
