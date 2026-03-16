# Build the Docker image
docker build -t susie-app .

# Run the container
docker run -p 3000:3000 susie-app