# Aya Financial Blue Deployment Guide

This guide documents a practical deployment approach for Aya Financial's Blue platform.

The target operating model is intentionally simple:

- Aya Financial is a small team of roughly 10 people.
- The goal is a reliable internal system, not an overbuilt cloud platform.
- The preferred deployment is one VM, Docker Compose, persistent volumes, and Cloudflare in front.
- The standard is "works consistently, is easy to recover, and is cheap to run."

This is a good fit for an internal pilot or steady-state small-team deployment.

## Deployment Philosophy

For this project, "good" deployment means:

- low monthly cost
- minimal moving parts
- no public app ports
- clear operator access to the VM
- persistent data volumes
- restartable services
- a short recovery path if the VM or containers fail

For this project, "good" does not require:

- Kubernetes
- managed databases
- autoscaling
- complex service meshes
- multi-region failover
- expensive observability tooling

Those would add cost and operational overhead without meaningfully improving outcomes for a team this size.

## Recommended Topology

Use one Hostinger VPS running Docker Compose, with Cloudflare Tunnel and Cloudflare Access in front of the application.

Traffic flow:

```text
Employee Browser
  -> Cloudflare Access
  -> Cloudflare Tunnel
  -> 127.0.0.1:3080 (LibreChat)
  -> 127.0.0.1:3010 (Aya admin/API)

LibreChat
  -> Aya MCP server over Docker network

Aya
  -> Blue GraphQL
  -> SQLite persistent volume

LibreChat
  -> MongoDB
  -> Meilisearch
```

Important behavior in the current compose stack:

- app ports are bound to `127.0.0.1`, not `0.0.0.0`
- `cloudflared` runs on the host and proxies to localhost
- containers restart automatically with `restart: unless-stopped`
- Aya includes a health check on `/health`
- application and database state is stored in bind-mounted folders on disk

## Recommended VPS

For Aya Financial's current size, the existing target is reasonable:

- Hostinger KVM 2
- 2 vCPU
- 8 GB RAM
- 100 GB NVMe
- Ubuntu 24.04

Why this is enough:

- the user base is small
- traffic is internal and low concurrency
- Docker Compose keeps operations simple
- SQLite is acceptable for Aya's local operational state at this scale

If the team grows materially, the first likely pressure points are RAM usage and storage growth, not architectural limits.

## What This Setup Is Good For

This deployment is appropriate for:

- internal staff use
- a pilot with a controlled user group
- a small production workload with limited concurrency
- cost-sensitive operations where simplicity matters more than theoretical scale

This deployment is not designed to guarantee:

- formal high availability
- zero-downtime upgrades
- multi-node redundancy
- disaster recovery across multiple regions

It is better described as reliable and practical for a small team, not "enterprise HA."

## Source Of Truth

The deployment assets already live here:

- `Blue/apps/aya-ops-bot/deploy/hostinger/docker-compose.yml`
- `Blue/apps/aya-ops-bot/deploy/hostinger/env/aya.env.example`
- `Blue/apps/aya-ops-bot/deploy/hostinger/env/librechat.env.example`
- `Blue/apps/aya-ops-bot/deploy/hostinger/config/librechat.yaml.example`
- `Blue/apps/aya-ops-bot/deploy/hostinger/cloudflared/config.yml.example`

This guide should match those files. If the compose stack changes, update this document with it.

## Services In The Stack

The current Hostinger deployment includes:

- `aya`: Aya ops bot, MCP surface, admin/API layer
- `librechat`: employee-facing chat interface
- `mongodb`: LibreChat persistence
- `meilisearch`: LibreChat search dependency

Persistent storage directories:

- `deploy/hostinger/data/aya`
- `deploy/hostinger/data/mongodb`
- `deploy/hostinger/data/meilisearch`
- `deploy/hostinger/data/librechat/uploads`
- `deploy/hostinger/data/librechat/logs`

## Prerequisites

