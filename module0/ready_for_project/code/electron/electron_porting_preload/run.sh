#!/usr/bin/env bash
# Build the React app and run it in Electron.
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

npm start
