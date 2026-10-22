#!/usr/bin/env bash
# Step 1: Simplistic Todo App (native MongoDB driver)
#
# Usage:  ./run.sh              (use PORT=5600 ./run.sh to change the port)
set -e
cd "$(dirname "$0")"

# This step reads ../.env (code/.env)
if [ ! -f ../.env ]; then
  echo "Missing ../.env (copy ../.env.example to ../.env and fill it in)."
  exit 1
fi

if [ ! -d node_modules ]; then
  npm install
fi

echo "Step 1 running at http://localhost:${PORT:-5500}"
exec npm start
