# ChoreoAtlas CLI Documentation

[![Deploy to GitHub Pages](https://github.com/choreoatlas2025/docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/choreoatlas2025/docs/actions/workflows/deploy.yml)
[![Build and Push Docker Image](https://github.com/choreoatlas2025/docs/actions/workflows/docker-build.yml/badge.svg)](https://github.com/choreoatlas2025/docs/actions/workflows/docker-build.yml)

**ChoreoAtlas CLI Documentation Site - Built with VitePress**

🌐 **Live Site**: [https://choreoatlas.io](https://choreoatlas.io)

## 🏗️ Architecture

This documentation site uses **VitePress** with a dual-channel smart deployment architecture:

- **🇨🇳 China Mainland Users** → Oracle Cloud Server (140.238.86.4) - bypassing GitHub restrictions
- **🌍 International Users** → GitHub Pages - leveraging global CDN acceleration
- **🧠 Smart Routing**: Cloudflare Worker with automatic geo-detection

## 🚀 Local Development

```bash
# Install dependencies
npm ci

# Start development server
npm run docs:dev

# Build for production
npm run docs:build

# Preview production build
npm run docs:preview
```

## 🐳 Docker

```bash
# Build Docker image
docker build -t choreoatlas-docs .

# Run container
docker run -p 3000:80 choreoatlas-docs
```

## 📁 Project Structure

```
docs/
├── .vitepress/
│   └── config.ts          # VitePress configuration
├── api/                   # API reference
│   ├── index.md
│   └── cli-commands.md
├── guide/                 # User guides
│   ├── index.md
│   ├── installation.md
│   ├── getting-started.md
│   └── basic-usage.md
├── zh/                    # Chinese translations
│   ├── api/
│   └── guide/
└── index.md              # Homepage
```

## 🌍 Internationalization (i18n)

Currently supported languages:
- **English** (`en`) - Default
- **简体中文** (`zh-CN`) - Chinese Simplified

## 🔧 Features

- **📱 Responsive Design** - Mobile-first approach
- **🔍 Search** - Built-in local search
- **🌙 Dark Mode** - Automatic theme switching
- **🚨 Beta Notifications** - Product status awareness
- **⚡ Fast Loading** - Optimized build and caching
- **🔗 Deep Linking** - SEO-friendly URLs

## 🚀 Deployment

### GitHub Pages (Auto)
- Triggers on push to `main` branch
- Builds with Node.js 20
- Deploys to GitHub Pages automatically

### Docker (Auto)
- Builds multi-platform images
- Pushes to GitHub Container Registry and Docker Hub
- Tagged with branch name and `latest`

### Manual Docker Build
```bash
# Build and tag
docker build -t choreoatlas/docs:latest .

# Run locally
docker run -p 8080:80 choreoatlas/docs:latest
```

## 📋 Available Images

- **GitHub Container Registry**: `ghcr.io/choreoatlas2025/docs`
- **Docker Hub**: `choreoatlas/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- **[ChoreoAtlas CLI](https://github.com/choreoatlas2025/cli)** - Main CLI repository
- **[Business Website](https://choreoatlas.com)** - Commercial site
- **[Docker Hub](https://hub.docker.com/u/choreoatlas)** - Container images

---

📚 **Documentation**: [https://choreoatlas.io](https://choreoatlas.io)
🐛 **Issues**: [GitHub Issues](https://github.com/choreoatlas2025/docs/issues)
💬 **Discussions**: [GitHub Discussions](https://github.com/choreoatlas2025/docs/discussions)