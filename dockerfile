FROM guiji2025/heygem.ai
RUN pip install flask_cors

# TODO:
#   docker build -t guiji2025/heygem.ai:with-cors .
#   Update docker-compose.yml
#       image: guiji2025/heygem.ai:with-cors
