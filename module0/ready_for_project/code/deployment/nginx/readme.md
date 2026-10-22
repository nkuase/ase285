# Nginx Notes

## Issue 1: invalid PID number

Reloading Nginx fails:

```bash
nginx -s reload
# nginx: [error] invalid PID number "" in "/opt/homebrew/var/run/nginx.pid"
```

### Solution

Remove the broken PID file, check the configuration, and reload:

```bash
sudo rm /opt/homebrew/var/run/nginx.pid
nginx -t
nginx -s reload
```
