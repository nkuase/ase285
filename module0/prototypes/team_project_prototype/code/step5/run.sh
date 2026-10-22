#!/usr/bin/env bash
# Step 5: Database abstraction layer (ORDB)
# The database is chosen by DB_TYPE in .env (sqlite or mongodb).
#
# Usage:  ./run.sh              (use PORT=5600 ./run.sh to change the port)
set -e
cd "$(dirname "$0")"

# This step reads its own .env in this directory
if [ ! -f .env ]; then
  echo "Missing .env (copy .env.example to .env and set DB_TYPE=sqlite or mongodb)."
  exit 1
fi

if [ ! -d node_modules ]; then
  npm install
fi

echo "Step 5 Web UI:   http://localhost:${PORT:-5500}/"
echo "Step 5 REST API: http://localhost:${PORT:-5500}/api/posts"
exec npm start
