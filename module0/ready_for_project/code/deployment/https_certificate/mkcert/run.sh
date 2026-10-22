#!/usr/bin/env bash
# Create a locally trusted certificate with mkcert and run the HTTPS example.

# macOS: install mkcert (nss is needed for Firefox) and the local CA (one-time)
brew install mkcert nss
mkcert -install

# Create the certificate and the key in dev-https/certs
cd "$(dirname "$0")/nodejs/dev-https"
mkdir -p certs
(cd certs && mkcert localhost 127.0.0.1 ::1 myapp.local)
# This creates certs/localhost+3.pem and certs/localhost+3-key.pem

# Run the HTTPS server: https://localhost:8443
npm install
node index.js