Before deployment, have the following ready:

- a Hostinger VPS with Ubuntu 24.04
- Docker Engine installed
- Docker Compose plugin installed
- `git` and `curl`
- a Cloudflare account with the Aya domain managed there
- `chat.ayafinancial.com` and, if used, `ops-admin.ayafinancial.com`
- Blue API credentials for the allowed Aya workspace only
- an operator access path to the VM

Operator access should be one of:

- Hostinger browser terminal
- Tailscale
- a tightly restricted SSH path

Do not confuse "no public app ports" with "no operator access."

## Security Posture

The baseline security model is intentionally simple:

- do not expose LibreChat or Aya directly on public ports
- bind app services to localhost only
- put Cloudflare Tunnel in front of the app
- require Cloudflare Access before users reach the login page
- keep secrets in env files on the VM, not in the repo
- keep the pilot scoped to the approved Blue workspace only

For a small team, this gives strong practical protection without adding expensive infrastructure.

## Deployment Steps

### 1. Provision The VM

Create the Hostinger VPS with the recommended size above.

Basic host setup:

- update packages
- install Docker Engine and Docker Compose plugin
- install `git` and `curl`
- configure timezone if needed
- confirm you can reconnect through your chosen admin path

### 2. Pull The Repo

Clone the Aya Financial repository onto the VM and navigate to:

```bash
cd Blue/apps/aya-ops-bot/deploy/hostinger
```

### 3. Prepare Configuration

Copy the example files:

```bash
cp env/aya.env.example env/aya.env
cp env/librechat.env.example env/librechat.env
cp config/librechat.yaml.example config/librechat.yaml
```

Create the storage folders before first boot:

```bash
mkdir -p data/aya data/mongodb data/meilisearch data/librechat/uploads data/librechat/logs
```

If using the Cloudflare template, also prepare:

```bash
cp cloudflared/config.yml.example /etc/cloudflared/config.yml
```

### 4. Configure Aya

Edit `env/aya.env` and set:

- `BLUE_AUTH_TOKEN`
- `BLUE_CLIENT_ID`
- `BLUE_COMPANY_ID`
- `AUTH_BOOTSTRAP_KEY`
- `BLUE_WEBHOOK_SECRET`

Keep the deployment constrained to the approved workspace:

- `BLUE_WORKSPACE_ID=cmn524yr800e101mh7kn44mhf`

Operational note:

- do not point this deployment at the forbidden production Blue workspace
- do not commit populated env files back into source control

### 5. Configure LibreChat

Edit `env/librechat.env` and set:

- `DOMAIN_CLIENT`
- `DOMAIN_SERVER`
- `CREDS_KEY`
- `CREDS_IV`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `MEILI_MASTER_KEY`

Generate secrets with:

```bash
openssl rand -hex 32
openssl rand -hex 16
```

Use:

- 64 hex characters for `CREDS_KEY`
- 32 hex characters for `CREDS_IV`
- 64 hex characters for `JWT_SECRET`
- 64 hex characters for `JWT_REFRESH_SECRET`
- 64 hex characters for `MEILI_MASTER_KEY`

Edit `config/librechat.yaml` only if Aya-specific UI or policy settings need to change.

### 6. Start The Stack

Launch from the deployment directory:

```bash
docker compose up -d --build
```

Then validate immediately:

```bash
docker compose ps
curl http://127.0.0.1:3010/health
curl -I http://127.0.0.1:3080
```

Expected results:

- all containers are up or healthy
- Aya responds successfully on `127.0.0.1:3010/health`
- LibreChat responds on `127.0.0.1:3080`
- data appears under `deploy/hostinger/data/`
- neither application is listening on a public interface

### 7. Install Cloudflare Tunnel

Install `cloudflared` on the VM using Cloudflare's Linux instructions.

Then run:

