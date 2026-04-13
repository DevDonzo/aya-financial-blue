# Zapier Comment Sync Assets

These files are local build assets for the HubSpot <-> Blue comment sync described in
[reference/zapier-comment-sync-playbook.md](/Users/hparacha/AyaFinancial/Blue/reference/zapier-comment-sync-playbook.md).

They are meant to be pasted into Zapier `Code by Zapier` steps and `Webhooks by Zapier`
custom requests.

## What Is Ready

- `hubspot-webhook-parse.js`
  Parses the HubSpot webhook payload and classifies note create, update, and delete events.
- `blue-webhook-parse.js`
  Parses the Blue outgoing webhook payload and classifies comment create, update, and delete events.
- `normalize-and-hash.js`
  Normalizes text and computes a stable SHA-256 hash for loop prevention.

## What Still Needs Zapier UI Assembly

The current MCP surface can work with Zapier app actions, but it does not expose Zap authoring,
trigger creation, or Catch Hook setup. The remaining manual or browser-driven work is:

1. Create `Zap 1: HubSpot Notes -> Blue Comments`
2. Create `Zap 2: Blue Comments -> HubSpot Notes`
3. Add the `Catch Raw Hook`, `Looping`, `Filter`, `Delay`, `Code`, and table lookup steps
4. Paste these code assets into the matching `Code by Zapier` steps
5. Wire the Blue and HubSpot custom requests using the payloads from the playbook

## Recommended Step Mapping

### Zap 1

- `Code by Zapier`: use `hubspot-webhook-parse.js`
- `Code by Zapier`: use `normalize-and-hash.js` on the fetched HubSpot note body

### Zap 2

- `Code by Zapier`: use `blue-webhook-parse.js`
- `Code by Zapier`: use `normalize-and-hash.js` on the Blue comment text

## Verified API Notes

- Blue update mutation: `editComment(input: EditCommentInput!)`
- HubSpot note association type for contacts: `202`
- HubSpot note association type for companies: `190`

If the synced HubSpot "client" is a custom object, you still need that object's note association type id.
