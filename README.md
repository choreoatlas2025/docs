# ChoreoAtlas Documentation

This repository contains the official documentation for ChoreoAtlas CLI, built with [Docusaurus](https://docusaurus.io/).

## 🌐 Live Site

- **Chinese (Default)**: https://choreoatlas.io
- **English**: https://choreoatlas.io/en

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve built site
npm run serve
```

## 📝 Content Structure

- `/docs/` - Documentation content (Markdown)
- `/blog/` - Blog posts
- `/src/` - Custom React components and pages
- `/static/` - Static assets (images, files)
- `/i18n/` - Internationalization content

## 🌍 Internationalization

This site supports Chinese (default) and English:

- Chinese content in `/docs/` and `/blog/`
- English translations in `/i18n/en/`

To contribute translations:
1. Run `npm run write-translations` to extract translatable strings
2. Translate content in `/i18n/en/docusaurus-plugin-content-docs/current/`
3. Update navigation and UI strings in `/i18n/en/docusaurus-theme-classic/`

## 🔧 Configuration

- `docusaurus.config.js` - Main configuration
- `sidebars.js` - Documentation navigation
- `src/css/custom.css` - Custom styling

## 📚 Writing Documentation

### File Structure
```
docs/
├── intro.md                 # Homepage content
├── installation.md          # Installation guide  
├── quickstart.md            # Getting started
├── concepts/                # Core concepts
│   ├── dual-contracts.md    # Architecture overview
│   ├── servicespec.md       # Service contracts
│   └── flowspec.md          # Flow contracts
├── cli/                     # Command reference
├── reports/                 # Report analysis
└── ci-cd/                  # Integration guides
```

### Content Guidelines

1. **Use descriptive frontmatter**:
```yaml
---
sidebar_position: 1
title: Custom Page Title
description: Page description for SEO
---
```

2. **Include interactive examples**:
```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="homebrew" label="Homebrew">
    brew install choreoatlas
  </TabItem>
</Tabs>
```

3. **Use callout components**:
```jsx
<div className="callout success">
  <p><strong>✅ Success!</strong></p>
  <p>Configuration completed successfully.</p>
</div>
```

4. **Add edition badges**:
```jsx
<span className="edition-badge ce">CE</span>
<span className="edition-badge pro-free">Pro</span>
```

## 🎨 Custom Components

Available custom CSS classes:
- `.feature-card` - Feature highlight boxes
- `.cli-example` - Command line examples
- `.contract-example` - Contract code blocks
- `.callout.{success|warning|info}` - Colored callouts
- `.edition-badge.{ce|pro-free|pro-privacy|cloud}` - Product edition badges

## 🚀 Deployment

### GitHub Pages (自动部署)
Documentation is automatically deployed to GitHub Pages on push to `main` branch.

Manual deployment:
```bash
npm run build
npm run deploy
```

### Docker 部署 (推荐用于Oracle Cloud等内存受限服务器)

由于Oracle Cloud等服务器内存限制，无法直接执行 `npm run build`，建议使用GitHub Actions构建的Docker镜像：

```bash
# 拉取最新镜像
docker pull choreoatlas/docs:latest

# 停止并删除旧容器
docker stop choreoatlas-docs && docker rm choreoatlas-docs

# 启动新容器
docker run -d --name choreoatlas-docs -p 8080:80 choreoatlas/docs:latest

# 检查容器状态
docker ps | grep choreoatlas-docs
```

**Nginx配置示例**：
```nginx
server {
    listen 80;
    server_name choreoatlas.io;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name choreoatlas.io;
    
    # SSL配置...
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**部署流程**：
1. GitHub Actions 自动构建 Docker 镜像
2. 镜像推送到 Docker Hub: `choreoatlas/docs:latest`
3. 服务器拉取并部署镜像，避免本地构建内存不足问题

## 📧 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm start`
5. Submit a pull request

For major changes, please open an issue first to discuss.

## 📄 License

Documentation content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

---

**ChoreoAtlas CLI** - Map, Verify, Steer cross-service choreography with contracts-as-code.# Pages test
# 测试部署
# Test deployment trigger
