#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="${HOME}/.config/make-api/config.env"

if [[ ! -f "${CONFIG_FILE}" ]]; then
  echo "Missing Make API config at ${CONFIG_FILE}" >&2
  exit 1
fi

set -a
source "${CONFIG_FILE}"
set +a

: "${MAKE_API_TOKEN:?Missing MAKE_API_TOKEN in ${CONFIG_FILE}}"
: "${MAKE_ZONE:?Missing MAKE_ZONE in ${CONFIG_FILE}}"

METHOD="${1:-}"
ENDPOINT="${2:-}"
DATA="${3:-}"

if [[ -z "${METHOD}" || -z "${ENDPOINT}" ]]; then
  echo "Usage: $0 METHOD /api/v2/endpoint [json-body]" >&2
  exit 1
fi

BASE_URL="https://${MAKE_ZONE}/api/v2"
URL="${BASE_URL}${ENDPOINT}"

ARGS=(-sS -X "${METHOD}" "${URL}" -H "Authorization: Token ${MAKE_API_TOKEN}" -H "Accept: application/json")

if [[ -n "${DATA}" ]]; then
  ARGS+=(-H "Content-Type: application/json" --data "${DATA}")
fi

curl "${ARGS[@]}"
