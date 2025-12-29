# Dockerfile for Node.js Application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files from app directory
COPY app/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code from app directory
COPY app/ ./

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
