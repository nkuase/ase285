# Start from a base image with Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy application code
COPY hello.js .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "hello.js"]