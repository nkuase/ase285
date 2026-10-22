#!/usr/bin/env bash
# Step 6: Deployment (Web application & Electron)
#
# Usage:
#   ./run.sh                 Web application: build the React client (../step5/client) and
#                            serve it with the Express server -> http://localhost:5000
#   ./run.sh electron        Electron, development mode (Express server + Vite + Electron window)
#   ./run.sh electron-prod   Electron, production mode (vite build + Electron window)
#   ./run.sh dist            Package the Electron app with electron-builder (output: electron/dist)
#
# Environment:
#   SERVER_PORT=5001 ./run.sh      change the server port (default 5000)
#   REBUILD=1 ./run.sh             rebuild the React client even if a build already exists
#
# The OpenAI API key is read from server/.env (OPENAI_API_KEY=...).
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
SERVER_PORT="${SERVER_PORT:-5000}"
SERVER_URL="http://localhost:$SERVER_PORT"
MODE="${1:-web}"

install_dir() {
  if [ ! -d "$1/node_modules" ]; then
    echo "[$(basename "$1")] npm install ..."
    (cd "$1" && npm install --no-audit --no-fund --loglevel=error)
  fi
}

ensure_env() {
  if [ ! -f "$ROOT/server/.env" ]; then
    cp "$ROOT/server/.env.example" "$ROOT/server/.env"
    echo "Created server/.env. Edit it and set OPENAI_API_KEY."
  fi
  if ! grep -Eq '^OPENAI_API_KEY=.+' "$ROOT/server/.env" || grep -q 'your_openai_api_key' "$ROOT/server/.env"; then
    echo "WARNING: OPENAI_API_KEY is not set in server/.env (ChatGPT answers will fail)."
  fi
}

SERVER_PID=""
cleanup() {
  if [ -n "$SERVER_PID" ]; then kill "$SERVER_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT INT TERM

start_server_in_background() {
  ensure_env
  install_dir "$ROOT/server"
  echo "Server: $SERVER_URL"
  (cd "$ROOT/server" && PORT="$SERVER_PORT" exec node index.js) &
  SERVER_PID=$!
}

case "$MODE" in
  web)
    # 1. Compile the React app (step 5 client) into static files: client/build
    CLIENT="$ROOT/../step5/client"
    install_dir "$CLIENT"
    if [ ! -f "$CLIENT/build/index.html" ] || [ "${REBUILD:-0}" = "1" ]; then
      echo "[step5/client] npm run build ..."
      (cd "$CLIENT" && REACT_APP_SERVER_URL="$SERVER_URL" npm run build)
    fi

    # 2. Serve the build with the Express server
    ensure_env
    install_dir "$ROOT/server"
    echo "Web application: $SERVER_URL"
    cd "$ROOT/server"
    PORT="$SERVER_PORT" node index.js
    ;;

  electron)
    install_dir "$ROOT/electron"
    start_server_in_background
    cd "$ROOT/electron"
    VITE_SERVER_URL="$SERVER_URL" npm run electron-dev
    ;;

  electron-prod)
    install_dir "$ROOT/electron"
    start_server_in_background
    cd "$ROOT/electron"
    VITE_SERVER_URL="$SERVER_URL" npm run electron-prod
    ;;

  dist)
    install_dir "$ROOT/electron"
    cd "$ROOT/electron"
    VITE_SERVER_URL="$SERVER_URL" npm run dist
    ;;

  *)
    echo "Unknown mode: $MODE (use: web, electron, electron-prod, dist)"
    exit 1
    ;;
esac
