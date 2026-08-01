#!/bin/bash
# Ensure .env has correct PostgreSQL URL (init script may have overwritten it)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Always restore env vars before starting
cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://postgres.xzsrhgfoobpohbecwfwl:Guedoan9*123@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.xzsrhgfoobpohbecwfwl:Guedoan9*123@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
NEXTAUTH_SECRET=JIQGf7jJkiNzUyriMtk5hlWoUbuGZMVdHPPl7Eg2/U8p16WN042aJX8Ir1RYIcDm
NEXTAUTH_URL=http://localhost:3000
ENVEOF

set -a
source .env
set +a

# Regenerate Prisma client with correct DATABASE_URL
npx prisma generate >/dev/null 2>&1

# Start dev server
npx next dev -p 3000 2>&1 | tee dev.log
