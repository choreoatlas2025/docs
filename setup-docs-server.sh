#!/bin/bash
# ChoreoAtlas 文档站专用服务器部署脚本 (Oracle Cloud #2)

set -e

echo "🚀 开始部署 ChoreoAtlas 文档站专用服务器..."

# 更新系统
echo "📦 更新系统包..."
sudo apt update && sudo apt upgrade -y

# 安装Docker
echo "🐳 安装Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    rm get-docker.sh
    echo "Docker 安装完成，请重新登录以使用Docker"
else
    echo "Docker 已安装"
fi

# 安装Nginx (备用)
echo "⚙️ 安装Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
else
    echo "Nginx 已安装"
fi

# 配置防火墙
echo "🔥 配置防火墙..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable

# 拉取并运行文档站
echo "📚 部署文档站..."
docker pull choreoatlas/docs:latest

# 停止可能存在的旧容器
docker stop choreoatlas-docs 2>/dev/null || true
docker rm choreoatlas-docs 2>/dev/null || true

# 运行新容器 (直接使用80端口)
docker run -d \
  --name choreoatlas-docs \
  --restart unless-stopped \
  -p 80:80 \
  choreoatlas/docs:latest

echo "⏳ 等待容器启动..."
sleep 10

# 检查服务状态
echo "✅ 检查服务状态..."
if docker ps | grep -q choreoatlas-docs; then
    echo "🎉 文档站部署成功！"
    echo "📍 本地访问: http://localhost"
    echo "📍 公网访问: http://$(curl -s ifconfig.me)"
    docker ps | grep choreoatlas-docs
else
    echo "❌ 部署失败！"
    docker logs choreoatlas-docs
    exit 1
fi

# 测试HTTP响应
echo "🔍 测试HTTP响应..."
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ HTTP服务正常"
else
    echo "⚠️  HTTP服务异常，请检查"
fi

# 创建更新脚本
echo "📝 创建更新脚本..."
cat > /home/ubuntu/update-docs.sh << 'EOF'
#!/bin/bash
# 更新文档站脚本

echo "🔄 更新文档站..."
docker pull choreoatlas/docs:latest
docker stop choreoatlas-docs
docker rm choreoatlas-docs
docker run -d \
  --name choreoatlas-docs \
  --restart unless-stopped \
  -p 80:80 \
  choreoatlas/docs:latest

echo "✅ 更新完成！"
docker ps | grep choreoatlas-docs
EOF

chmod +x /home/ubuntu/update-docs.sh

echo "🌟 部署完成！"
echo ""
echo "管理命令："
echo "  查看状态: docker ps"
echo "  查看日志: docker logs choreoatlas-docs"
echo "  更新文档: ~/update-docs.sh"
echo "  重启容器: docker restart choreoatlas-docs"
echo ""
echo "🔗 访问地址: http://$(curl -s ifconfig.me)"