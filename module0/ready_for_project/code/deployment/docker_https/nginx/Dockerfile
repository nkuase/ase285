FROM nginx:alpine
COPY nginx-https.conf /etc/nginx/conf.d/default.conf
COPY certs/ /etc/nginx/certs/

# Optional: tighten permissions of the private key
# RUN chmod 600 /etc/nginx/certs/*-key.pem && \
#     chmod 644 /etc/nginx/certs/*.pem

# Port 80 redirects to HTTPS, and port 443 serves HTTPS (inside the container)
EXPOSE 80 443
