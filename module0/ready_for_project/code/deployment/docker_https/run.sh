#!/usr/bin/env bash
# Build and start the Node.js + NGINX (HTTPS) containers.
cd "$(dirname "$0")"

# Create the certificate and the key with mkcert if they do not exist
if [ ! -f nginx/certs/localhost+3.pem ]; then
  if ! command -v mkcert >/dev/null 2>&1; then
    echo "mkcert is not installed. On macOS: brew install mkcert nss"
    exit 1
  fi
  echo "Certificates not found. Creating them with mkcert..."
  mkcert -install
  mkdir -p nginx/certs
  (cd nginx/certs && mkcert localhost 127.0.0.1 ::1 myapp.local)
fi

# Newer Docker: "docker compose"; older installations: "docker-compose"
if docker compose version >/dev/null 2>&1; then COMPOSE="docker compose"; else COMPOSE="docker-compose"; fi

echo "Building and starting containers..."
$COMPOSE up -d --build

echo ""
echo "Containers started!"
echo "  HTTPS: https://localhost:8443"
echo "  HTTP:  http://localhost:8080 (redirects to HTTPS)"
echo ""
echo "View logs: $COMPOSE logs -f"
echo "Stop:      $COMPOSE down"
