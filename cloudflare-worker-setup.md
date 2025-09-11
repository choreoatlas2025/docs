# Cloudflare Worker 部署指南

## 当前状态 ✅
- **网站**: https://choreoatlas.io 正常运行
- **SSL证书**: 已自动配置
- **服务器**: 144.21.49.157 稳定运行
- **功能**: 4语言国际化支持完整

## Worker 部署步骤

### 方案选择
当前提供两个Worker版本：

1. **`cloudflare-worker-single.js`** (推荐先使用)
   - 所有流量路由到Oracle Cloud服务器
   - 稳定可靠，立即可用
   - 包含详细的响应头和错误处理

2. **`cloudflare-worker.js`** (双地域版)
   - 中国用户 → Oracle Cloud
   - 海外用户 → GitHub Pages (需GitHub Pages修复后使用)

### 部署步骤

#### 1. 创建 Cloudflare Worker
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Create Worker**
5. 命名: `choreoatlas-router`

#### 2. 配置 Worker 代码
1. 在代码编辑器中，删除默认代码
2. 复制粘贴 `cloudflare-worker-single.js` 的内容
3. 点击 **Save and Deploy**

#### 3. 配置路由
1. 在Worker页面点击 **Triggers**
2. 点击 **Add Custom Domain**
3. 输入: `choreoatlas.io`
4. 点击 **Add Custom Domain**

#### 4. 验证部署
```bash
# 检查响应头
curl -I https://choreoatlas.io

# 应该看到类似这样的响应头：
# X-ChoreoAtlas-Route: Single-Server → Oracle Cloud (CN)
# X-ChoreoAtlas-Country: CN  
# X-ChoreoAtlas-Server: 144.21.49.157
```

### 预期效果

#### 成功部署后
- ✅ 所有用户访问 https://choreoatlas.io
- ✅ 自动路由到稳定的Oracle Cloud服务器
- ✅ 添加详细的路由信息响应头
- ✅ 静态资源自动缓存优化
- ✅ 优雅的错误处理页面

#### 响应头信息
```
X-ChoreoAtlas-Route: Single-Server → Oracle Cloud (US)
X-ChoreoAtlas-Country: US
X-ChoreoAtlas-Server: 144.21.49.157
X-ChoreoAtlas-Version: Single-Server-v1.0
```

### 后续升级

#### 当 GitHub Pages 修复后
1. 验证 GitHub Pages 正常: `curl -I https://choreoatlas2025.github.io`
2. 修改 Worker 代码为 `cloudflare-worker.js` (双地域版)
3. 重新部署，实现智能地域路由

#### 双地域路由效果
- 🇨🇳 中国用户 → Oracle Cloud (更快速度)
- 🌍 海外用户 → GitHub Pages (全球CDN)

### 故障排除

#### 常见问题
1. **Worker未生效**: 检查Custom Domain配置是否正确
2. **502错误**: 检查源服务器是否正常运行
3. **缓存问题**: 等待几分钟让全球节点更新

#### 调试工具
```bash
# 测试不同地区
curl -H "CF-IPCountry: CN" -I https://choreoatlas.io
curl -H "CF-IPCountry: US" -I https://choreoatlas.io
curl -H "CF-IPCountry: JP" -I https://choreoatlas.io

# 检查响应时间
curl -w "@curl-format.txt" -o /dev/null -s https://choreoatlas.io
```

### 监控建议

#### 性能监控
- 在Cloudflare Dashboard查看Worker分析
- 监控请求量、错误率、响应时间
- 设置告警阈值

#### 日志查看
- 在Worker页面查看Real-time Logs
- 监控错误日志和性能指标

## 总结

当前网站已经完全正常工作，部署Worker是为了：
1. 🚀 提供更好的全球访问性能
2. 📊 获得详细的访问分析数据  
3. 🛡️ 增强错误处理和故障转移
4. 🌏 为后续双地域路由做准备

立即部署Worker将进一步提升用户体验！