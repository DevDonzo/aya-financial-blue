# Aya Copilot for Blue

Aya Copilot is an integrated operational layer and automation framework for Aya Financial, built to extend the capabilities of the Blue CRM (Blue.cc). This repository serves as the central hub for the Aya ecosystem, providing a secure bridge between the system of record and conversational AI interfaces.

## System Architecture

The ecosystem is partitioned into three distinct functional layers:

### 1. User Interface Layer (apps/librechat)
A customized deployment of LibreChat serving as the primary engagement surface for employees. It facilitates natural language interaction with CRM data via the Model Context Protocol (MCP).

### 2. Logic & Governance Layer (apps/aya-ops-bot)
The core backend service responsible for business logic, identity resolution, and security enforcement.
- **Identity Provider**: Maps chat sessions to Blue employee records for attributed actions.
- **Security Guardrails**: Implements strict workspace-level scoping to prevent unauthorized writes.
- **Audit Engine**: Maintains structured logs of all LLM-driven CRM modifications.
- **Persistence**: Utilizes a local SQLite cache for high-performance data retrieval and team summaries.

### 3. Administrative Tooling (tools/blue-cli)
A high-performance CLI written in Go, utilized for direct GraphQL API interaction, bulk record management, and system configuration.

---

## Technical Overview

### Repository Structure
- **apps/aya-ops-bot**: Fastify (TypeScript) service, MCP implementation, and React-based administration console.
- **apps/librechat**: Node.js/React application for employee chat workflows.
- **tools/blue-cli**: Go-based binary for low-level CRM operations.
- **docs/architecture**: Detailed runtime specifications and system flow diagrams.
- **reference/**: Exported GraphQL schemas and API documentation.

### Core Functionality
- **Conversational Record Management**: Natural language commands for record creation, movement, and modification.
- **Automated Summarization**: Daily and team-level activity reporting powered by local data indexing.
- **Identity Propagation**: Transparent mapping of authenticated chat users to CRM actors.
- **Operational Audit**: Comprehensive persistence of prompt-response cycles and downstream API payloads.

---

## Deployment and Configuration

### Requirements
- Docker and Docker Compose (recommended for full-stack orchestration)
- Node.js 18.x or later
- Go 1.21.x or later (for CLI development)

### Service Initialization
To initialize the full stack in a containerized environment:

```bash
git clone https://github.com/AyaFinancial/Blue.git
cd Blue
docker-compose up -d
```

### Management CLI Setup
For administrative access via the command line:

```bash
brew install heyblueteam/tap/blue-cli
blue init
```

---

## Governance and Safety

The Aya ecosystem is designed with a zero-trust approach to AI-driven CRM writes:
- **Hard-Scoped Workspaces**: Writes are restricted to explicitly allowed workspace IDs to prevent production data corruption during rollout phases.
- **Structured Audit Logs**: Every bot interaction is logged in the `bot_audit_logs` table, ensuring compliance with internal financial reporting standards.
- **Ambiguity Resolution**: The system is configured to request clarification rather than execute actions based on low-confidence intent matching.

---

## Documentation Index
- [System Architecture Specification](apps/aya-ops-bot/docs/system-design.md)
- [Interface Configuration Guide](apps/librechat/docs/AYA_SETUP.md)
- [CLI Reference Manual](tools/blue-cli/README.md)
- [Enterprise Deployment Guide](docs/deployment-guide.md)

---

### Transitional Compatibility
Legacy symlinks at the project root (e.g., `LibreChat`, `aya-ops-bot`) are maintained to ensure backward compatibility for existing scripts and local automation.

---

**Last verified deployment:** Wed 22 Apr 2026 14:43:02 EDT

**CI/CD Pipeline Live Check:** Wed 22 Apr 2026 15:02:02 EDT

**CI/CD Pipeline Authorization Check:** Wed 22 Apr 2026 15:03:30 EDT

**CI/CD Pipeline Branch Alignment Check:** Wed 22 Apr 2026 15:10:24 EDT

**Final CI/CD Pipeline Verification:** Wed 22 Apr 2026 15:19:26 EDT - All systems GO.
