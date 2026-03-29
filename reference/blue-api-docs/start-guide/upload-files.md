---
title: Uploading Files
description: Complete guide for uploading files to Blue using GraphQL mutations or REST API
icon: Upload
---

## Overview

This guide demonstrates how to upload files to Blue using two different approaches:

1. **Direct GraphQL Upload** (Recommended) - Simple one-step upload with 256MB file size limit
2. **REST API Upload** - Three-step process supporting larger files up to 4.8GB

This is a comparison of the two methods:

| Feature | GraphQL Upload | REST API Upload |
|---------|----------------|------------------|
| **Complexity** | Simple (one request) | Complex (three steps) |
| **File Size Limit** | 256MB per file | 4.8GB per file |
| **Batch Upload** | Up to 10 files | Single file only |
| **Implementation** | Direct mutation | Multi-step process |
| **Best For** | Most use cases | Large files only |

---

## GraphQL File Upload

The GraphQL upload method provides a simple, direct way to upload files with a single request.

### uploadFile

Uploads a single file to the file storage system and creates a file reference in the database.

**Input:**
- `file: Upload!` - The file to upload (using multipart/form-data)
- `projectId: String!` - Project ID or slug where the file will be stored
- `companyId: String!` - Company ID or slug where the file will be stored

**Returns:** `File!` - The created file object

**Example:**
```graphql
mutation UploadFile($input: UploadFileInput!) {
  uploadFile(input: $input) {
    id
    uid
    name
    size
    type
    extension
    shared
    createdAt
    project {
      id
      name
    }
    folder {
      id
      title
    }
  }
}
```

### uploadFiles

Uploads multiple files to the file storage system and creates file references in the database.

**Input:**
- `files: [Upload!]!` - Array of files to upload (max 10)
- `projectId: String!` - Project ID or slug where the files will be stored
- `companyId: String!` - Company ID or slug where the files will be stored

**Returns:** `[File!]!` - Array of created file objects

**Example:**
```graphql
mutation UploadFiles($input: UploadFilesInput!) {
  uploadFiles(input: $input) {
    id
    uid
    name
    size
    type
    extension
    shared
    createdAt
  }
}
```

### Client Implementation

#### Apollo Client (JavaScript)

**Single File Upload:**
```javascript
import { gql } from '@apollo/client';

const UPLOAD_FILE = gql`
  mutation UploadFile($input: UploadFileInput!) {
    uploadFile(input: $input) {
      id
      uid
      name
      size
      type
      extension
      shared
      createdAt
    }
  }
`;

// Using file input
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const { data } = await uploadFile({
  variables: {
    input: {
      file: file,
      projectId: "project_123", // or "my-project-slug"
      companyId: "company_456"  // or "my-company-slug"
    }
  }
});
```

**Multiple Files Upload:**
```javascript
const UPLOAD_FILES = gql`
  mutation UploadFiles($input: UploadFilesInput!) {
    uploadFiles(input: $input) {
      id
      uid
      name
      size
      type
      extension
      shared
      createdAt
    }
  }
`;

// Using multiple file inputs
const fileInputs = document.querySelectorAll('input[type="file"]');
const files = Array.from(fileInputs).map(input => input.files[0]).filter(Boolean);

const { data } = await uploadFiles({
  variables: {
    input: {
      files: files,
      projectId: "project_123", // or "my-project-slug"
      companyId: "company_456"  // or "my-company-slug"
    }
  }
});
```

#### Vanilla JavaScript

**Single File Upload:**
```html
<!-- HTML -->
<input type="file" id="fileInput" />
<button onclick="uploadFile()">Upload File</button>
```

```javascript
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file');
    return;
  }

  // Create GraphQL mutation
  const query = `
    mutation UploadFile($input: UploadFileInput!) {
      uploadFile(input: $input) {
        id
        name
        size
        type
        extension
        createdAt
      }
    }
  `;

  // Prepare form data
  const formData = new FormData();
  formData.append('operations', JSON.stringify({
    query: query,
    variables: {
      input: {
        file: null, // Will be replaced by file
        projectId: "your_project_id", // or "your-project-slug"
        companyId: "your_company_id"  // or "your-company-slug"
      }
    }
  }));

  formData.append('map', JSON.stringify({
    "0": ["variables.input.file"]
  }));

  formData.append('0', file);

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type - let browser set it with boundary
        'Authorization': 'Bearer your_auth_token'
      }
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Upload failed:', result.errors);
      alert('Upload failed: ' + result.errors[0].message);
    } else {
      console.log('Upload successful:', result.data.uploadFile);
      alert('File uploaded successfully!');
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error during upload');
  }
}
```

