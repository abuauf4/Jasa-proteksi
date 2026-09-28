#!/bin/bash
set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
  echo "Missing .env. Copy .env.example to .env and fill the required values."
  exit 1
fi

while true; do
  set -a
  source .env
  set +a

  echo "[$(date)] Starting Next.js dev server..."
  npx prisma generate >/dev/null 2>&1
  npx next dev -p "${PORT:-3000}"
  echo "[$(date)] Server exited, restarting in 3s..."
  sleep 3
done