```bash
cloudflared tunnel login
cloudflared tunnel create aya-pilot
cloudflared tunnel route dns aya-pilot chat.ayafinancial.com
cloudflared tunnel route dns aya-pilot ops-admin.ayafinancial.com
```

Update `/etc/cloudflared/config.yml` with:

- the tunnel ID
- the credentials file path
- the final hostnames

Then install and start the service:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

### 8. Add Cloudflare Access Rules

In Cloudflare Zero Trust:

1. Create an Access app for `chat.ayafinancial.com`
2. Limit it to `@ayafinancial.com` users or a strict tester allow-list
3. Create a second Access app for `ops-admin.ayafinancial.com`
4. Make the admin route stricter than the chat route

This is the main external access control layer for the deployment.

## Post-Deploy Validation

After the stack is live, confirm the following:

- employees can reach the chat hostname only after passing Cloudflare Access
- public unauthenticated access is blocked
- LibreChat loads normally
- Aya tools respond through LibreChat
- a simple safe workflow works end to end

Recommended smoke test:

1. Log in as a pilot user
2. Ask Aya to search for a known client
3. Ask for recent comments on that client
4. Add a harmless test comment
5. Confirm the action appears correctly in Blue
6. Check Aya logs for the request

If that works, the deployment is operational.

## Day-2 Operations

For a deployment like this, operations should stay boring and repeatable.

Regular checks:

- `docker compose ps`
- `docker compose logs --tail=100 aya`
- `docker compose logs --tail=100 librechat`
- confirm Cloudflare Access is still enforcing login
- confirm available disk space is healthy

This setup does not need a large observability stack. For a 10-person team, container status, basic logs, and occasional manual checks are enough if they are done consistently.

## Upgrades

The upgrade path should stay simple:

1. take a VM snapshot or back up the key volumes
2. pull the updated repo
3. review env or config changes
4. run `docker compose up -d --build`
5. rerun the smoke test

This is not zero-downtime, and that is acceptable for this deployment model.

For a small internal team, short maintenance windows are usually the correct tradeoff.

## Backups

Minimum backup targets:

- Aya SQLite data in `deploy/hostinger/data/aya`
- LibreChat Mongo data in `deploy/hostinger/data/mongodb`
- LibreChat uploads in `deploy/hostinger/data/librechat/uploads`

Recommended baseline:

- use Hostinger VPS snapshots before major changes
- perform periodic backups of the important storage directories
- store backups off the VM
- test at least one restore path before relying on the system operationally

For Aya Financial's size, this is enough. You do not need a complex backup platform if snapshots and periodic volume copies are done reliably.

## Failure Recovery

If the app goes down, recover in this order:

1. check `docker compose ps`
2. inspect Aya and LibreChat logs
3. restart the affected service or the full compose stack
4. verify localhost health checks
5. verify Cloudflare Tunnel status
6. rerun the smoke test

If the VM itself is lost:

1. recreate the VM
2. restore the repo and env/config files
3. restore the persistent data from snapshot or backup
4. start the compose stack
5. revalidate Cloudflare Tunnel and Access

That is an acceptable recovery model for a small internal system.

## What Not To Over-Engineer

Do not add the following unless there is a real operational need:

- Kubernetes
- managed Mongo just for appearance
- separate staging and production clusters for a tiny pilot
- heavy monitoring vendors
- complex CI/CD release gates
- extra services that raise cost without reducing real risk

The right architecture here is the one the team can actually operate confidently.

## Recommended Resume And LinkedIn Framing

This deployment supports claims like:

- architected a cost-conscious internal AI operations platform
- orchestrated Docker-based deployments on Hostinger VPS
- secured internal access with Cloudflare Tunnel and Cloudflare Access
- delivered a reliable one-VM deployment model for a small team

This deployment does not, by itself, support stronger claims like:

- built a globally distributed platform
- delivered formal high availability
- designed hyperscale infrastructure

Use precise language. The work is solid without exaggeration.