**Multiple Files Upload:**
```html
<!-- HTML -->
<input type="file" id="filesInput" multiple />
<button onclick="uploadFiles()">Upload Files</button>
```

```javascript
async function uploadFiles() {
  const filesInput = document.getElementById('filesInput');
  const files = Array.from(filesInput.files);

  if (files.length === 0) {
    alert('Please select files');
    return;
  }

  if (files.length > 10) {
    alert('Maximum 10 files allowed');
    return;
  }

  const query = `
    mutation UploadFiles($input: UploadFilesInput!) {
      uploadFiles(input: $input) {
        id
        name
        size
        type
        extension
        createdAt
      }
    }
  `;

  const formData = new FormData();

  // Create file placeholders for variables
  const fileVariables = files.map((_, index) => null);

  formData.append('operations', JSON.stringify({
    query: query,
    variables: {
      input: {
        files: fileVariables,
        projectId: "your_project_id", // or "your-project-slug"
        companyId: "your_company_id"  // or "your-company-slug"
      }
    }
  }));

  // Create map for file replacements
  const map = {};
  files.forEach((_, index) => {
    map[index.toString()] = [`variables.input.files.${index}`];
  });
  formData.append('map', JSON.stringify(map));

  // Append actual files
  files.forEach((file, index) => {
    formData.append(index.toString(), file);
  });

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'Bearer your_auth_token'
      }
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Upload failed:', result.errors);
      alert('Upload failed: ' + result.errors[0].message);
    } else {
      console.log('Upload successful:', result.data.uploadFiles);
      alert(`${result.data.uploadFiles.length} files uploaded successfully!`);
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error during upload');
  }
}
```

#### cURL Example

```bash
# Single file upload with cURL
curl -X POST \
  -H "Authorization: Bearer your_auth_token" \
  -F 'operations={"query":"mutation UploadFile($input: UploadFileInput!) { uploadFile(input: $input) { id name size type extension createdAt } }","variables":{"input":{"file":null,"projectId":"your_project_id","companyId":"your_company_id"}}}' \
  -F 'map={"0":["variables.input.file"]}' \
  -F '0=@/path/to/your/file.jpg' \
  https://your-api.com/graphql
```

## File URLs

After uploading a file (via either method), you can access it using the `uid` and `name` from the response. The download URL follows this pattern:

```
https://api.blue.cc/uploads/{uid}/{url_encoded_filename}
```

For example, if `uploadFile` returns `uid: "cm8qujq3b01p22lrv9xbb2q62"` and `name: "report.pdf"`:

```
https://api.blue.cc/uploads/cm8qujq3b01p22lrv9xbb2q62/report.pdf
```

This endpoint returns a redirect to a signed storage URL. No additional authentication is needed — the signed URL handles access.

### URL Variants

| Pattern | Description |
|---------|-------------|
| `/uploads/{uid}/{filename}` | Download file |
| `/uploads/{uid}/{filename}?content-disposition=inline` | Display in browser instead of downloading |
| `/uploads/{uid}/50x50/{filename}` | 50x50 thumbnail (images only) |
| `/uploads/{uid}/500x500/{filename}` | 500x500 preview (images only) |

### Building URLs from Upload Response

```javascript
const file = data.uploadFile;
const downloadUrl = `https://api.blue.cc/uploads/${file.uid}/${encodeURIComponent(file.name)}`;
```

```python
from urllib.parse import quote

