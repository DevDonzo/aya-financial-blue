# HubSpot <-> Blue Comment Sync Playbook

Date: April 1, 2026

This playbook is for building comment sync in Zapier only.

It does not require changes in `aya-ops-bot` or the app codebase.

The target outcome is:

- create comment in HubSpot -> create same comment in Blue
- update comment in HubSpot -> update same comment in Blue
- delete comment in HubSpot -> delete same comment in Blue
- create comment in Blue -> create same comment in HubSpot
- update comment in Blue -> update same comment in HubSpot
- delete comment in Blue -> delete same comment in HubSpot
- no duplicates
- no endless loopbacks

## Executive Summary

Build this with:

- your existing `HubSpot client -> Blue client` Zap
- `Zap 1: HubSpot -> Blue comments`
- `Zap 2: Blue -> HubSpot comments`
- `2` Zapier Tables
- `Webhooks by Zapier`
- `Webhooks by Zapier` custom requests for HubSpot and Blue API calls

Use a HubSpot private app token. Do not use HubSpot API keys.

The cleanest architecture is:

1. Maintain a permanent mapping between the HubSpot client record and the Blue record.
2. Maintain a permanent mapping between each HubSpot note and each Blue comment.
3. Store the last system that changed the comment plus a normalized content hash.
4. Before writing across systems, check the mapping row and stop if the event is just the echo of your own previous sync.

## What You Need Tomorrow

### Zapier

- Zapier account access
- permission to create and edit Zaps
- permission to use `Webhooks by Zapier`
- permission to use `Zapier Tables`

### HubSpot

- access to the HubSpot account that owns the CRM data
- permission to create or edit a private app
- permission to manage webhook subscriptions for that private app
- permission to read and write the CRM object that represents your "client"
- permission to read and write HubSpot notes

### Blue

- Blue API `x-bloo-token-id`
- Blue API `x-bloo-token-secret`
- Blue company ID for `x-bloo-company-id`
- Blue project ID if the synced records all live in one project
- Blue access to create or update outgoing webhooks

## Important Auth Answer

### HubSpot

Use a private app token.

Do not use HubSpot API keys.

HubSpot API keys were sunset. Service keys are a separate beta feature, but they are not the right choice here because this setup depends on webhook subscriptions and standard CRM note endpoints.

### Blue

Use Blue API headers:

- `x-bloo-token-id`
- `x-bloo-token-secret`
- `x-bloo-company-id`
- `x-bloo-project-id` when needed

## Recommended Architecture

Use two tables, not one.

### Table 1: `client_links`

This is the permanent map between the same client in both CRMs.

Columns:

- `hubspot_object_type`
- `hubspot_object_id`
- `blue_record_id`
- `blue_project_id`
- `status`
- `updated_at`

Notes:

- `hubspot_object_type` should be whatever your "client" object really is in HubSpot: `contact`, `company`, or a custom object.
- If all Blue client records live in one project, `blue_project_id` can be the same on every row.
- If records can live in different Blue projects, store the real project ID per row.

### Table 2: `comment_links`

This is the permanent map between the same note/comment in both CRMs.

Columns:

- `hubspot_note_id`
- `blue_comment_id`
- `hubspot_object_type`
- `hubspot_object_id`
- `blue_record_id`
- `last_source`
- `last_hash`
- `deleted`
- `updated_at`

Notes:

- `last_source` should be `hubspot` or `blue`
- `last_hash` should be a normalized hash of the current comment body
- `deleted` should stay in the row after deletes; do not hard-delete rows during sync

## Existing Zap You Already Have

You said you already have a Zap that creates a Blue client when a new client is created in HubSpot.

That Zap should be updated so it also writes one row into `client_links`.

Minimum requirement:

- when HubSpot creates Blue client, store the HubSpot client ID and the Blue record ID in `client_links`

Best version:

- also write `blue_project_id`
- also write back the Blue record ID onto the HubSpot record if you have a field for it
- also write the HubSpot client ID onto the Blue record if you have a custom field for it

This is the foundation for reliable comment sync. Without this mapping, comment sync becomes brittle.

## Build Order For Tomorrow

Build in this order:

