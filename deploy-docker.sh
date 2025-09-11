#!/bin/bash
# ChoreoAtlas 文档站 Docker 部署脚本

set -e

echo "🐳 开始部署 ChoreoAtlas 文档站..."

# 配置变量
CONTAINER_NAME="choreoatlas-docs"
IMAGE_NAME="choreoatlas2025/docs:latest"
PORT=8080

# 停止并删除旧容器
echo "⏹️  停止旧容器..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# 拉取最新镜像
echo "📥 拉取最新镜像..."
docker pull $IMAGE_NAME

# 运行新容器
echo "🚀 启动新容器..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:80 \
  $IMAGE_NAME

# 检查容器状态
echo "✅ 检查容器状态..."
sleep 5
if docker ps | grep -q $CONTAINER_NAME; then
  echo "🎉 部署成功！"
  echo "📍 访问地址: http://localhost:$PORT"
  docker ps | grep $CONTAINER_NAME
else
  echo "❌ 部署失败！"
  docker logs $CONTAINER_NAME
  exit 1
fi

# 更新 nginx 反向代理配置
echo "🔄 更新 Nginx 配置..."
sudo tee /etc/nginx/sites-available/choreoatlas.io > /dev/null <<EOF
server {
    listen 80;
    server_name choreoatlas.io www.choreoatlas.io;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name choreoatlas.io www.choreoatlas.io;
    
    ssl_certificate /etc/ssl/certs/choreoatlas.io.crt;
    ssl_certificate_key /etc/ssl/private/choreoatlas.io.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy strict-origin-when-cross-origin;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
EOF

# 重新加载 nginx
sudo nginx -t && sudo systemctl reload nginx

echo "🌍 ChoreoAtlas 文档站部署完成！"
echo "🔗 访问: https://choreoatlas.io"