file = result["data"]["uploadFile"]
download_url = f"https://api.blue.cc/uploads/{file['uid']}/{quote(file['name'])}"
```

> **Important:** The URL requires both `uid` and `filename`. The `uid` alone will not work. Always URL-encode the filename to handle spaces and special characters.

---

## Attaching Files to Comments

To make an uploaded file appear as a clickable attachment inside a comment (the same way it does when attaching files in the Blue UI), you embed the file metadata as HTML in the comment body.

There is no separate "attach file to comment" mutation. File attachments are represented as `<div>` elements in the comment's `html` field, and the API links them automatically.

### How It Works

1. Upload the file first (via `uploadFile` or the REST flow) to get `uid`, `name`, `size`, `type`, and `extension`
2. Embed the file as an attachment `<div>` in the comment HTML
3. Set `tiptap: true` in the `createComment` input — **required** for the API to parse file attachments

### Attachment HTML Format

Each file attachment is represented as:

```html
<div class="attachment" file='{"uid":"FILE_UID","name":"FILENAME","size":SIZE_IN_BYTES,"type":"MIME_TYPE","extension":"EXT"}'></div>
```

The `file` attribute is a JSON string with these fields from the upload response:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `uid` | string | File UID from upload response | `"cm8qujq3b..."` |
| `name` | string | Original filename | `"report.pdf"` |
| `size` | number | File size in bytes | `204800` |
| `type` | string | MIME type | `"application/pdf"` |
| `extension` | string | File extension (no dot) | `"pdf"` |

### Example: Upload File and Attach to Comment

```python
import json
import os
import requests
from urllib.parse import quote

# Configuration
TOKEN_ID = "YOUR_TOKEN_ID"
TOKEN_SECRET = "YOUR_TOKEN_SECRET"
COMPANY_ID = "YOUR_COMPANY_ID_OR_SLUG"
PROJECT_ID = "YOUR_PROJECT_ID_OR_SLUG"
BASE_URL = "https://api.blue.cc"

HEADERS = {
    "X-Bloo-Token-ID": TOKEN_ID,
    "X-Bloo-Token-Secret": TOKEN_SECRET,
    "X-Bloo-Company-ID": COMPANY_ID,
    "X-Bloo-Project-ID": PROJECT_ID,
}

# Step 1: Upload the file using GraphQL
def upload_file(filepath):
    filename = os.path.basename(filepath)

    query = """
    mutation UploadFile($input: UploadFileInput!) {
      uploadFile(input: $input) {
        id uid name size type extension
      }
    }
    """
    variables = {
        "input": {
            "file": None,
            "companyId": COMPANY_ID,
            "projectId": PROJECT_ID,
        }
    }

    operations = json.dumps({"query": query, "variables": variables})
    file_map = json.dumps({"0": ["variables.input.file"]})

    with open(filepath, "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/graphql",
            headers={"X-Bloo-Token-ID": TOKEN_ID, "X-Bloo-Token-Secret": TOKEN_SECRET},
            data={"operations": operations, "map": file_map},
            files={"0": (filename, f)},
        )

    resp.raise_for_status()
    result = resp.json()
    if "errors" in result:
        raise Exception(f"Upload failed: {result['errors']}")
    return result["data"]["uploadFile"]

# Step 2: Create comment with the file attachment
def create_comment_with_attachment(category_id, category, message, files):
    # Build attachment HTML from uploaded file metadata
    attachments_html = ""
    for f in files:
        file_json = json.dumps({
            "uid": f["uid"],
            "name": f["name"],
            "size": f["size"],
            "type": f["type"],
            "extension": f["extension"],
        })
        attachments_html += f'<div class="attachment" file=\'{file_json}\'></div>'

    comment_html = f"<p>{message}</p>{attachments_html}"

    query = """
    mutation CreateComment($input: CreateCommentInput!) {
      createComment(input: $input) {
        id html text createdAt
      }
    }
    """
    variables = {
        "input": {
            "html": comment_html,
            "text": message,
            "category": category,
            "categoryId": category_id,
            "tiptap": True,
        }
    }

    headers = HEADERS.copy()
    headers["Content-Type"] = "application/json"

    resp = requests.post(
        f"{BASE_URL}/graphql",
        headers=headers,
        json={"query": query, "variables": variables},
    )

    resp.raise_for_status()
    result = resp.json()
    if "errors" in result:
        raise Exception(f"Comment failed: {result['errors']}")
    return result["data"]["createComment"]


# Main
file_data = upload_file("report.pdf")
print(f"Uploaded: uid={file_data['uid']}")
print(f"Download URL: {BASE_URL}/uploads/{file_data['uid']}/{quote(file_data['name'])}")

