# Heygem 桌面端不太适用，重新构建一个 Web 服务页面
- 放弃 fish-speech-ziming，语音效果不好
- 删除所有无用的文件，纯净 Web 相关服务，注意，仅 Web 服务
- shared_data 是为在上传文件，并在 docker 容器中共享文件用


# 如何使用
## 启动数字人后台服务
- docker compose up -d

## 后台服务配置
### 请参考 aiavatar-server 的 README

## 启动 web 应用
### build dist 文件
- cd aiavatar-web
- npm run build

## 配置 aiavatar-service
修改 app_local.py 的 yourdomain.com 为你真实的域名

### 配置 nginx conf
- 修改 avatar.conf 里的域名、 dist 文件所在路径
- 添加 avatar.conf 到 nginx 对应的 conf 目录下


### 在需要 CORS Domain 访问服务的场景时
- 先启动容器，然后进入容器中，安装 flask_cors, `pip install flask_cors`
- 然后在 app_local.py 中将 CORS 相关的注释去掉
- 重启动容器 docker compose restart heygem-gen-video
* 你也可以，重新 build 一个支持 CORS 的 docker image, dockerfile 在根目录下 *