# Docker Deployment

## What This Does

Packages the application stack into two containers:

```txt
┌─────────────────────────────────────┐
│          Docker Host                │
│                                     │
│  ┌──────────┐      ┌───────────┐    │
│  │  NGINX   │ ───▶ │ Node.js   │    │
│  │ (:8080)  │      │ App :3000 │    │
│  └──────────┘      └───────────┘    │
│                                     │
└─────────────────────────────────────┘
```

## Why Docker?

- **Consistency**: works the same everywhere
- **Isolation**: each service runs in its own container
- **Easy setup**: one command starts everything
- **Portability**: deploy anywhere Docker runs

## Prerequisites

Install Docker:

- **macOS/Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: install Docker Engine and the Docker Compose plugin

Verify the installation:

```bash
docker --version
docker compose version
```

Newer Docker versions use `docker compose` (with a space). Older installations use `docker-compose`; the commands below work with both.

## File Structure

```txt
docker/
├── app/
│   └── Dockerfile          # how to build the Node.js app image
├── nginx/
│   ├── Dockerfile          # how to build the NGINX image
│   └── nginx.conf          # NGINX configuration for Docker
├── docker-compose.yml      # orchestrates the containers
├── run.sh                  # builds and starts everything
└── README.md               # this file
```

The Node.js app itself is in `../app`. The build context of the app image is the parent directory (`deployment/`), and its `.dockerignore` is `../.dockerignore`.

## Quick Start

### Start Everything

```bash
# Build the images and start the containers in the background
docker compose up -d --build      # or: ./run.sh

# View the logs
docker compose logs -f

# Test
curl http://localhost:8080
```

### Stop Everything

```bash
docker compose down
```

## What Happens?

1. **Build phase**
   - Docker reads `app/Dockerfile` and creates the Node.js app image.
   - Docker reads `nginx/Dockerfile` and creates the NGINX image (with our `nginx.conf`).

2. **Run phase**
   - Starts the Node.js container (`app`, port 3000, internal only).
   - Starts the NGINX container (host port 8080 → container port 80).
   - Creates a network between them.

3. **Request flow**

   ```txt
   Browser → NGINX container (8080 → 80) → App container (3000) → Response
   ```

## Understanding docker-compose.yml

```yaml
services:
  app:                                # Node.js service
    build:
      context: ..                     # build context: the deployment/ directory
      dockerfile: docker/app/Dockerfile
    expose:
      - "3000"                        # internal port only
  nginx:                              # NGINX service
    build:
      context: ./nginx
    ports:
      - "8080:80"                     # host port 8080 → container port 80
    depends_on:
      - app                           # start the app first
```

## Understanding app/Dockerfile

```dockerfile
FROM node:22-alpine                   # base image
WORKDIR /app                          # working directory
COPY app/package*.json ./             # copy the dependency files
RUN npm ci --omit=dev                 # install the production packages
COPY app/ ./                          # copy the app code
EXPOSE 3000                           # document the port
USER node                             # do not run as root
CMD ["npm", "start"]                  # start command
```

## Useful Commands

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f app      # app logs only
docker compose logs -f nginx    # NGINX logs only

# Check status
docker compose ps

# Restart services
docker compose restart

# Rebuild after code changes
docker compose up -d --build

# Stop services
docker compose down

# Remove everything (including volumes)
docker compose down -v
```

## Key Docker Concepts

- **Image**: a blueprint (like a class). **Container**: a running instance (like an object).
- **Networking**: containers talk to each other by service name (`app:3000`, not `localhost:3000`).
- **Layers**: Docker caches each build step and rebuilds only the changed layers.

## View Inside a Container

```bash
docker exec -it nodejs_app sh
ls -la
exit
```

## Troubleshooting

**"Port already in use"**

```bash
docker compose down
# or change the host port in docker-compose.yml, for example "9090:80"
```

**"Container keeps restarting"**

```bash
docker compose logs app
# Common causes: missing dependencies, a wrong start command, or a crash on startup
```

**"Cannot connect to the containers"**

```bash
docker compose ps
docker network inspect docker_app-network
```

**Changes are not reflected**

```bash
docker compose build --no-cache
docker compose up -d
```

## Production Considerations

This setup is for **learning**. For production, also consider:

1. **Security**: HTTPS (see `../docker_https`), secrets for sensitive data, a non-root user.
2. **Performance**: multi-stage builds (smaller images), health checks, resource limits.
3. **Monitoring**: log aggregation, metrics, alerting.

## Compare: Local vs Docker

| Aspect | Local setup | Docker setup |
|--------|-------------|--------------|
| Setup | Install Node and NGINX | Install Docker only |
| Dependencies | System-wide | Isolated per container |
| Consistency | "Works on my machine" | Works everywhere |
| Cleanup | Manual uninstall | `docker compose down` |

## Learning Exercises

1. **Change the port**: map NGINX to host port 9090.
2. **Add an environment variable**: pass it to the app container.
3. **Multiple instances**: run two app containers behind NGINX.
4. **Add a database**: add a MongoDB service.
5. **Health check**: add a container health check.

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
- [Play with Docker](https://labs.play-with-docker.com/)
