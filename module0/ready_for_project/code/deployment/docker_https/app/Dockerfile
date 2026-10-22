# Dockerfile for Node.js Application
# The build context is the deployment/ directory (see docker-compose.yml)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files from the app directory
COPY app/package*.json ./

# Install dependencies (production only)
RUN npm ci --omit=dev

# Copy application code from the app directory
COPY app/ ./

# Expose port 3000
EXPOSE 3000

# Run as the non-root user of the image
USER node

# Start the application
CMD ["npm", "start"]
