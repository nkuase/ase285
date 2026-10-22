#!/usr/bin/env bash
# Step 4: Todo App with SQLite (no configuration needed)
#
# Usage:  ./run.sh              (use PORT=5600 ./run.sh to change the port)
set -e
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  npm install
fi

echo "Step 4 Web UI:   http://localhost:${PORT:-5500}/"
echo "Step 4 REST API: http://localhost:${PORT:-5500}/api/posts"
echo "Database file:   $(pwd)/todoapp.sqlite (created automatically)"
exec npm start
