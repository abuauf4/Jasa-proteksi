#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
  echo "Missing .env. Copy .env.example to .env and fill the required values."
  exit 1
fi

set -a
source .env
set +a

for key in DATABASE_URL DIRECT_URL NEXTAUTH_SECRET; do
  if [ -z "${!key:-}" ]; then
    echo "Missing required environment variable: $key"
    exit 1
  fi
done

npx prisma generate >/dev/null
exec npx next dev -p "${PORT:-3000}"