1. Confirm the HubSpot object that represents "client"
2. Update the existing client-creation Zap so `client_links` is always populated
3. Create the two Zapier Tables
4. Create the HubSpot private app
5. Add HubSpot webhook subscriptions for note events
6. Build `Zap 1: HubSpot -> Blue`
7. Create the Blue outgoing webhook
8. Build `Zap 2: Blue -> HubSpot`
9. Test create, update, and delete in both directions

## HubSpot Setup

## Private App

Create or update a HubSpot private app with the scopes required for:

- reading notes
- writing notes
- reading the HubSpot object that represents the client
- writing that object only if you want to save Blue IDs back to HubSpot

Minimum practical requirement:

- note read
- note write
- client object read

Recommended:

- client object write

Save:

- private app access token
- private app client secret

The client secret is useful if you want to validate HubSpot webhook signatures.

## Webhook Subscriptions

In the HubSpot private app, set the webhook target URL to the Catch Hook URL from `Zap 1`.

Subscribe to note events:

- note created
- note deleted
- note property change for `hs_note_body`

If HubSpot batches multiple events into one webhook call, your Zap must loop through them.

## Blue Setup

Create or update a Blue outgoing webhook pointed at the Catch Hook URL from `Zap 2`.

Subscribe to:

- `COMMENT_CREATED`
- `COMMENT_UPDATED`
- `COMMENT_DELETED`

Scope the webhook to the specific Blue project IDs used for the synced client records if possible.

Store the Blue webhook secret when you create it. Blue only returns the secret once.

## Critical Validation Before You Promise Full 2-Way Update

This is the one real caveat found during research.

The local Blue docs and generated live schema clearly show:

- comment create exists
- comment delete exists
- comment webhooks exist for create, update, delete

But the bundled schema/docs do not cleanly expose a top-level documented `updateComment` mutation by name.

That means the first thing to validate tomorrow is:

1. in the Blue GraphQL explorer or API docs, confirm the exact write operation for editing an existing comment
2. test it manually once before building the update path in Zapier

If Blue exposes a supported comment update mutation in your account, proceed with the full plan below.

If Blue does not expose a usable API write path for editing comments, then true 2-way update is not available in a Zapier-only integration, even though create/delete and outbound update events exist. In that case:

- create and delete can still sync
- Blue -> HubSpot update can still happen because HubSpot note update is supported
- HubSpot -> Blue update becomes blocked until the Blue update API path is confirmed

Do not skip this check.

## Zap 1: HubSpot -> Blue

Suggested name:

`HubSpot Notes -> Blue Comments`

### Trigger

- App: `Webhooks by Zapier`
- Event: `Catch Raw Hook`

Use `Catch Raw Hook` instead of the simpler hook trigger so you can inspect raw payloads and headers if needed.

### Step Flow

1. Trigger receives the HubSpot webhook
2. `Code by Zapier` parses the JSON body
3. `Looping by Zapier` iterates each event because HubSpot can send arrays
4. `Filter by Zapier` keeps only note create, note delete, and note body change events
5. `Delay After Queue` for `5-10` seconds to reduce race conditions and let prior writes finish
6. `Lookup Row` in `comment_links` by `hubspot_note_id`
7. Branch into `Create`, `Update`, or `Delete`

### Event Interpretation

Treat these as:

- note created -> create in Blue
- note deleted -> delete in Blue
- note property changed where property is `hs_note_body` -> update in Blue

### HubSpot Read Step

For create and update events, fetch the full note from HubSpot before doing anything else.

Why:

- the webhook event itself is not enough
- you need the full note body
- you need the associated HubSpot client record

Use a custom request to the HubSpot Notes API.

Example:

```http
GET https://api.hubapi.com/crm/objects/2026-03/notes/{noteId}?properties=hs_note_body,hs_timestamp&associations={your_client_object_type}
Authorization: Bearer {HUBSPOT_PRIVATE_APP_TOKEN}
Content-Type: application/json
```

Replace `{your_client_object_type}` with the real HubSpot object type for clients.

### Find The Blue Record

From the HubSpot note response:

- read the associated HubSpot client record ID
- look up `client_links` using `hubspot_object_type + hubspot_object_id`
- read `blue_record_id`
- read `blue_project_id`

