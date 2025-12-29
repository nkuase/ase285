FROM nginx:alpine
COPY nginx-https.conf /etc/nginx/conf.d/default.conf
COPY certs/ /etc/nginx/certs/

# Optional: tighten perms (nginx runs as root in official image; these are still good hygiene)
# RUN chmod 600 /etc/nginx/certs/*-key.pem && \
#     chmod 644 /etc/nginx/certs/*.pem

# If your server block listens on 8443 inside the container:
EXPOSE 80 443
