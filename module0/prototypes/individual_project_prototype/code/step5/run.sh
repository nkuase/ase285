#!/usr/bin/env bash
# Step 5: Working with OpenAI (ChatGPT API)
#
# Usage:  ./run.sh
#         SERVER_PORT=5001 CLIENT_PORT=3001 ./run.sh      (change the ports)
#
# The OpenAI API key is read from server/.env (OPENAI_API_KEY=...).
set -e
cd "$(dirname "$0")"

SERVER_PORT="${SERVER_PORT:-5000}"
CLIENT_PORT="${CLIENT_PORT:-3000}"

# Create server/.env from the example when it is missing.
if [ ! -f server/.env ]; then
  cp server/.env.example server/.env
  echo "Created server/.env. Edit it and set OPENAI_API_KEY."
fi
if ! grep -Eq '^OPENAI_API_KEY=.+' server/.env || grep -q 'your_openai_api_key' server/.env; then
  echo "WARNING: OPENAI_API_KEY is not set in server/.env (ChatGPT answers will fail)."
fi

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
