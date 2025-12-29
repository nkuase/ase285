# Create mkcert
# brew install mkcert nss   
# mkcert -install
# mkcert localhost 127.0.0.1 ::1 myapp.local

# Build and start containers
echo "Building and starting containers..."
docker-compose up -d --build

echo ""
echo "✓ Containers started!"
echo "  HTTPS: https://localhost:8443"
echo "  HTTP:  http://localhost:8080 (redirects to HTTPS)"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop:      docker-compose down"
