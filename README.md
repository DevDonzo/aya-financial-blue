# 🟦 Aya Copilot for Blue

> An integrated AI-powered operational layer for Aya Financial, built on top of [Blue.cc](https://blue.cc).

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Verified-success)](https://github.com/AyaFinancial/Blue/actions)
[![Environment](https://img.shields.io/badge/Environment-Production--Ready-blue)](https://docs.blue.cc)
[![Stack](https://img.shields.io/badge/Stack-TypeScript%20%7C%20Go%20%7C%20React-informational)](https://github.com/AyaFinancial/Blue)

This repository contains the **Aya Copilot** ecosystem—a suite of tools designed to transform CRM operations from manual data entry into conversational intelligence. It bridges the gap between the Blue CRM system of record and everyday employee workflows.

---

## 🏗️ Architecture: The Three Layers

Aya is structured as a **"Face, Brain, and Tools"** ecosystem:

| Layer | Component | Role | Tech Stack |
| :--- | :--- | :--- | :--- |
| **The Face** | `apps/librechat` | **Employee Interface**: Custom chat shell where teams interact with AI. | Node.js, React, MongoDB |
| **The Brain** | `apps/aya-ops-bot` | **Business Logic**: Identity resolution, MCP server, safety guardrails, and audit logging. | Fastify, TypeScript, SQLite |
| **The Tools** | `tools/blue-cli` | **Management**: High-performance Go CLI for bulk operations and Blue CRM configuration. | Go, GraphQL |

---

## 🚀 Key Capabilities

- **Natural Language CRM**: Move records, search clients, add notes, and create leads using plain English.
- **Identity Awareness**: Automatically maps LibreChat users to Blue Employees for attributed actions and security.
- **Enterprise Guardrails**: Strict workspace-scoping ensures AI actions only occur in approved Blue environments.
- **Operational Audit**: Full transparency with structured logs of every prompt, response, and API call.
- **Performance Cache**: A local SQLite-backed index of Blue data for near-instant summaries and lookups.

---

## 📂 Repository Structure

```text
├── apps/
│   ├── aya-ops-bot/       # Core TypeScript service, MCP server, & Admin UI
│   └── librechat/         # Custom employee-facing chat application
├── tools/
│   ├── blue-cli/          # Go-based management CLI for Blue.cc
│   └── bin/               # Compiled helper binaries
├── docs/
│   ├── architecture/      # System design and runtime flow docs
│   ├── mcp/               # Model Context Protocol & guardrail specs
│   └── product/           # Adoption and rollout strategy
├── reference/
│   ├── blue-api-docs/     # Markdown export of Blue GraphQL API
│   └── blue-api-live-schema/ # Live GraphQL schema reference
└── scripts/               # Helper scripts for data export and setup
```

---

## 🛠️ Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Go 1.21+ (for CLI development)

### Quick Start (Full Stack)
To spin up the entire Aya ecosystem (LibreChat + Aya Ops Bot + Databases):

```bash
# Clone the repository
git clone https://github.com/AyaFinancial/Blue.git
cd Blue

# Start the services
docker-compose up -d
```

### Blue CLI Installation
For direct CRM management:
```bash
# Via Homebrew
brew install heyblueteam/tap/blue-cli
blue init
```

---

## 🛡️ Safety & Governance

Aya is built with a **"Safety-First"** philosophy for financial operations:
- **Zero-Guessing**: Ambiguous requests trigger clarification rather than execution.
- **Hard-Scoped**: Writes are strictly restricted to verified production-ready workspaces.
- **Audit-Trail**: Every interaction is logged in `bot_audit_logs` for compliance review.

---

## 📑 Documentation Index

- **[System Design](apps/aya-ops-bot/docs/system-design.md)** - Technical deep-dive into the Ops Bot.
- **[Aya Setup Guide](apps/librechat/docs/AYA_SETUP.md)** - How to configure the LibreChat interface.
- **[CLI Reference](tools/blue-cli/README.md)** - Comprehensive guide to the `blue` command-line tool.
- **[Deployment Guide](docs/deployment-guide.md)** - Production rollout instructions.

---

### ⚠️ Transitional Compatibility
Compatibility symlinks remain at the top-level (`LibreChat`, `aya-ops-bot`, `blue-api-docs`, etc.) to ensure existing local commands and scripts do not break while workspace references are updated.

---

<p align="center">
  Built with ❤️ by Aya Financial Engineering<br>
  <i>Empowering teams through intelligent operations.</i>
</p>

---

**Last verified deployment:** Wed 22 Apr 2026 14:43:02 EDT

**CI/CD Pipeline Live Check:** Wed 22 Apr 2026 15:02:02 EDT

**CI/CD Pipeline Authorization Check:** Wed 22 Apr 2026 15:03:30 EDT

**CI/CD Pipeline Branch Alignment Check:** Wed 22 Apr 2026 15:10:24 EDT

**Final CI/CD Pipeline Verification:** Wed 22 Apr 2026 15:19:26 EDT - All systems GO.