If there is no row in `client_links`, stop and log the error. Do not guess.

### Normalize and Hash The Comment

Create a small `Code by Zapier` step that:

- takes the note body
- strips extra whitespace
- normalizes newlines
- computes a hash

Use that hash to compare against `comment_links.last_hash`.

### Loop Prevention Rule

Before writing to Blue:

- if there is already a `comment_links` row for this note
- and `last_source = blue`
- and incoming hash equals `last_hash`

then stop the Zap.

That means the event is just the bounce-back from the sync you already performed.

### Create Path

If `comment_links` has no row for this HubSpot note:

1. create the Blue comment on the mapped Blue record
2. store the returned `blue_comment_id`
3. insert a row into `comment_links`
4. set:
   - `hubspot_note_id`
   - `blue_comment_id`
   - `hubspot_object_type`
   - `hubspot_object_id`
   - `blue_record_id`
   - `last_source = hubspot`
   - `last_hash = {normalized hash}`
   - `deleted = false`
   - `updated_at = now`

Blue create request:

```http
POST https://api.blue.cc/graphql
x-bloo-token-id: {BLUE_TOKEN_ID}
x-bloo-token-secret: {BLUE_TOKEN_SECRET}
x-bloo-company-id: {BLUE_COMPANY_ID}
x-bloo-project-id: {BLUE_PROJECT_ID}
Content-Type: application/json
```

```json
{
  "query": "mutation CreateComment($input: CreateCommentInput!) { createComment(input: $input) { id text html createdAt updatedAt } }",
  "variables": {
    "input": {
      "html": "<p>Synced from HubSpot</p>",
      "text": "Synced from HubSpot",
      "category": "TODO",
      "categoryId": "BLUE_RECORD_ID"
    }
  }
}
```

In real use, replace the text/html with the HubSpot note content.

### Update Path

If `comment_links` already has a row for this HubSpot note:

1. compare the new hash against `last_hash`
2. if same hash, stop
3. otherwise update the existing Blue comment using the exact Blue update operation confirmed tomorrow
4. update the `comment_links` row:
   - `last_source = hubspot`
   - `last_hash = {new hash}`
   - `deleted = false`
   - `updated_at = now`

Do not implement the update step until you have manually confirmed the Blue API write path for editing comments.

### Delete Path

If the HubSpot note was deleted:

1. look up the row in `comment_links`
2. if there is no mapped `blue_comment_id`, stop
3. delete that comment in Blue
4. update `comment_links`:
   - `last_source = hubspot`
   - `deleted = true`
   - `updated_at = now`

Blue delete request:

```http
POST https://api.blue.cc/graphql
x-bloo-token-id: {BLUE_TOKEN_ID}
x-bloo-token-secret: {BLUE_TOKEN_SECRET}
x-bloo-company-id: {BLUE_COMPANY_ID}
x-bloo-project-id: {BLUE_PROJECT_ID}
Content-Type: application/json
```

```json
{
  "query": "mutation DeleteComment($id: String!) { deleteComment(id: $id) { success operationId } }",
  "variables": {
    "id": "BLUE_COMMENT_ID"
  }
}
```

## Zap 2: Blue -> HubSpot

Suggested name:

`Blue Comments -> HubSpot Notes`

### Trigger

- App: `Webhooks by Zapier`
- Event: `Catch Raw Hook`

### Step Flow

1. Trigger receives the Blue webhook
2. `Code by Zapier` parses payload and event type
3. `Filter by Zapier` keeps `COMMENT_CREATED`, `COMMENT_UPDATED`, `COMMENT_DELETED`
4. `Delay After Queue` for `5-10` seconds
5. `Lookup Row` in `comment_links` by `blue_comment_id`
6. Branch into `Create`, `Update`, or `Delete`

### Find The HubSpot Client

From the Blue webhook payload, read the Blue record ID for the comment's parent record.

Look up `client_links` using `blue_record_id`.

Read:

- `hubspot_object_type`
- `hubspot_object_id`

If you cannot find a `client_links` row, stop and log the problem.

### Normalize and Hash The Comment

Normalize Blue comment text in the same way as HubSpot note text.

Compute a hash.

### Loop Prevention Rule

