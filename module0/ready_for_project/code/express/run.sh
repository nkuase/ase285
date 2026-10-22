#!/usr/bin/env bash
# Usage: ./run.sh [express|ejs|ajax|method_override]
#
# Each example is a separate server on port 5500, so run one at a time
# (stop it with Ctrl+C before starting another).
#
# Before running, create the .env file in this directory:
#   cp env .env      # then edit it with your MONGO_USER, MONGO_PASSWORD, MONGO_CLUSTER
cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  npm install
fi

case "${1:-method_override}" in
  express)         node index_express.js ;;
  ejs)             node index_ejs.js ;;
  ajax)            node index_js.js ;;
  method_override) node index_method_override.js ;;
  *)
    echo "Usage: $0 [express|ejs|ajax|method_override]"
    exit 1
    ;;
esac
