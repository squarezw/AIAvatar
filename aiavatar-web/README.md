# docker build
docker build -t taito/aiavatar-web:latest .

# docker build and push with multiple Arch
docker buildx build --platform linux/amd64,linux/arm64 -t taito/aiavatar-web:latest --push .