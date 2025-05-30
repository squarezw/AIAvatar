# aiavatar-server

基于 Flask 的文件存储与管理服务。

## 功能
- 文件上传（/upload）
- 文件列表（/files）
- 文件删除（/delete）
- 日志查询（/log）

## 目录结构
- app.py         # 主应用入口
- config.py      # 配置项
- utils.py       # 工具函数
- requirements.txt # 依赖

## Docker Image Build
docker buildx build --platform linux/amd64,linux/arm64 \
  -t squarezw/aiavatar-server:latest \
  --push .

## 修改你的 MINIMAX_GROUP_ID 与 MINIMAX_API_KEY
### 在 docker-compose.server.yml 里修改这两个值
### 如果你没有用 docker，请在环境变量中设置它们
- export MINIMAX_GROUP_ID=group_id
- export MINIMAX_API_KEY=api_key