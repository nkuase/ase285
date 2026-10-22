#!/usr/bin/env bash
# Build and start the Node.js + NGINX containers.
cd "$(dirname "$0")"

docker --version

# Newer Docker: "docker compose"; older installations: "docker-compose"
if docker compose version >/dev/null 2>&1; then COMPOSE="docker compose"; else COMPOSE="docker-compose"; fi

$COMPOSE up -d --build

echo ""
echo "Containers started! Open http://localhost:8080"
echo "View logs: $COMPOSE logs -f"
echo "Stop:      $COMPOSE down"
