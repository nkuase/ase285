#!/usr/bin/env bash
# Step 1: Frontend UI (React)
#
# Usage:  ./run.sh              (CLIENT_PORT=3001 ./run.sh to change the port)
set -e
cd "$(dirname "$0")/client"

if [ ! -d node_modules ]; then
  echo "[client] npm install ..."
  npm install --no-audit --no-fund --loglevel=error
fi

echo "Client: http://localhost:${CLIENT_PORT:-3000}"
PORT="${CLIENT_PORT:-3000}" exec npm start
