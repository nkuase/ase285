#!/usr/bin/env bash
# Before running:
#   1. Copy ../env to ../.env (one directory above this one).
#   2. Edit ../.env with your MONGO_USER, MONGO_PASSWORD, and MONGO_CLUSTER.
# The scripts read ../.env relative to this directory, so we run them from here.
cd "$(dirname "$0")"

npm install
node ping.js
node database.js