comment = create_comment_with_attachment(
    category_id="YOUR_TODO_ID",    # ID of the record/discussion/status update
    category="TODO",                # TODO, DISCUSSION, or STATUS_UPDATE
    message="Here is the report you requested.",
    files=[file_data],
)
print(f"Comment created: id={comment['id']}")
```

### Multiple File Attachments

Append multiple `<div>` elements after the message:

```python
files = [uploaded_file_1, uploaded_file_2, uploaded_file_3]

attachments_html = ""
for f in files:
    file_json = json.dumps({
        "uid": f["uid"], "name": f["name"], "size": f["size"],
        "type": f["type"], "extension": f["extension"],
    })
    attachments_html += f'<div class="attachment" file=\'{file_json}\'></div>'

comment_html = f"<p>See attached files.</p>{attachments_html}"
```

### Common Mistakes

| Mistake | Result |
|---------|--------|
| Missing `tiptap: true` in createComment input | Attachment divs are ignored — files won't appear in the comment |
| Wrong `type` value (e.g. `"file"` instead of `"application/pdf"`) | File may not display correctly in the UI |
| Constructing URL with `uid` alone (no filename) | 404 error — URL requires both `uid` and `filename` |
| Not URL-encoding the filename | Broken download links for files with spaces or special characters |

---

## REST API Upload

Use this method for files larger than 256MB (up to 4.8GB). This approach uses a three-step process: request upload credentials, upload to storage, then register the file in the database.

Prerequisites:

- Python 3.x installed
- `requests` library installed: `pip install requests`
- A valid X-Bloo-Token-ID and X-Bloo-Token-Secret for Blue API authentication
- The file to upload (e.g., test.jpg) in the same directory as the script

This method covers two scenarios:
1. Uploading to the "File Tab"
2. Uploading to the "Todo File Custom Field"

### Configuration

Define these constants at the top of your script:

```python
FILENAME = "test.jpg"
TOKEN_ID = "YOUR_TOKEN_ID"
TOKEN_SECRET = "YOUR_TOKEN_SECRET"
COMPANY_ID = "YOUR_COMPANY_ID_OR_SLUG"
PROJECT_ID = "YOUR_PROJECT_ID_OR_SLUG"
BASE_URL = "https://api.blue.cc"\
```

This is diagram that shows the flow of the upload process:

![Upload Process](/docs/file-rest-api.png) 

### Uploading to File Tab



```python
import requests
import json
import os

# Configuration
FILENAME = "test.jpg"
TOKEN_ID = "YOUR_TOKEN_ID"
TOKEN_SECRET = "YOUR_TOKEN_SECRET"
COMPANY_ID = "YOUR_COMPANY_ID_OR_SLUG"
PROJECT_ID = "YOUR_PROJECT_ID_OR_SLUG"
BASE_URL = "https://api.blue.cc"

# Headers for Blue API
HEADERS = {
    "X-Bloo-Token-ID": TOKEN_ID,
    "X-Bloo-Token-Secret": TOKEN_SECRET,
    "X-Bloo-Company-ID": COMPANY_ID,
    "X-Bloo-Project-ID": PROJECT_ID,
}

# Step 1: Get upload credentials
def get_upload_credentials():
    url = f"{BASE_URL}/uploads?filename={FILENAME}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch upload credentials: {response.status_code} - {response.text}")
    return response.json()

# Step 2: Upload file to S3
def upload_to_s3(credentials):
    s3_url = credentials["url"]
    fields = credentials["fields"]
    
    files = {
        "acl": (None, fields["acl"]),
        "Content-Disposition": (None, fields["Content-Disposition"]),
        "Key": (None, fields["Key"]),
        "X-Key": (None, fields["X-Key"]),
        "Content-Type": (None, fields["Content-Type"]),
        "bucket": (None, fields["bucket"]),
        "X-Amz-Algorithm": (None, fields["X-Amz-Algorithm"]),
        "X-Amz-Credential": (None, fields["X-Amz-Credential"]),
        "X-Amz-Date": (None, fields["X-Amz-Date"]),
        "Policy": (None, fields["Policy"]),
        "X-Amz-Signature": (None, fields["X-Amz-Signature"]),
        "file": (FILENAME, open(FILENAME, "rb"), fields["Content-Type"])
    }
    
    response = requests.post(s3_url, files=files)
    if response.status_code != 204:
        raise Exception(f"S3 upload failed: {response.status_code} - {response.text}")
    print("S3 upload successful")

