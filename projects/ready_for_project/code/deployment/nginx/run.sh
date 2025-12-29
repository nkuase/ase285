# For Mac
ls /opt/homebrew/etc/nginx
cp nginx.conf /opt/homebrew/etc/nginx
nginx -t -c /opt/homebrew/etc/nginx/nginx.conf
brew services start nginx

## Run app
# in the app directory
sh run.sh