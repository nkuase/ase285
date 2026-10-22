#!/usr/bin/env bash
# Install the Nginx configuration (macOS, Homebrew) and restart Nginx.
# Run this script from this directory (code/deployment/nginx).
#
# Apple silicon: /opt/homebrew/etc/nginx (default)
# Intel Mac:     CONFIG_DIRECTORY=/usr/local/etc/nginx ./run.sh
CONFIG_DIRECTORY="${CONFIG_DIRECTORY:-/opt/homebrew/etc/nginx}"
cd "$(dirname "$0")"

ls "$CONFIG_DIRECTORY"

# Make a backup copy of the default nginx.conf (only once)
[ -f "$CONFIG_DIRECTORY/nginx.conf.backup" ] || cp "$CONFIG_DIRECTORY/nginx.conf" "$CONFIG_DIRECTORY/nginx.conf.backup"

# nginx.conf includes servers/*, so the app configuration goes into servers/
mkdir -p "$CONFIG_DIRECTORY/servers"
cp nginx.conf "$CONFIG_DIRECTORY/nginx.conf"
cp nodejs-app.conf "$CONFIG_DIRECTORY/servers/"

# Check the syntax, then (re)start Nginx
nginx -t -c "$CONFIG_DIRECTORY/nginx.conf"
brew services restart nginx

# Run the Node.js app (port 3000) in another terminal:
#   cd ../app && sh run.sh
# Then test:
#   curl -i http://localhost:8080/
