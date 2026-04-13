#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="${HOME}/.config/zapier/config.env"

if [[ ! -f "${CONFIG_FILE}" ]]; then
  echo "Missing Zapier MCP config at ${CONFIG_FILE}" >&2
  exit 1
fi

set -a
source "${CONFIG_FILE}"
set +a

if [[ -n "${ZAPIER_MCP_URL:-}" ]]; then
  URL="${ZAPIER_MCP_URL}"
else
  : "${ZAPIER_MCP_BASE_URL:?Missing ZAPIER_MCP_BASE_URL in ${CONFIG_FILE}}"
  : "${ZAPIER_MCP_TOKEN:?Missing ZAPIER_MCP_TOKEN in ${CONFIG_FILE}}"
  URL="${ZAPIER_MCP_BASE_URL}?token=${ZAPIER_MCP_TOKEN}"
fi

exec npx -y mcp-remote "${URL}"
