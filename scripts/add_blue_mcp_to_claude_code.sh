#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="${HOME}/.config/blue/config.env"

if [[ ! -f "${CONFIG_FILE}" ]]; then
  echo "Missing Blue config: ${CONFIG_FILE}" >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "Claude Code CLI ('claude') is not installed or not on PATH." >&2
  exit 1
fi

set -a
source "${CONFIG_FILE}"
set +a

: "${CLIENT_ID:?Missing CLIENT_ID in ${CONFIG_FILE}}"
: "${AUTH_TOKEN:?Missing AUTH_TOKEN in ${CONFIG_FILE}}"
: "${COMPANY_ID:?Missing COMPANY_ID in ${CONFIG_FILE}}"

claude mcp remove blue >/dev/null 2>&1 || true

exec claude mcp add \
  -t http \
  -H "x-bloo-token-id: ${CLIENT_ID}" \
  -H "x-bloo-token-secret: ${AUTH_TOKEN}" \
  -H "x-bloo-company-id: ${COMPANY_ID}" \
  -- blue https://mcp.blue.cc/mcp
