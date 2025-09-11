#!/bin/bash
# 配置商务网站服务器 (Oracle Cloud #1 - 140.238.86.4)

set -e

echo "🏢 配置商务网站专用服务器..."

# 停止任何正在运行的构建进程
echo "⏹️  停止构建进程..."
sudo pkill -f 'next build' 2>/dev/null || true
sudo pkill -f 'npm run' 2>/dev/null || true

# 清理构建目录
echo "🧹 清理构建目录..."
cd /var/www/choreoatlas-website
rm -rf out/ .next/ node_modules/.cache/ 2>/dev/null || true

# 简化Nginx配置为静态文件服务
echo "⚙️ 配置Nginx..."
sudo tee /etc/nginx/sites-available/default > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/choreoatlas-website/out;
    index index.html index.htm;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
    
    # 缓存静态资源
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy strict-origin-when-cross-origin;
    
    # 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
EOF

# 测试Nginx配置
echo "🔍 测试Nginx配置..."
sudo nginx -t

# 重载Nginx
echo "🔄 重载Nginx..."
sudo systemctl reload nginx

# 设置目录权限
echo "📁 设置目录权限..."
sudo chown -R www-data:www-data /var/www/choreoatlas-website
sudo chmod -R 755 /var/www/choreoatlas-website

# 创建健康检查脚本
echo "📊 创建监控脚本..."
cat > /home/ubuntu/check-website.sh << 'EOF'
#!/bin/bash
# 商务网站健康检查

echo "=== 商务网站状态检查 ==="
echo "时间: $(date)"
echo ""

echo "📁 网站目录:"
ls -la /var/www/choreoatlas-website/out/ 2>/dev/null | head -5 || echo "out目录不存在"
echo ""

echo "🌐 Nginx状态:"
sudo systemctl is-active nginx

echo "🔍 HTTP服务测试:"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")
echo "状态码: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ 网站服务正常"
else
    echo "❌ 网站服务异常"
fi

echo ""
echo "💾 系统资源:"
echo "内存: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "磁盘: $(df -h /var/www | tail -1 | awk '{print $3"/"$2" ("$5")"}')"
EOF

chmod +x /home/ubuntu/check-website.sh

echo ""
echo "✅ 商务网站服务器配置完成！"
echo ""
echo "📊 当前状态:"
echo "  Nginx: $(sudo systemctl is-active nginx)"
echo "  配置: 静态文件服务 (/var/www/choreoatlas-website/out/)"
echo ""
echo "🛠️  管理命令:"
echo "  检查状态: ~/check-website.sh"
echo "  查看日志: sudo tail -f /var/log/nginx/access.log"
echo "  重载配置: sudo systemctl reload nginx"
echo ""
echo "📝 下一步:"
echo "1. 在GitHub仓库添加Secrets:"
echo "   - SERVER_HOST: 140.238.86.4"
echo "   - SERVER_USER: ubuntu"  
echo "   - SERVER_SSH_KEY: (SSH私钥内容)"
echo "2. 添加.github/workflows/deploy.yml文件"
echo "3. 推送代码触发自动部署"