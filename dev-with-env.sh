#!/bin/bash
# Load .env and run dev server
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"
set -a
source .env
set +a
npx next dev -p 3000 2>&1 | tee dev.log
