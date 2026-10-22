#!/usr/bin/env bash
# Install the packages once, then create the database and the posts table.
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  npm install
fi

node index.js init
