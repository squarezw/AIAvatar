# syntax=docker/dockerfile:1
FROM python:3.10-slim

# 设置工作目录
WORKDIR /app

# 复制代码
COPY . /app

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 创建上传和日志目录（与 config.py 保持一致）
RUN mkdir -p ../shared_data/face2face/temp \
    && mkdir -p ../shared_data/face2face/log

# 设置环境变量（可在 docker run 时覆盖）
ENV MINIMAX_GROUP_ID=your_group_id
ENV MINIMAX_API_KEY=your_api_key
ENV DEBUG=false

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["python", "app.py"] 