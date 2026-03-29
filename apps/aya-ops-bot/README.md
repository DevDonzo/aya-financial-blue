# Aya Ops Bot

Aya Ops Bot is Aya Financial's internal AI operations layer for Blue.

It turns LibreChat into a controlled, auditable employee workspace for CRM work without replacing Blue itself. Employees chat in plain language. Aya resolves identity, applies guardrails, calls approved Blue operations, writes audit logs, and gives managers an internal review console.

This README is written as a production-level product brief. It should be enough to understand the system, explain it to leadership, or paste into another model without needing the rest of the repo.

## Executive Summary

Aya is an enterprise internal product for Aya Financial with three clear layers:

- LibreChat is the employee-facing chat interface
- Aya Ops Bot is the secure business-logic and audit layer
- Blue remains the CRM and system of record

Aya exists to make CRM work faster and safer:

- employees can search clients, read comments, add notes, move records, and create leads by chat
- managers can audit what employees asked, what Aya replied, and what was written to Blue
- the company keeps all write activity scoped to a safe Blue copy workspace during rollout

The product goal is not to build a second CRM. The goal is to create an operational copilot that sits on top of Blue and makes the existing CRM easier to use.

## What Aya Is

Aya Ops Bot is a Fastify service written in TypeScript that:

- exposes HTTP APIs for auth, records, summaries, sync, admin, and health
- exposes an MCP server at `/mcp` for LibreChat
- syncs Blue employees, lists, records, and activity into a local cache
- resolves employee identity from session, headers, email, and identity links
- maps natural-language requests to approved Blue-backed actions
- persists structured audit logs for every bot interaction
- serves a React admin dashboard at `/admin`

## What Aya Is Not

Aya is not:

- a replacement for Blue
- an open-ended shell agent
- a public chatbot
- a generic multi-workspace automation bot
- a system that should ever write into the real Blue production workspace during pilot rollout

## Product Vision

The long-term product vision is simple:

- employees talk to Aya like an operations coworker
- Aya handles the structured work underneath
- Blue remains the source of truth
- managers get visibility, control, and reporting

The ideal employee experience is:

1. ask in plain English
2. Aya understands the operational intent
3. Aya performs the safe action or asks one short follow-up question
4. everything is logged and reviewable

## Core Business Value

Aya is designed to improve four things:

- speed: less time spent clicking through Blue for routine work
- consistency: standardized actions and cleaner operational behavior
- visibility: managers can audit prompts, responses, syncs, and outcomes
- safety: Blue writes happen through a controlled backend with workspace guardrails

## Current Stack

- Backend: Fastify + TypeScript
- Validation: Zod
- Data layer: Kysely
- Database: SQLite
- Admin UI: React + Vite
- Chat integration: MCP over HTTP
- Blue integration: direct GraphQL reads and writes
- Logging: structured application logging plus persistent audit logs
- Tests: Vitest
- Packaging: Docker + docker-compose

## Architecture

```text
Employee
  -> LibreChat
    -> Aya MCP / HTTP
      -> Blue GraphQL
      -> SQLite
      -> Admin UI
```

Operationally:

- LibreChat is the employee chat shell
- Aya owns identity, permissions, intent routing, audit, sync, and approved automation
- Blue owns CRM records, comments, workflow stages, assignments, and activity history

## Enterprise Boundary

### Blue Owns

- records and client detail
- lists and stage movement
- comments and activity
- user/workspace data
- tags and assignments

### Aya Owns

- employee identity mapping
- auth and admin access
- chat-to-action routing
- workspace safety rules
- audit logging
- synced cache for lookup and summaries
- MCP tools for LibreChat
- admin review and control surface

## Workspace Safety

Aya is intentionally hard-scoped to the Blue copy workspace for rollout.

Authoritative allowed workspace:

- Workspace ID: `cmn524yr800e101mh7kn44mhf`

Current display name used in product/docs:

- `03 - AYA x Hamza/ AI`

Forbidden production workspace:

- Workspace ID: `cmhazc4rl1vkand1eonnmiyjy`
- Display name: `AYA sales CRM 3`

Rules:

- every Blue write must be explicitly scoped to `cmn524yr800e101mh7kn44mhf`
- Aya should never write to an unspecified workspace
- Aya should never perform actions across all workspaces
- ambiguous workspace scope should stop the flow, not guess

## Current Product Features

### 1. Employee Chat Operations

Employees can already use Aya to:

