# Hetzner Pilot Deployment

This directory contains a concrete pilot deployment package for:

- one Hetzner VM
- Docker Compose
- LibreChat + Aya + Mongo + Meili + RAG services
- no public container ports
- Cloudflare Tunnel + Cloudflare Access in front

## Architecture

```text
Cloudflare Access -> Cloudflare Tunnel -> 127.0.0.1:3080 (LibreChat)
                                      -> 127.0.0.1:3010 (Aya admin/API)

LibreChat -> Aya MCP over Docker network
Aya -> Blue GraphQL
Aya -> SQLite volume
LibreChat -> Mongo + Meili + optional RAG stack
```

Important nuance:

- The app containers are not public.
- They are only bound to `127.0.0.1`, not `0.0.0.0`.
- This is necessary because the `cloudflared` daemon runs on the host and needs to reach the services locally.

## VM Shape

Recommended pilot host:

- Hetzner CX33
- 4 vCPU
- 8 GB RAM
- 80 GB NVMe

## Files In This Directory

- `docker-compose.yml`
- `env/aya.env.example`
- `env/librechat.env.example`
- `config/librechat.yaml.example`
- `cloudflared/config.yml.example`

## 1. Provision The VM

Install on Ubuntu 24.04:

- Docker Engine
- Docker Compose plugin
- `git`
- `curl`

Keep one operator access path to the VM itself:

- Hetzner console
- Tailscale
- or a locked-down SSH path

Do not confuse "no public app ports" with "no way to administer the server."

## 2. Prepare The Deployment Files

From the Aya repo root on the VM:

```bash
mkdir -p deploy/hetzner/env deploy/hetzner/config
cp deploy/hetzner/env/aya.env.example deploy/hetzner/env/aya.env
cp deploy/hetzner/env/librechat.env.example deploy/hetzner/env/librechat.env
cp deploy/hetzner/config/librechat.yaml.example deploy/hetzner/config/librechat.yaml
```

Then replace all placeholder secrets.

Generate LibreChat secrets with something like:

```bash
openssl rand -hex 32
openssl rand -hex 16
```

Use:

- 64 hex chars for `CREDS_KEY`
- 32 hex chars for `CREDS_IV`
- 64 hex chars for `JWT_SECRET`
- 64 hex chars for `JWT_REFRESH_SECRET`
- 64 hex chars for `MEILI_MASTER_KEY`

## 3. Configure Aya

Edit `deploy/hetzner/env/aya.env` and set:

- `BLUE_AUTH_TOKEN`
- `BLUE_CLIENT_ID`
- `BLUE_COMPANY_ID`
- `AUTH_BOOTSTRAP_KEY`
- `BLUE_WEBHOOK_SECRET`

Keep:

- `BLUE_WORKSPACE_ID=cmn524yr800e101mh7kn44mhf`

Do not point this pilot at the real production Blue workspace.

## 4. Configure LibreChat

Edit `deploy/hetzner/env/librechat.env`:

- set `DOMAIN_CLIENT` and `DOMAIN_SERVER` to the final chat hostname
- replace all secrets

Edit `deploy/hetzner/config/librechat.yaml` if needed.

Default posture in this template:

- no marketplace
- no user-created MCP servers
- no file search
- no web search
- side-panel only
- Aya MCP server preconfigured
- employee email passed to Aya via headers

## 5. Bring Up The Stack

From `deploy/hetzner/`:

```bash
docker compose up -d --build
```

Check:

```bash
docker compose ps
curl http://127.0.0.1:3010/health
curl -I http://127.0.0.1:3080
```

Expected:

- Aya listens only on `127.0.0.1:3010`
- LibreChat listens only on `127.0.0.1:3080`
- nothing is exposed to the public internet

## 6. Install Cloudflare Tunnel On The VM

Use the official `cloudflared` install flow from Cloudflare for your Linux distro.

Then:

```bash
cloudflared tunnel login
cloudflared tunnel create aya-pilot
cloudflared tunnel route dns aya-pilot chat.ayafinancial.com
cloudflared tunnel route dns aya-pilot ops-admin.ayafinancial.com
```

Copy `cloudflared/config.yml.example` to `/etc/cloudflared/config.yml` and replace:

- the tunnel ID
- the credentials file path
- the hostnames

Then install and start the service:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

## 7. Add Cloudflare Access

In Cloudflare Zero Trust:

1. Create an Access application for `chat.ayafinancial.com`
2. Require one of:
   - email domain `@ayafinancial.com`
   - a strict allow-list for pilot testers
3. Create a second Access application for `ops-admin.ayafinancial.com`
4. Make the admin hostname more restrictive than the employee chat hostname

This means:

- the app is invisible to the public internet
- users must pass Cloudflare Access before the LibreChat login screen even appears

## 8. Rollout Order

The safest rollout path is:

1. Start with search, detail, comments, and workload
2. Then allow comments and stage moves
3. Then allow lead creation
4. Review admin audit logs and failed matches weekly

This aligns with the current `adoption.md` guidance.

## 9. Backups

Back up at minimum:

- Aya SQLite volume
- LibreChat Mongo volume
- LibreChat uploads volume

For the pilot, VM snapshots plus periodic volume backups are acceptable.

## 10. Notes

- SQLite is a file-based DB mounted on a persistent volume. It is not a network service.
- This deployment is good for an internal pilot, not the final scale target.
- If the team outgrows SQLite or one-VM ops, the next move is Postgres/Redis plus split Aya services.
