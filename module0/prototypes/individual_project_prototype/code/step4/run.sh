#!/usr/bin/env bash
# Step 4: Sending Messages from Server (the server answers with a mock AI message)
#
# Usage:  ./run.sh
#         SERVER_PORT=5001 CLIENT_PORT=3001 ./run.sh      (change the ports)
set -e
cd "$(dirname "$0")"

SERVER_PORT="${SERVER_PORT:-5000}"
CLIENT_PORT="${CLIENT_PORT:-3000}"

for dir in server client; do
  if [ ! -d "$dir/node_modules" ]; then
    echo "[$dir] npm install ..."
    (cd "$dir" && npm install --no-audit --no-fund --loglevel=error)
  fi
done

SERVER_PID=""
cleanup() {
  if [ -n "$SERVER_PID" ]; then kill "$SERVER_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT INT TERM

echo "Server: http://localhost:$SERVER_PORT"
(cd server && PORT="$SERVER_PORT" exec node index.js) &
SERVER_PID=$!

echo "Client: http://localhost:$CLIENT_PORT"
cd client
PORT="$CLIENT_PORT" REACT_APP_SERVER_URL="http://localhost:$SERVER_PORT" npm start