- search for clients and records
- retrieve client detail
- read recent comments and recent activity
- add comments/notes to records
- move records between pipeline stages
- create new lead records
- ask what they are working on
- request daily summaries for themselves or the team

### 2. Identity Resolution

Aya resolves who the employee is through:

- authenticated admin sessions
- explicit employee headers from LibreChat
- synced Blue employees
- `identity_links` records
- automatic email-link creation when a LibreChat email matches a synced employee

### 3. Blue Sync and Cache Layer

Aya maintains a local operational cache of:

- employees
- Blue lists/stages
- Blue records
- Blue activity events
- sync watermarks and incremental sync state
- webhook metadata

This makes chat responses faster and enables summaries, audit views, and admin reporting without hitting Blue for every screen refresh.

### 4. Admin Dashboard

The admin UI is an internal operating console, not a public front end.

It gives admins:

- audit logs of what employees asked and what Aya replied
- stored request and response JSON for detailed inspection
- LibreChat transcript inspection
- employee activity summaries
- identity mapping management
- manual sync controls and sync status visibility
- rollout guidance and prompt examples

### 5. Audit and Compliance

Aya persists a structured trail for bot usage, including:

- prompt text
- matched intent
- actor identity
- success/failure outcome
- response text
- request JSON
- response JSON

This creates a clear audit trail for internal review and rollout confidence.

## Employee Use Cases

Aya is designed around real employee workflows.

### Workload and Prioritization

- `what am i working on`
- `show my open files`
- `what are my open records right now`
- `which clients are assigned to me today`

### Search and Lookup

- `find John Smith`
- `show me sheraz`
- `look up 416-555-0199`
- `search for hamza@example.com`

### Read Comments Before a Call

- `show comments for John Smith`
- `what's in the comments on sheraz`
- `list recent comments for Michael Brown`

### Add Notes

- `add note to John Smith: client sent income docs`
- `add comment to sheraz: called twice, no answer`
- `comment on the Patel file: lawyer is waiting for commitment`

### Move a Record

- `move John Smith to 0.2`
- `move sheraz to underwriting`
- `move the Patel file to commitments`

### Create a New Lead

- `create a new lead named john smith phone 4165550123 email john@example.com amount 275000`
- `new lead maria khan, email maria@example.com, phone 6475550101`
- `add a client named david lee with phone 9055550199 and amount 450000`

### Activity and Summary Questions

- `what did i do today`
- `what did Hamza do today`
- `what did the team do today`
- `who had no activity today`
- `what changed today`

## MCP Tool Surface

LibreChat currently connects to Aya through MCP and can use:

- `aya_message`
- `aya_search_clients`
- `aya_get_client_detail`
- `aya_get_employee_day_summary`
- `aya_get_team_day_summary`
- `aya_get_employee_workload`
- `aya_create_client_record`
- `aya_move_client_to_stage`
- `aya_add_client_comment`

The product direction also includes a dedicated comments-focused path so the model can request recent comments directly instead of relying only on full record detail.

## Lead Creation Philosophy

Lead creation should feel conversational, but execute as structured data entry underneath.

The correct production pattern is:

1. employee writes naturally in LibreChat
2. the model extracts structured fields
3. Aya validates those fields
4. Aya writes to Blue only inside the allowed workspace
5. Aya returns a clean confirmation

Important behavior:

- lowercase employee input should still produce properly cased names
- emails should stay lowercase
- phone values should be normalized when possible
- Aya should ask one short follow-up question if the input is ambiguous
- Aya should not invent missing finance fields that would create bad Blue formula output

## Admin Experience

The admin dashboard is built around the questions a manager or operator actually needs answered:

- what did the employee ask
- what did Aya say back
- what exact action was attempted
- what structured payload was sent
- what came back from Blue
- what synced and when
- who is mapped to which identities

The intended admin workflow is:

1. choose the employee
2. inspect the employee's Aya interactions
3. review the corresponding LibreChat conversation
4. inspect sync health and timestamps
5. repair identity links if required

## APIs and Operational Endpoints

### Core App Routes

