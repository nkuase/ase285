## Issue 1

smcho@mac nginx> /opt/homebrew/bin/nginx -s reload
nginx: [error] invalid PID number "" in "/opt/homebrew/var/run/nginx.pid"

### Solution

sudo rm /opt/homebrew/var/run/nginx.pid
nginx -t
nginx -s reload
