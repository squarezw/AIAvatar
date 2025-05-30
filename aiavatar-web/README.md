# docker build
docker build --build-arg VITE_DOMAIN_SUFFIX=yourdomain.com -t squarezw/aiavatar-web:latest .

# docker build and push with multiple Arch
docker buildx build --build-arg VITE_DOMAIN_SUFFIX=yourdomain.com --platform linux/amd64,linux/arm64 -t squarezw/aiavatar-web:latest --push .