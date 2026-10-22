#!/usr/bin/env bash
# Run the Node.js test client (start the server first).
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Running npm install..."
  npm install
else
  echo "node_modules exists. Skipping npm install."
fi
node test-cli.js
