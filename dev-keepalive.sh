#!/bin/bash
# Keep dev server alive — auto-restart on crash
cd /home/z/my-project

# Restore env on every restart (init script may overwrite it)
restore_env() {
  cat > .env << 'ENVEOF'
DATABASE_URL=postgresql://postgres.xzsrhgfoobpohbecwfwl:Guedoan9*123@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.xzsrhgfoobpohbecwfwl:Guedoan9*123@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
NEXTAUTH_SECRET=JIQGf7jJkiNzUyriMtk5hlWoUbuGZMVdHPPl7Eg2/U8p16WN042aJX8Ir1RYIcDm
NEXTAUTH_URL=http://localhost:3000
ENVEOF
  chmod 644 .env
}

while true; do
  restore_env
  echo "[$(date)] Starting next dev with env restored..."
  set -a; source .env; set +a
  npx prisma generate >/dev/null 2>&1
  npx next dev -p 3000 2>&1
  echo "[$(date)] Server exited, restarting in 3s..."
  sleep 3
done