- `GET /health`
- `GET /admin`
- `GET /auth/me`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /messages`
- `POST /intent-test`
- `GET /mcp`
- `POST /mcp`

### Admin and Operations

- `GET /admin/api/overview`
- `GET /admin/api/logs`
- `GET /admin/api/logs/:id`
- `GET /admin/api/employee-activity`
- `GET /admin/api/transcripts`
- `GET /employees`
- `GET /identity-links`
- `POST /identity-links`
- `DELETE /identity-links/:id`
- `POST /sync/employees`
- `POST /sync/workspace-index`
- `POST /admin/api/sync/employees`
- `POST /admin/api/sync/workspace-index`
- `POST /admin/api/sync/blue-activity`
- `POST /webhooks/blue`

### Record and Summary APIs

- `GET /records/search`
- `GET /records/:id`
- `GET /records/:id/detail`
- `GET /summary/day`
- `GET /summary/team`

## Data Model

Aya's runtime state is organized around a small set of operational tables:

- `employees`
- `identity_links`
- `employee_credentials`
- `auth_sessions`
- `activity_events`
- `bot_audit_logs`
- `blue_lists_cache`
- `blue_records_cache`
- `blue_sync_state`
- `blue_webhook_subscriptions`

These tables let Aya answer chat requests quickly, keep an audit trail, and support a usable admin interface.

## Production Readiness

Aya is already shaped like a production internal product:

- typed Fastify routes
- Zod validation
- type-safe SQL with Kysely
- structured audit logging
- React admin UI
- Docker packaging
- sync watermarks and incremental Blue sync
- webhook support with polling fallback
- explicit workspace safety constraints

The current rollout posture is suitable for an internal pilot, not a public SaaS launch.

## Recommended Pilot Deployment

The recommended first production deployment is:

- one Hetzner VM
- Docker Compose
- LibreChat
- Aya Ops Bot
- MongoDB
- Meilisearch
- local Aya SQLite volume
- Cloudflare Tunnel
- Cloudflare Access in front of the employee-facing app

Why this is the right first move:

- low cost
- low operational complexity
- no public inbound app ports required
- identity-aware access before the app even loads
- easy to debug during pilot rollout

### Security Model

For rollout, the preferred security posture is:

- no public direct exposure of LibreChat or Aya container ports
- Cloudflare Tunnel for outbound-only connectivity from the VM
- Cloudflare Access policy limiting app access to Aya staff or pilot users
- Blue credentials stored only on Aya
- admin routes restricted to authenticated admins
- all Blue writes logged and scoped to the allowed workspace ID

## Cost Guidance

The pilot is intentionally lean.

Target cost profile:

- Hetzner VM: low-cost 4 vCPU / 8 GB class instance
- Cloudflare Zero Trust: free tier is sufficient for a small internal pilot
- LLM costs: modest internal usage should remain manageable if model routing is disciplined

Practical takeaway:

- Aya is not an expensive product to pilot
- the biggest value comes from operational leverage, not infrastructure spend

## Rollout Plan

The best rollout sequence is:

1. start with read-heavy workflows
2. enable simple writes like comments and stage moves
3. enable structured lead creation
4. introduce manager reporting and proactive alerts

Best early workflows:

- workload lookup
- client search
- comments lookup
- record detail
- add a note
- move a record

## Product Roadmap From Adoption

These are the highest-value roadmap items already identified.

### Security and Access

- Cloudflare Zero Trust as the default gateway for pilot and production-internal rollout

### Reporting

- automated Friday Pulse report for leadership
- stale lead detection
- team productivity metrics
- DM or email delivery for weekly summaries

### AI and Cost Optimization

- dynamic model routing by task type
- cheaper models for routine actions
- stronger models only for harder reasoning or fallback

### Proactive Operations

- webhook-driven employee nudges for high-priority lead assignments
- proactive history summaries when new work lands

### CRM Expansion

- assignment and reassignment flows
- stronger phone/email search
- overdue file views
- stale lead reporting
- updated today / changed today manager views
- safe capture of purchase price and down payment
- better phone-friendly response formatting
- eventual WhatsApp adapter

## Known Product Constraints

Aya is useful now, but there are still real limitations:

- ambiguous names still require clarification
- formula-heavy finance fields need safer data capture
- some write flows can still be faster
- not every manager question has a dedicated path yet

These are normal rollout constraints, not architectural blockers.

## Why This Product Matters

Aya is not just a chat wrapper. It is a controlled operations layer for Aya Financial.

It gives the company:

- a safer way to operationalize AI inside CRM workflows
- a clear audit trail for internal usage
- a rollout path that leadership can understand
- a foundation for future reporting, automation, and proactive operations

The product is already strong enough to pilot internally. The next phase is rollout discipline, user adoption, and expanding the highest-value workflows.