# Step 3: Register file with Blue
def register_file(file_uid):
    graphql_url = f"{BASE_URL}/graphql"
    headers = HEADERS.copy()
    headers["Content-Type"] = "application/json"
    
    query = """
    mutation CreateFile($uid: String!, $name: String!, $type: String!, $extension: String!, $size: Float!, $projectId: String!, $companyId: String!) {
        createFile(input: {uid: $uid, name: $name, type: $type, size: $size, extension: $extension, projectId: $projectId, companyId: $companyId}) {
            id
            uid
            name
            __typename
        }
    }
    """
    
    variables = {
        "uid": file_uid,
        "name": FILENAME,
        "type": "image/jpeg",
        "extension": "jpg",
        "size": float(os.path.getsize(FILENAME)),  # Dynamic file size
        "projectId": PROJECT_ID,
        "companyId": COMPANY_ID
    }
    
    payload = {
        "operationName": "CreateFile",
        "query": query,
        "variables": variables
    }
    
    response = requests.post(graphql_url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"GraphQL registration failed: {response.status_code} - {response.text}")
    print("File registration successful:", response.json())

# Main execution
def main():
    try:
        if not os.path.exists(FILENAME):
            raise Exception(f"File '{FILENAME}' not found")
        
        # Step 1: Fetch credentials
        credentials = get_upload_credentials()
        print("Upload credentials fetched:", credentials)
        
        # Step 2: Upload to S3
        upload_to_s3(credentials)
        
        # Step 3: Register file
        file_uid = credentials["fields"]["Key"].split("/")[0]
        register_file(file_uid)
        
        print("Upload completed successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```


### Steps Explained

#### Step 1: Request Upload Credentials
- Send a GET request to `https://api.blue.cc/uploads?filename=test.jpg`
- Returns S3 credentials in JSON format

Sample Response:
```json
{
  "url": "https://s3.ap-southeast-1.amazonaws.com/bloo-uploads",
  "fields": {
    "acl": "private",
    "Content-Disposition": "attachment; filename=\"test.jpg\"",
    "Key": "cm8qujq3b01p22lrv9xbb2q62/test.jpg",
    "X-Key": "cm8qujq3b01p22lrv9xbb2q62",
    "Content-Type": "image/jpeg",
    "bucket": "bloo-uploads",
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": "AKIA2LAMM6FPGT53RMQY/20250327/ap-southeast-1/s3/aws4_request",
    "X-Amz-Date": "20250327T042138Z",
    "Policy": "...",
    "X-Amz-Signature": "e1d2446a0bdbfcbd3a73f926c7d92c87460f8d8ae030d717355f2790d6609452"
  }
}
```

#### Step 2: Upload File to S3
- Uses the `files` parameter in `requests.post` to send a multipart/form-data request to the S3 URL
- Ensures all fields match the policy exactly, avoiding curl's formatting issues

#### Step 3: Register File Metadata
- Sends a GraphQL mutation to `https://api.blue.cc/graphql`
- Dynamically calculates file size with `os.path.getsize`

Sample Response:
```json
{
  "data": {
    "createFile": {
      "id": "cm8qudguy2ouprv2ljq3widd8",
      "uid": "cm8qujq3b01p22lrv9xbb2q62",
      "name": "test.jpg",
      "__typename": "File"
    }
  }
}
```

### Uploading to Custom Field



```python
import requests
import json
import os

# Configuration
FILENAME = "test.jpg"
TOKEN_ID = "YOUR_TOKEN_ID"
TOKEN_SECRET = "YOUR_TOKEN_SECRET"
COMPANY_ID = "YOUR_COMPANY_ID_OR_SLUG"
PROJECT_ID = "YOUR_PROJECT_ID_OR_SLUG"
BASE_URL = "https://api.blue.cc"

# Headers for Blue API
HEADERS = {
    "X-Bloo-Token-ID": TOKEN_ID,
    "X-Bloo-Token-Secret": TOKEN_SECRET,
    "X-Bloo-Company-ID": COMPANY_ID,
    "X-Bloo-Project-ID": PROJECT_ID,
}

# Step 1: Get upload credentials
def get_upload_credentials():
    url = f"{BASE_URL}/uploads?filename={FILENAME}"
    response = requests.get(url, headers=HEADERS)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch upload credentials: {response.status_code} - {response.text}")
    return response.json()

# Step 2: Upload file to S3
def upload_to_s3(credentials):
    s3_url = credentials["url"]
    fields = credentials["fields"]
    
    files = {
        "acl": (None, fields["acl"]),
        "Content-Disposition": (None, fields["Content-Disposition"]),
        "Key": (None, fields["Key"]),
        "X-Key": (None, fields["X-Key"]),
        "Content-Type": (None, fields["Content-Type"]),
        "bucket": (None, fields["bucket"]),
        "X-Amz-Algorithm": (None, fields["X-Amz-Algorithm"]),
        "X-Amz-Credential": (None, fields["X-Amz-Credential"]),
        "X-Amz-Date": (None, fields["X-Amz-Date"]),
        "Policy": (None, fields["Policy"]),
        "X-Amz-Signature": (None, fields["X-Amz-Signature"]),
        "file": (FILENAME, open(FILENAME, "rb"), fields["Content-Type"])
    }
    
    response = requests.post(s3_url, files=files)
    if response.status_code != 204:
        raise Exception(f"S3 upload failed: {response.status_code} - {response.text}")
    print("S3 upload successful")

# Step 3: Register file with Blue
def register_file(file_uid):
    graphql_url = f"{BASE_URL}/graphql"
    headers = HEADERS.copy()
    headers["Content-Type"] = "application/json"
    
    query = """
    mutation CreateFile($uid: String!, $name: String!, $type: String!, $extension: String!, $size: Float!, $projectId: String!, $companyId: String!) {
        createFile(input: {uid: $uid, name: $name, type: $type, size: $size, extension: $extension, projectId: $projectId, companyId: $companyId}) {
            id
            uid
            name
            __typename
        }
    }
    """
    
    variables = {
        "uid": file_uid,
        "name": FILENAME,
        "type": "image/jpeg",
        "extension": "jpg",
        "size": float(os.path.getsize(FILENAME)),
        "projectId": PROJECT_ID,
        "companyId": COMPANY_ID
    }
    
    payload = {
        "operationName": "CreateFile",
        "query": query,
        "variables": variables
    }
    
    response = requests.post(graphql_url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"GraphQL registration failed: {response.status_code} - {response.text}")
    print("File registration successful:", response.json())
    return file_uid

# Step 4: Associate file with Todo Custom Field
def associate_file_with_todo(file_uid):
    graphql_url = f"{BASE_URL}/graphql"
    headers = HEADERS.copy()
    headers["Content-Type"] = "application/json"
    
    query = """
    mutation CreateTodoCustomFieldFile($input: CreateTodoCustomFieldFileInput!) {
        createTodoCustomFieldFile(input: $input)
    }
    """
    
    variables = {
        "input": {
            "todoId": "YOUR_TODO_ID",
            "customFieldId": "YOUR_CUSTOM_FIELD_ID",
            "fileUid": file_uid
        }
    }
    
    payload = {
        "operationName": "CreateTodoCustomFieldFile",
        "query": query,
        "variables": variables
    }
    
    response = requests.post(graphql_url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Todo association failed: {response.status_code} - {response.text}")
    print("Todo association successful:", response.json())

# Main execution
def main():
    try:
        if not os.path.exists(FILENAME):
            raise Exception(f"File '{FILENAME}' not found")
        
        # Step 1: Fetch credentials
        credentials = get_upload_credentials()
        print("Upload credentials fetched:", credentials)
        
        # Step 2: Upload to S3
        upload_to_s3(credentials)
        
        # Step 3: Register file
        file_uid = credentials["fields"]["Key"].split("/")[0]
        register_file(file_uid)
        
        # Step 4: Associate with Todo
        associate_file_with_todo(file_uid)
        
        print("Upload completed successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```



Steps 1-3 are the same as the File Tab process (fetch credentials, upload to S3, and register file metadata).

For step 4, you need to associate the file with a todo custom field.

- Sends a GraphQL mutation to link the file to a todo custom field
- Uses `todoId` and `customFieldId` specific to your setup

Sample Response:
```json
{
  "data": {
    "createTodoCustomFieldFile": true
  }
}
