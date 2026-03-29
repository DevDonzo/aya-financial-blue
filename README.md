# Blue Workspace

Canonical workspace layout:

- `apps/librechat` - employee-facing LibreChat app
- `apps/aya-ops-bot` - Aya backend, MCP surface, admin UI, and local bot logic
- `apps/librechat/docs` - Aya-specific LibreChat setup and rollout notes
- `apps/aya-ops-bot/docs` - Aya app architecture and integration docs
- `tools/blue-cli` - Go Blue CLI source
- `tools/blue-cli/docs` - CLI planning and refactor notes
- `tools/bin` - local compiled helper binaries
- `reference/blue-api-docs` - exported Blue API markdown reference
- `reference/blue-api-live-schema` - exported Blue GraphQL schema reference
- `docs` - workspace-level deployment, MCP, and product docs
- `docs/mcp` - MCP setup and guardrail docs
- `docs/product` - adoption and product rollout notes
- `scripts` - local helper/export scripts
- `.local` - machine-local secrets and sensitive files

Transitional compatibility symlinks remain at the old top-level paths (`LibreChat`, `aya-ops-bot`, `blue.cc-AyaFinancial`, `blue-api-docs`, `blue-api-live-schema`, `mcp`, `bin`, `blue-api-token.json`) so existing local commands do not break while references are updated.

Packaging rule:

- treat `apps/*`, `tools/blue-cli`, `scripts`, and selected `docs` as source
- treat `.local`, build outputs, logs, uploads, and database files as local state
