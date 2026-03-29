#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="${HOME}/.config/blue/config.env"

if [[ ! -f "${CONFIG_FILE}" ]]; then
  echo "Missing Blue CLI config at ${CONFIG_FILE}" >&2
  exit 1
fi

set -a
source "${CONFIG_FILE}"
set +a

: "${CLIENT_ID:?Missing CLIENT_ID in ${CONFIG_FILE}}"
: "${AUTH_TOKEN:?Missing AUTH_TOKEN in ${CONFIG_FILE}}"
: "${COMPANY_ID:?Missing COMPANY_ID in ${CONFIG_FILE}}"

exec npx -y mcp-remote \
  "https://mcp.blue.cc/mcp" \
  --header "x-bloo-token-id:${CLIENT_ID}" \
  --header "x-bloo-token-secret:${AUTH_TOKEN}" \
  --header "x-bloo-company-id:${COMPANY_ID}"
