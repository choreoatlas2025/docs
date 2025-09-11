# 域名和SSL证书配置指南

## 当前问题分析

### 1. 域名状态
- **choreoatlas.io**: CNAME → choreoatlas2025.github.io (但GitHub Pages返回404)
- **SSL证书**: 不匹配，因为指向GitHub Pages但页面不存在

### 2. 架构目标
```
用户访问 choreoatlas.io
    ↓
Cloudflare Worker (智能路由)
    ↓
├─ 中国用户 → Oracle Cloud #2 (144.21.49.157:80) - 文档站
└─ 海外用户 → GitHub Pages (choreoatlas2025.github.io) - 文档站
```

## 解决方案

### 方案A: 修复GitHub Pages + Cloudflare Worker
推荐方案，保持双地域架构

#### 步骤1: 修复GitHub Pages 404
```bash
# 检查GitHub Pages设置
# 确保仓库有正确的静态文件
# 可能需要重新启用GitHub Pages
```

#### 步骤2: 部署Cloudflare Worker
1. 在Cloudflare Dashboard创建Worker
2. 使用 `cloudflare-worker.js` 的代码
3. 配置路由: `choreoatlas.io/*`
4. 确保DNS代理状态为"Proxied"

#### 步骤3: 验证路由
```bash
# 测试中国路由
curl -H "CF-IPCountry: CN" -I https://choreoatlas.io

# 测试海外路由  
curl -H "CF-IPCountry: US" -I https://choreoatlas.io
```

### 方案B: 简化为单服务器 + Cloudflare SSL
如果GitHub Pages问题难以解决

#### DNS配置
```
Type: A
Name: choreoatlas.io
Value: 144.21.49.157
Proxy: 🧡 Proxied (开启)
```

#### SSL配置
- Cloudflare自动提供SSL证书
- 强制HTTPS重定向
- 源服务器HTTP即可

### 方案C: 分离域名
为商务网站和文档站使用不同域名

```
choreoatlas.com → 商务网站 (140.238.86.4)
choreoatlas.io  → 文档网站 (双地域路由)
```

## 推荐执行顺序

### 1. 立即解决SSL问题
```bash
# 方案B: 简化DNS配置
# 在Cloudflare将choreoatlas.io指向144.21.49.157
# 开启Proxy状态，自动获得SSL
```

### 2. 修复GitHub Pages
```bash
# 检查并修复GitHub Pages配置
# 重新启用或重新部署
```

### 3. 部署双地域路由
```bash
# 在GitHub Pages正常后
# 部署Cloudflare Worker
# 恢复智能路由
```

## Cloudflare设置步骤

### DNS记录配置
1. 登录Cloudflare Dashboard
2. 选择 `choreoatlas.io` 域名
3. 进入DNS设置
4. 修改记录：
   ```
   类型: A
   名称: @
   内容: 144.21.49.157
   代理状态: 🧡 已代理
   ```

### SSL/TLS设置
1. 进入SSL/TLS → 概述
2. 加密模式: **灵活** (服务器HTTP，Cloudflare提供HTTPS)
3. 启用"始终使用HTTPS"
4. 启用"自动HTTPS重写"

### Worker设置（双地域路由时使用）
1. 进入Workers → 概述
2. 创建服务
3. 粘贴 `cloudflare-worker.js` 代码
4. 设置路由: `choreoatlas.io/*`

## 验证清单

### 基本连接
- [ ] https://choreoatlas.io 可访问
- [ ] SSL证书有效
- [ ] HTTP自动重定向到HTTPS

### 双地域路由（如果启用）
- [ ] 中国IP访问到Oracle Cloud服务器
- [ ] 海外IP访问到GitHub Pages
- [ ] 响应头包含路由信息

### 性能检查
- [ ] 页面加载速度正常
- [ ] 静态资源缓存正确
- [ ] 国际化功能正常

## 应急方案

如果遇到问题，可快速切换：

### 紧急恢复
```bash
# 在Cloudflare暂停Worker
# 直接DNS指向稳定的服务器
# 确保基本访问
```

### 渐进切换
```bash
# 先确保一个服务器稳定
# 再逐步添加路由功能
# 最后启用双地域
```