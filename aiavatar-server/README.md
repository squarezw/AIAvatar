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

## 启动方式
```bash
pip install -r requirements.txt
nohup python app.py > flask.log 2>&1 &
```

如果需要开启本地调试，先运行
```bash
export DEBUG=true
```

## 说明
- 上传目录：`/usr/share/nginx/html/face2face/temp`
- 日志文件：`/usr/share/nginx/html/face2face/log/dh.log` 