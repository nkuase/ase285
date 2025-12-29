# Dockerfile for Node.js Application
# This creates a container image for your app

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY app/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY app/. ./

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
