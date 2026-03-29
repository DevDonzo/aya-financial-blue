# LibreChat Enterprise Rollout

This document defines the Aya-specific production posture for LibreChat.

## Objectives

- keep LibreChat as the employee-facing chat surface
- route internal workflow actions through Aya over MCP
- remove local-only assumptions from the deployment path
- lock down self-service features that are unnecessary for an internal ops tool

## Recommended Files

- base local config: `librechat.yaml`
- production-oriented config: `librechat.enterprise.yaml`
- production env template: `.env.enterprise.example`

## Core Design

LibreChat should remain responsible for:

- authentication
- conversation UI
- chat history
- MCP server configuration and invocation

Aya should remain responsible for:

- company-specific workflow logic
- employee identity propagation to tools
- guardrails around CRM actions
- summaries, audit logs, and Blue-safe write actions

LibreChat should call Aya over MCP, not Blue directly.

## Production Posture

Recommended settings:

- use company SSO through OpenID
- put Cloudflare Access in front of the chat hostname so the app is not publicly reachable before login
- disable open registration
- disable unverified-email access
- disable user-created MCP servers
- disable agents, prompts, marketplace, code execution, and web search unless there is a specific business need
- use Redis for cache and session storage
- use an internal Aya MCP URL rather than a host-local address

## Required Environment Work

Before production rollout:

1. Copy `.env.enterprise.example` to a deployment-specific `.env`.
2. Generate real values for `CREDS_KEY`, `CREDS_IV`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `OPENID_SESSION_SECRET`, and `MEILI_MASTER_KEY`.
3. Fill in the OpenID provider values.
4. Set the `aya_ops` MCP server URL in `librechat.enterprise.yaml` to the internal Aya endpoint reachable from LibreChat.
5. Mount `librechat.enterprise.yaml` as `/app/librechat.yaml`.

## Suggested Identity Model

Use company email as the canonical identity between LibreChat and Aya.

LibreChat already passes these headers to Aya:

- `x-aya-employee-email: {{LIBRECHAT_USER_EMAIL}}`
- `x-aya-employee-name: {{LIBRECHAT_USER_NAME}}`

Production should treat email as the primary match key and display name as fallback only.

## Pilot Adoption Priorities

For the first rollout, optimize for the prompts employees actually say:

- workload: `what am i working on`
- client lookup: `find John Smith`, `search for hamza@example.com`
- comments: `show comments for John Smith`
- notes: `add note to sheraz: client sent docs`
- stage moves: `move sheraz to underwriting`
- lead creation: `create a new lead named john smith phone 4165550123 email john@example.com amount 275000`

The model prompt should prefer one short follow-up over a bad guess, especially when names or financial fields are ambiguous.

## Review Checklist

- authentication is SSO-only
- registration is disabled
- MCP is limited to Aya-managed servers
- Aya MCP URL in YAML is internal, not a host-local dev URL
- app title and policy links are company-branded
- logs are not left in verbose debug mode
- Redis is enabled
- secrets are provided externally and not committed
