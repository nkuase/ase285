#!/usr/bin/env bash
# Start the Socket.IO server on port 5000 (set PORT to change it).
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  npm install
fi

node index.js
