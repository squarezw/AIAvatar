# docker build
docker build --build-arg VITE_DOMAIN_SUFFIX=yourdomain.com -t squarezw/aiavatar-web:latest .

# docker build and push with multiple Arch
docker buildx build --platform linux/amd64,linux/arm64 -t taito/aiavatar-web:latest --push .