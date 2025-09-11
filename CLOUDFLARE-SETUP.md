# ChoreoAtlas 双地域智能路由部署指南

## 架构概览

```
用户请求
    ↓
Cloudflare Worker (choreoatlas.io)
    ↓
智能路由判断
    ↓
├─ 中国用户 (CN/HK/MO/TW) → Oracle Cloud (140.238.86.4:8080)
└─ 海外用户 (其他地区)      → GitHub Pages (choreoatlas2025.github.io)
```

## 部署步骤

### 1. 创建 Cloudflare Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择域名 `choreoatlas.io`
3. 进入 "Workers Routes" 页面
4. 点击 "Create a Worker"
5. 将 `cloudflare-worker.js` 的代码复制粘贴到编辑器
6. 点击 "Save and Deploy"

### 2. 配置 Worker 路由

1. 在 "Workers Routes" 页面
2. 点击 "Add route"
3. 配置：
   - **Route**: `choreoatlas.io/*`
   - **Worker**: 选择刚创建的 Worker
   - **Zone**: `choreoatlas.io`
4. 点击 "Save"

### 3. 更新 DNS 配置

**重要**：确保 DNS 记录指向 Cloudflare 代理

1. 进入 DNS 管理页面
2. 确保现有配置：
   ```
   Type: CNAME
   Name: choreoatlas.io (或 @)
   Content: choreoatlas2025.github.io
   Proxy Status: 🧡 Proxied (代理状态必须开启)
   ```

### 4. 测试验证

#### 测试命令
```bash
# 检查响应头信息
curl -I https://choreoatlas.io

# 查看路由信息
curl -H "CF-IPCountry: CN" https://choreoatlas.io | head
curl -H "CF-IPCountry: US" https://choreoatlas.io | head
```

#### 预期响应头
```
X-ChoreoAtlas-Route: CN-Route -> Oracle Cloud (CN)
X-ChoreoAtlas-Country: CN
X-ChoreoAtlas-Target: http://140.238.86.4:8080/
```

## 监控和维护

### 健康检查
Worker 包含自动故障转移机制：
- 如果主路由失败，自动切换到备用路由
- Oracle Cloud 故障时，中国用户自动切换到 GitHub Pages
- GitHub Pages 故障时，海外用户自动切换到 Oracle Cloud

### 日志监控
在 Cloudflare Dashboard 可以查看：
- Worker 执行日志
- 路由统计
- 错误报告

### 性能优化建议
1. **缓存策略**：Cloudflare 自动缓存静态资源
2. **压缩**：开启 Brotli/Gzip 压缩
3. **HTTP/2**：自动启用
4. **SSL**：使用 Cloudflare Universal SSL

## 地域路由规则

| 地区 | 国家代码 | 路由目标 | 备注 |
|------|----------|----------|------|
| 中国大陆 | CN | Oracle Cloud | 提升国内访问速度 |
| 香港 | HK | Oracle Cloud | 地理位置接近 |
| 澳门 | MO | Oracle Cloud | 地理位置接近 |
| 台湾 | TW | Oracle Cloud | 地理位置接近 |
| 其他地区 | * | GitHub Pages | 利用全球CDN |

## 故障排除

### 常见问题

1. **Worker 未生效**
   - 检查路由配置是否正确
   - 确认 DNS 代理状态为"Proxied"

2. **中国用户仍走 GitHub Pages**
   - 检查 CF-IPCountry 头信息
   - 验证 Worker 中的地区判断逻辑

3. **Oracle Cloud 连接失败**
   - 检查服务器状态：`docker ps`
   - 验证防火墙规则：端口 8080 开放
   - 测试直连：`curl http://140.238.86.4:8080`

### 调试工具

```bash
# 模拟不同地区访问
curl -H "CF-IPCountry: CN" -I https://choreoatlas.io
curl -H "CF-IPCountry: US" -I https://choreoatlas.io
curl -H "CF-IPCountry: JP" -I https://choreoatlas.io
```

## 安全考虑

1. **HTTPS 强制**：所有请求自动重定向到 HTTPS
2. **DDoS 保护**：Cloudflare 自动提供
3. **访问限制**：可配置速率限制和地区封锁
4. **安全头**：Worker 可添加额外安全响应头

## 成本估算

- **Cloudflare Worker**: 免费额度 100,000 请求/天
- **超出免费额度**: $0.50/百万请求
- **Oracle Cloud**: 已有资源
- **GitHub Pages**: 免费

## 维护计划

1. **定期检查**：每周检查两个服务端点健康状态
2. **性能监控**：监控响应时间和可用性
3. **日志分析**：分析用户地域分布和路由效果
4. **备份策略**：确保两个部署保持同步更新