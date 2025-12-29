# Docker Deployment

## What This Does

Packages your entire application stack into containers:

```
┌─────────────────────────────────────┐
│          Docker Host                │
│                                     │
│  ┌──────────┐      ┌───────────┐  │
│  │  NGINX   │ ───▶ │ Node.js   │  │
│  │ (port 80)│      │ App       │  │
│  └──────────┘      └───────────┘  │
│                                     │
└─────────────────────────────────────┘
```

## Why Docker?

- **Consistency**: Works the same everywhere
- **Isolation**: Each service in its own container
- **Easy Setup**: One command starts everything
- **Portability**: Deploy anywhere Docker runs

## Prerequisites

Install Docker:
- **macOS/Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: `sudo apt install docker.io docker-compose`

Verify installation:
```bash
docker --version
docker-compose --version
```

## Quick Start

### Start Everything

```bash
# Start containers in background
docker-compose up -d

# View logs
docker-compose logs -f

# Test
curl http://localhost
```

### Stop Everything

```bash
docker-compose down
```

That's it! 🎉

## What Happens?

1. **Build Phase**:
   - Docker reads `Dockerfile`
   - Creates Node.js app image
   - Downloads NGINX image

2. **Run Phase**:
   - Starts Node.js container (app:3000)
   - Starts NGINX container (port 80)
   - Creates network between them

3. **Request Flow**:
   ```
   Browser → NGINX container → App container → Response
   ```

## Useful Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app    # App logs only
docker-compose logs -f nginx  # NGINX logs only

# Check status
docker-compose ps

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

## File Structure

```
docker/
├── Dockerfile           # How to build app image
├── docker-compose.yml   # Orchestrates containers
├── nginx.conf           # NGINX config for Docker
└── README.md           # This file
```

## Understanding docker-compose.yml

```yaml
services:
  app:                    # Node.js service
    build: ../app         # Build from app directory
    expose: ["3000"]      # Internal port only
    
  nginx:                  # NGINX service
    image: nginx:alpine   # Use official image
    ports: ["80:80"]      # Expose to host
    depends_on: [app]     # Wait for app
```

## Understanding Dockerfile

```dockerfile
FROM node:18-alpine      # Base image
WORKDIR /app             # Working directory
COPY package*.json ./    # Copy dependencies
RUN npm ci               # Install packages
COPY . .                 # Copy app code
EXPOSE 3000              # Document port
CMD ["npm", "start"]     # Start command
```

## Key Docker Concepts

### Container vs Image
- **Image**: Blueprint (like a class)
- **Container**: Running instance (like an object)

### Networking
- Containers can talk to each other by service name
- `app:3000` instead of `localhost:3000`

### Volumes
- Persist data outside containers
- Share files between host and container

### Layers
- Docker caches each step
- Only rebuilds changed layers
- Faster subsequent builds

## Modify the App

After changing code in `../app/`:

```bash
# Rebuild and restart
docker-compose up -d --build

# Or
docker-compose down
docker-compose up -d --build
```

## View Inside Container

```bash
# Execute command in running container
docker exec -it nodejs_app sh

# Now you're inside the container!
ls -la
exit
```

## Troubleshooting

**"Port already in use"**
```bash
# Stop containers using the port
docker-compose down

# Or change port in docker-compose.yml
ports: ["8080:80"]  # Use 8080 instead
```

**"Container keeps restarting"**
```bash
# Check logs
docker-compose logs app

# Common issues:
# - Missing dependencies in app
# - Wrong start command
# - App crashes on startup
```

**"Cannot connect to containers"**
```bash
# Verify containers are running
docker-compose ps

# Check network
docker network ls
docker network inspect docker_app-network
```

**Changes not reflected**
```bash
# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

## Production Considerations

This setup is for **learning**. For production:

1. **Security**:
   - Add HTTPS (mount SSL certificates)
   - Use secrets for sensitive data
   - Run as non-root user

2. **Performance**:
   - Multi-stage builds (smaller images)
   - Health checks
   - Resource limits

3. **Monitoring**:
   - Log aggregation
   - Metrics collection
   - Alerting

## Compare: Local vs Docker

| Aspect | Local Setup | Docker Setup |
|--------|-------------|--------------|
| Setup | Install Node, NGINX | Install Docker only |
| Dependencies | System-wide | Isolated per container |
| Consistency | "Works on my machine" | Works everywhere |
| Cleanup | Manual uninstall | `docker-compose down` |
| Scaling | Manual | Easy replication |

## Learning Exercises

1. **Modify Port**: Change NGINX to port 8080
2. **Add Environment Variable**: Pass to app container
3. **Multiple Instances**: Run 2 app containers
4. **Add Database**: Add PostgreSQL service
5. **Health Check**: Add container health checks

## Next Steps

- Learn Docker volumes for data persistence
- Explore Docker networks in depth
- Study multi-stage builds
- Deploy to cloud (AWS, GCP, Azure)
- Orchestration with Kubernetes

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
- [Play with Docker](https://labs.play-with-docker.com/)