Before writing to HubSpot:

- if there is already a `comment_links` row for this Blue comment
- and `last_source = hubspot`
- and incoming hash equals `last_hash`

then stop the Zap.

### Create Path

If `comment_links` has no row for this Blue comment:

1. create a HubSpot note
2. associate it to the mapped HubSpot client object
3. insert a row into `comment_links`
4. set:
   - `hubspot_note_id`
   - `blue_comment_id`
   - `hubspot_object_type`
   - `hubspot_object_id`
   - `blue_record_id`
   - `last_source = blue`
   - `last_hash = {normalized hash}`
   - `deleted = false`
   - `updated_at = now`

HubSpot create note request:

```http
POST https://api.hubapi.com/crm/objects/2026-03/notes
Authorization: Bearer {HUBSPOT_PRIVATE_APP_TOKEN}
Content-Type: application/json
```

```json
{
  "properties": {
    "hs_timestamp": "2026-04-01T12:00:00Z",
    "hs_note_body": "Blue comment text goes here"
  },
  "associations": [
    {
      "to": {
        "id": "HUBSPOT_CLIENT_ID"
      },
      "types": [
        {
          "associationCategory": "HUBSPOT_DEFINED",
          "associationTypeId": 202
        }
      ]
    }
  ]
}
```

Important:

- `202` is the standard note-to-contact association in HubSpot examples
- if your client object is `company` or a custom object, use the correct association type ID for that object instead
- do not hardcode `202` until you confirm the client object type

### Update Path

If `comment_links` already has a mapped `hubspot_note_id`:

1. compare incoming hash against `last_hash`
2. if same hash, stop
3. patch the existing HubSpot note
4. update the `comment_links` row:
   - `last_source = blue`
   - `last_hash = {new hash}`
   - `deleted = false`
   - `updated_at = now`

HubSpot update note request:

```http
PATCH https://api.hubapi.com/crm/objects/2026-03/notes/{hubspot_note_id}
Authorization: Bearer {HUBSPOT_PRIVATE_APP_TOKEN}
Content-Type: application/json
```

```json
{
  "properties": {
    "hs_note_body": "Updated Blue comment text"
  }
}
```

### Delete Path

If the Blue webhook event is `COMMENT_DELETED`:

1. look up `comment_links` by `blue_comment_id`
2. if no mapped `hubspot_note_id`, stop
3. delete that HubSpot note
4. update `comment_links`:
   - `last_source = blue`
   - `deleted = true`
   - `updated_at = now`

HubSpot delete note request:

```http
DELETE https://api.hubapi.com/crm/objects/2026-03/notes/{hubspot_note_id}
Authorization: Bearer {HUBSPOT_PRIVATE_APP_TOKEN}
```

## Practical Loop and Duplicate Prevention

This is the most important logic in the entire build.

### Do Not Rely On Text Alone

Do not dedupe by:

- plain comment text only
- timestamps only
- "most recent wins" only

Those approaches break quickly.

### Use The Mapping Row As The Source Of Truth

Every synced note/comment pair must have exactly one row in `comment_links`.

That row tells you:

- whether this is the first time the pair has been seen
- which side last changed it
- what content was last synced
- whether the pair was deleted

### Required Rules

1. On create:
   - if there is no mapping row, create the target comment and then create the mapping row
2. On update:
   - if there is a mapping row and the hash has not changed, stop
   - if there is a mapping row and `last_source` is the other system with the same hash, stop
3. On delete:
   - delete the mapped target comment
   - do not delete the mapping row
   - set `deleted = true`

### Delay Helps

Add a `Delay After Queue` step near the top of both Zaps.

Reason:

- webhook delivery can be faster than the previous Zap's table write
- the delay reduces race conditions and loopbacks

## Optional Signature Validation

This is optional for tomorrow, but recommended if time allows.

### HubSpot

HubSpot signs webhook requests using the app client secret.

If you want to validate signatures:

- use `Catch Raw Hook`
- read raw body and headers
- validate in `Code by Zapier`

### Blue

Blue signs webhook payloads with `X-Signature` using the webhook secret returned on create.

If you want to validate signatures:

