brew install mkcert nss        # macOS (add nss for Firefox)
mkcert -install
mkcert localhost 127.0.0.1 ::1 myapp.local