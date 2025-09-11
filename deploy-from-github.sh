#!/bin/bash
# ChoreoAtlas 文档站 - 从GitHub直接部署到新服务器

set -e

echo "🚀 开始从GitHub部署 ChoreoAtlas 文档站..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "📦 安装Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    rm get-docker.sh
    echo "⚠️  Docker已安装，请重新登录后再次运行此脚本"
    exit 0
else
    echo "✅ Docker已安装"
fi

# 配置防火墙
echo "🔥 配置防火墙..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable

# 停止并移除旧容器
echo "🧹 清理旧容器..."
docker stop choreoatlas-docs 2>/dev/null || true
docker rm choreoatlas-docs 2>/dev/null || true

# 拉取最新镜像
echo "📥 拉取最新Docker镜像..."
docker pull choreoatlas/docs:latest

# 运行新容器 (直接使用80端口)
echo "🚀 启动文档站容器..."
docker run -d \
  --name choreoatlas-docs \
  --restart unless-stopped \
  -p 80:80 \
  choreoatlas/docs:latest

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "✅ 检查服务状态..."
if docker ps | grep -q choreoatlas-docs; then
    echo "🎉 文档站部署成功！"
    echo "📍 本地访问: http://localhost"
    echo "📍 公网访问: http://$(curl -s ifconfig.me)"
    echo ""
    echo "容器状态:"
    docker ps | grep choreoatlas-docs
else
    echo "❌ 部署失败！查看容器日志:"
    docker logs choreoatlas-docs
    exit 1
fi

# 测试HTTP响应
echo ""
echo "🔍 测试HTTP响应..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ HTTP服务正常 (状态码: $HTTP_STATUS)"
else
    echo "⚠️  HTTP服务异常 (状态码: $HTTP_STATUS)"
fi

# 创建更新脚本
echo ""
echo "📝 创建更新脚本..."
cat > /home/ubuntu/update-docs.sh << 'EOF'
#!/bin/bash
# 更新文档站脚本

echo "🔄 更新文档站..."

# 拉取最新镜像
docker pull choreoatlas/docs:latest

# 停止并移除旧容器
docker stop choreoatlas-docs
docker rm choreoatlas-docs

# 运行新容器
docker run -d \
  --name choreoatlas-docs \
  --restart unless-stopped \
  -p 80:80 \
  choreoatlas/docs:latest

echo "✅ 更新完成！"
docker ps | grep choreoatlas-docs
EOF

chmod +x /home/ubuntu/update-docs.sh

# 创建监控脚本
echo "📊 创建监控脚本..."
cat > /home/ubuntu/monitor-docs.sh << 'EOF'
#!/bin/bash
# 文档站监控脚本

echo "=== ChoreoAtlas 文档站状态 ==="
echo "时间: $(date)"
echo ""

echo "📦 容器状态:"
docker ps | grep choreoatlas-docs || echo "容器未运行"
echo ""

echo "🌐 HTTP服务状态:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
echo "状态码: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ 服务正常"
else
    echo "❌ 服务异常"
fi
echo ""

echo "💾 系统资源:"
echo "内存使用: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "磁盘使用: $(df -h / | tail -1 | awk '{print $3"/"$2" ("$5")"}')"
echo ""

echo "📋 最近容器日志 (最后10行):"
docker logs --tail 10 choreoatlas-docs 2>/dev/null || echo "无法获取日志"
EOF

chmod +x /home/ubuntu/monitor-docs.sh

echo ""
echo "🌟 部署完成！"
echo ""
echo "📊 服务信息:"
echo "  公网IP: $(curl -s ifconfig.me)"
echo "  访问地址: http://$(curl -s ifconfig.me)"
echo ""
echo "🛠️  管理命令:"
echo "  查看状态: ~/monitor-docs.sh"
echo "  更新文档: ~/update-docs.sh"
echo "  查看日志: docker logs choreoatlas-docs"
echo "  重启容器: docker restart choreoatlas-docs"
echo ""
echo "🔗 下一步: 更新Cloudflare Worker指向此服务器 ($(curl -s ifconfig.me))"