- use `Catch Raw Hook`
- read raw body and `X-Signature`
- validate in `Code by Zapier`

For a due-tomorrow implementation, you can skip signature validation initially if the webhook URLs are kept secret and rotated if exposed. Add signature validation after the first working version if needed.

## Minimum Manual Tests

Run these in order after the build:

1. create a note in HubSpot on a mapped client
2. verify one Blue comment is created
3. verify one row appears in `comment_links`
4. edit the same HubSpot note
5. verify the same Blue comment updates, not a new one
6. delete the same HubSpot note
7. verify the Blue comment deletes
8. create a comment in Blue on a mapped record
9. verify one HubSpot note is created on the correct client
10. edit the same Blue comment
11. verify the same HubSpot note updates
12. delete the same Blue comment
13. verify the HubSpot note deletes
14. verify no duplicate rows were created in `comment_links`

## Risks To Watch

### 1. Blue Comment Update API Path

This is the main technical unknown found in research.

The docs in this repo clearly support:

- `createComment`
- `deleteComment`
- comment webhook events including `COMMENT_UPDATED`

But they do not cleanly publish the exact mutation name for editing a comment.

Validate this first.

### 2. Wrong HubSpot Client Object Type

If your "client" is not a HubSpot contact, the note association type ID changes.

Confirm whether the client object is:

- contact
- company
- custom object

Then use the correct association type.

### 3. Missing `client_links`

If your existing HubSpot -> Blue client creation Zap does not populate the cross-system mapping, comment sync will fail or misroute comments.

### 4. Multiple Blue Projects

If clients exist across multiple Blue projects, you must store `blue_project_id` per client row and send the right project header when calling Blue.

## Best Practical Recommendation

If the Blue comment update write path is confirmed tomorrow, build the full two-Zap design exactly as described above.

If the Blue comment update write path is not confirmed tomorrow, do not pretend the setup is true 2-way update sync. In that case:

- you can still ship create/delete in both directions
- you can still ship Blue -> HubSpot updates
- you should mark HubSpot -> Blue updates as blocked pending the confirmed Blue update mutation

That is still better than building a fragile fake sync that duplicates comments.

## Useful API Requests

### HubSpot Get Note

```http
GET /crm/objects/2026-03/notes/{noteId}?properties=hs_note_body,hs_timestamp&associations={objectType}
```

### HubSpot Create Note

```http
POST /crm/objects/2026-03/notes
```

### HubSpot Update Note

```http
PATCH /crm/objects/2026-03/notes/{noteId}
```

### HubSpot Delete Note

```http
DELETE /crm/objects/2026-03/notes/{noteId}
```

### Blue Create Comment

```graphql
mutation CreateComment($input: CreateCommentInput!) {
  createComment(input: $input) {
    id
    text
    html
    createdAt
    updatedAt
  }
}
```

### Blue Delete Comment

```graphql
mutation DeleteComment($id: String!) {
  deleteComment(id: $id) {
    success
    operationId
  }
}
```

## Sources

Official and local references used for this playbook:

- HubSpot private app authentication: <https://developers.hubspot.com/docs/apps/legacy-apps/private-apps/overview>
- HubSpot generic webhook subscriptions: <https://developers.hubspot.com/docs/apps/legacy-apps/public-apps/create-generic-webhook-subscriptions>
- HubSpot note API guide: <https://developers.hubspot.com/docs/api-reference/latest/crm/activities/notes/guide>
- HubSpot API key sunset: <https://developers.hubspot.com/changelog/upcoming-api-key-sunset>
- Blue auth headers: `reference/blue-api-docs/start-guide/authentication.md`
- Blue webhook events and secret behavior: `reference/blue-api-docs/webhooks/index.md`
- Blue webhook update behavior and health check: `reference/blue-api-docs/webhooks/update-webhook.md`
- Blue comment create doc: `reference/blue-api-docs/records/add-comment.md`
- Blue generated live schema for comment mutations: `reference/blue-api-live-schema/types/objects/Mutation.md`
- Blue generated live schema for comment object: `reference/blue-api-live-schema/types/objects/Comment.md`
- Blue generated live schema for comment subscription payload: `reference/blue-api-live-schema/types/objects/CommentSubscriptionPayload.md`

