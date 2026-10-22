#!/usr/bin/env bash
# Step 7: Standalone ChatGPT Clone (Electron + React + Vite, no Express server)
#
# Usage:
#   ./run.sh                 Electron, development mode (Vite dev server + Electron window)
#   ./run.sh prod            Electron, production mode (vite build + Electron window)
#   ./run.sh dist            Package the app with electron-builder (output: dist/)
#   ./run.sh browser         Vite dev server only: http://localhost:3000 (needs VITE_OPENAI_API_KEY,
#                            see .env.example)
#
# The OpenAI API key is read from .env (OPENAI_API_KEY=...).
set -e
cd "$(dirname "$0")"

MODE="${1:-dev}"

# Create .env from the example when it is missing.
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env. Edit it and set OPENAI_API_KEY."
fi
if ! grep -Eq '^OPENAI_API_KEY=.+' .env || grep -q 'your_openai_api_key' .env; then
  echo "WARNING: OPENAI_API_KEY is not set in .env (ChatGPT answers will fail)."
fi

if [ ! -d node_modules ]; then
  echo "npm install ..."
  npm install --no-audit --no-fund --loglevel=error
fi

case "$MODE" in
  dev)
    exec npm run electron-dev
    ;;
  prod)
    exec npm run electron-prod
    ;;
  dist)
    exec npm run dist
    ;;
  browser)
    echo "Open http://localhost:3000"
    exec npm run dev
    ;;
  *)
    echo "Unknown mode: $MODE (use: dev, prod, dist, browser)"
    exit 1
    ;;
esac
