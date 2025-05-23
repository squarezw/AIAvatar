# Heygem 桌面端不太适用，重新构建一个 Web 服务页面
- 放弃 fish-speech-ziming，语音效果不好
- 删除所有无用的文件，纯净 Web 相关服务，注意，仅 Web 服务
- shared_data 是为在上传文件，并在 docker 容器中共享文件用


# 如何使用
## 启动数字人后台服务
- docker compose up -d

## 启动后台服务
### 请参考 aiavatar-server 的 README

## 启动 web 应用
### build dist 文件
- cd aiavatar-web
- npm run build

### 配置 nginx conf
- 将 avatar.conf 放入 nginx 对应的 conf 目录下，通常在 /etc/nginx/conf.d/ 目录下
- 修该 avatar.conf 里的实际你的域名、 dist 文件所在路径、
- 修改 server.cjs 的 UPLOAD_DIR， 这里的 UPLOAD_DIR 需要与 avatar.conf upload 对应的目录匹配上