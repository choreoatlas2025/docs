# ChoreoAtlas 服务器迁移计划

## 目标架构

### 服务器 #1 (Oracle Cloud - 140.238.86.4)
- **用途**: 商务网站专用
- **域名**: choreoatlas.com (计划) 
- **服务**: choreoatlas-website (Next.js)
- **端口**: 80 (简化配置)

### 服务器 #2 (Oracle Cloud - 新免费服务器)
- **用途**: 文档网站专用  
- **域名**: choreoatlas.io (中国用户) + GitHub Pages (海外用户)
- **服务**: choreoatlas-docs (Docusaurus + Docker)
- **端口**: 80 (简化配置)

## 迁移步骤

### 阶段1: 服务器#1清理 (当前服务器)

#### 1.1 停止并移除文档站容器
```bash
# 停止文档站容器
docker stop choreoatlas-docs
docker rm choreoatlas-docs
docker rmi choreoatlas/docs:latest

# 清理相关文件
rm -rf /home/ubuntu/deploy-docker.sh
```

#### 1.2 简化Nginx配置 (只保留商务网站)
```nginx
# /etc/nginx/sites-available/default
server {
    listen 80;
    server_name _;
    root /var/www/choreoatlas-website/out;
    index index.html;

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
}
```

#### 1.3 移除端口8080相关配置
- 删除 `/etc/nginx/sites-available/choreoatlas.io` 
- 只保留商务网站的配置

#### 1.4 验证商务网站独立运行
```bash
# 测试商务网站
curl -I http://localhost
npm run build  # 确保构建正常
```

### 阶段2: 服务器#2部署 (新服务器)

#### 2.1 服务器初始化
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# 安装Nginx
sudo apt install nginx -y
```

#### 2.2 部署文档站Docker容器
```bash
# 拉取镜像
docker pull choreoatlas/docs:latest

# 运行容器 (直接使用80端口)
docker run -d \
  --name choreoatlas-docs \
  --restart unless-stopped \
  -p 80:80 \
  choreoatlas/docs:latest
```

#### 2.3 配置Nginx反向代理 (可选)
如果需要额外的代理层，可以配置：
```nginx
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 阶段3: DNS和路由更新

#### 3.1 更新Cloudflare Worker
```javascript
// 修改 Oracle Cloud 目标地址
const ORACLE_CLOUD = 'http://NEW_SERVER_IP:80'  // 新服务器IP
```

#### 3.2 DNS记录更新 (如果需要)
- 保持 choreoatlas.io CNAME → choreoatlas2025.github.io
- Cloudflare Worker 负责智能路由

## 优势对比

### 迁移前 (混合部署)
```
Oracle Cloud #1:
├── 商务网站 (Next.js) :80
├── Nginx 反向代理
├── 文档站 (Docker) :8080
└── 资源竞争 + 配置复杂
```

### 迁移后 (功能分离)
```
Oracle Cloud #1:          Oracle Cloud #2:
├── 商务网站 :80          ├── 文档站 :80
└── 简化配置              └── 简化配置

Cloudflare Worker:
├── 中国用户 → Server #2
└── 海外用户 → GitHub Pages
```

## 风险控制

### 1. 渐进式迁移
- 先搭建服务器#2
- 验证文档站运行正常
- 再清理服务器#1

### 2. 回滚方案
- 保留当前Docker容器配置
- 如有问题可快速恢复

### 3. 验证清单
- [ ] 服务器#1商务网站独立运行
- [ ] 服务器#2文档站正常访问
- [ ] Cloudflare Worker路由正确
- [ ] 两个域名都能正常访问

## 成本优化
- 两个免费Oracle Cloud服务器
- 无额外费用
- 资源利用更合理
- 维护更简单

## 时间估算
- 阶段1 (清理): 30分钟
- 阶段2 (部署): 45分钟  
- 阶段3 (验证): 15分钟
- **总计**: ~1.5小时