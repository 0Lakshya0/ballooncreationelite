#!/usr/bin/env bash
# One-command recovery for the sandbox preview.
# Usage: bash scripts/preview.sh
set -euo pipefail

BRANCH="arena/d4819b41-ballooncreationelite"
cd "$(dirname "$0")/.."

git fetch origin "$BRANCH" >/dev/null 2>&1 || true
git reset --hard "origin/$BRANCH" >/dev/null 2>&1 || true

if [ ! -d node_modules ]; then
  npm install --legacy-peer-deps --no-audit --no-fund >/dev/null 2>&1
fi

if ! (ss -ltn 2>/dev/null || netstat -ltn 2>/dev/null) | grep -q ':8080'; then
  nohup npm run dev -- --host 0.0.0.0 --port 8080 >/tmp/preview.log 2>&1 &
  for _ in $(seq 1 40); do
    (ss -ltn 2>/dev/null || netstat -ltn 2>/dev/null) | grep -q ':8080' && break
    sleep 1
  done
fi

sleep 1
CODE=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080/ || true)
echo "server: $CODE on http://127.0.0.1:8080"
echo "public preview: https://8080-${E2B_SANDBOX_ID}.e2b.app"
