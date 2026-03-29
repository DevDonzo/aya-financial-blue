# Project Rules

Always use the `blue` MCP server for Blue workspace access in this project when the task involves reading or changing Blue data.

## Workspace Safety

- Allowed workspace name: `03 - AYA x Hamza/ AI`
- Allowed workspace ID: `cmn524yr800e101mh7kn44mhf`
- Forbidden workspace name: `AYA sales CRM 3`
- Forbidden workspace ID: `cmhazc4rl1vkand1eonnmiyjy`

## Hard Constraints

1. Never create, update, move, comment on, tag, delete, or otherwise modify anything in `AYA sales CRM 3`.
2. Never perform write actions against all workspaces or an unspecified workspace.
3. Before any write operation, confirm the target workspace ID is exactly `cmn524yr800e101mh7kn44mhf`.
4. If a Blue request is ambiguous about workspace scope, stop and ask instead of acting.
5. Prefer workspace IDs over names when a tool accepts both.
