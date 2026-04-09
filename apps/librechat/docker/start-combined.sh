#!/usr/bin/env bash
set -euo pipefail

AYA_PORT="${AYA_PORT:-3010}"
AYA_HEALTH_URL="http://127.0.0.1:${AYA_PORT}/health"
AYA_API_URL="${AYA_API_URL:-http://127.0.0.1:${AYA_PORT}/mcp}"

cleanup() {
  local exit_code="${1:-0}"

  if [[ -n "${LIBRECHAT_PID:-}" ]]; then
    kill "${LIBRECHAT_PID}" 2>/dev/null || true
  fi

  if [[ -n "${AYA_PID:-}" ]]; then
    kill "${AYA_PID}" 2>/dev/null || true
  fi

  wait "${LIBRECHAT_PID:-}" 2>/dev/null || true
  wait "${AYA_PID:-}" 2>/dev/null || true

  exit "${exit_code}"
}

trap 'cleanup 0' SIGINT SIGTERM

cd /aya
PORT="${AYA_PORT}" node dist/server.js &
AYA_PID=$!

for _ in $(seq 1 60); do
  if curl -fsS "${AYA_HEALTH_URL}" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! curl -fsS "${AYA_HEALTH_URL}" >/dev/null 2>&1; then
  echo "Aya failed to become healthy at ${AYA_HEALTH_URL}" >&2
  cleanup 1
fi

cd /app
export AYA_API_URL
node api/server/index.js &
LIBRECHAT_PID=$!

set +e
wait -n "${AYA_PID}" "${LIBRECHAT_PID}"
EXIT_CODE=$?
set -e

cleanup "${EXIT_CODE}"
