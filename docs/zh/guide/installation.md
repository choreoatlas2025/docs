---
sidebar_position: 2
---

# 安装指南

::: warning Beta 版本
ChoreoAtlas CLI 目前处于 **Beta** 状态。安装方式和包可能会发生变化。
:::

本页面提供 ChoreoAtlas CLI 的各种安装方式。选择最适合您环境的安装方法。

## 🍺 Homebrew (推荐)

适用于 macOS 和 Linux 用户的最便捷安装方式：

```bash
# 添加 ChoreoAtlas Homebrew Tap
brew tap choreoatlas2025/tap

# 安装 ChoreoAtlas CLI
brew install choreoatlas

# 验证安装
choreoatlas version
```

### 更新版本

```bash
brew upgrade choreoatlas
```

## 🐳 Docker

无需本地安装，适合容器化环境或临时使用：

```bash
# 运行最新版本
docker run --rm choreoatlas/cli:latest version

# 创建便捷别名
echo 'alias choreoatlas="docker run --rm -v \$(pwd):/workspace choreoatlas/cli:latest"' >> ~/.bashrc
source ~/.bashrc

# 使用别名
choreoatlas validate --help
```

### Docker 镜像版本

- `choreoatlas/cli:latest` - 最新稳定版
- `choreoatlas/cli:v0.1.2` - 指定版本
- `ghcr.io/choreoatlas2025/cli:latest` - GitHub Container Registry

## 📦 预编译二进制

从 GitHub Releases 直接下载预编译的二进制文件：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="linux" label="Linux" default>

```bash
# 自动检测架构并下载
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-linux-$(uname -m).tar.gz" | tar xz

# 移动到 PATH
sudo mv choreoatlas /usr/local/bin/
chmod +x /usr/local/bin/choreoatlas

# 验证安装
choreoatlas version
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
# Intel Mac
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-darwin-amd64.tar.gz" | tar xz

# Apple Silicon Mac
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-darwin-arm64.tar.gz" | tar xz

# 移动到 PATH
sudo mv choreoatlas /usr/local/bin/
chmod +x /usr/local/bin/choreoatlas

# 验证安装
choreoatlas version
```

  </TabItem>
  <TabItem value="windows" label="Windows">

1. 访问 [GitHub Releases](https://github.com/choreoatlas2025/cli/releases/latest)
2. 下载 `choreoatlas-windows-amd64.zip`
3. 解压并将 `choreoatlas.exe` 添加到 PATH

或使用 PowerShell：

```powershell
# 下载并解压到当前目录
Invoke-WebRequest -Uri "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-windows-amd64.zip" -OutFile "choreoatlas.zip"
Expand-Archive -Path "choreoatlas.zip" -DestinationPath "."

# 验证安装
.\choreoatlas.exe version
```

  </TabItem>
</Tabs>

## 📋 系统要求

### 最低要求
- **操作系统**: Linux, macOS, Windows
- **架构**: amd64, arm64
- **内存**: 64MB RAM
- **存储**: 20MB 可用空间

### 推荐配置
- **内存**: 256MB+ RAM（处理大型追踪文件）
- **CPU**: 2+ 核心（并行验证）
- **存储**: 100MB+（缓存和报告）

## 🔧 配置验证

安装完成后，验证 CLI 是否正确配置：

```bash
# 检查版本信息
choreoatlas version

# 检查可用命令
choreoatlas --help

# 验证 Docker 集成（如果使用 Docker）
docker run --rm choreoatlas/cli:latest --help
```

期望输出示例：
```
ChoreoAtlas CLI v0.1.2
Built with Go 1.21, commit abc1234
Edition: ce
Platform: darwin/arm64
```

## 🏢 企业安装

### 私有镜像仓库

对于企业环境，您可以将 Docker 镜像推送到私有仓库：

```bash
# 拉取公开镜像
docker pull choreoatlas/cli:latest

# 重新标记到私有仓库
docker tag choreoatlas/cli:latest your-registry.com/choreoatlas/cli:latest

# 推送到私有仓库
docker push your-registry.com/choreoatlas/cli:latest
```

### 离线安装包

Pro Privacy 版本提供完全离线的安装包，包含：
- 预编译二进制文件
- 所有依赖和资源
- 离线验证和许可文件
- SBOM 和签名验证

联系 [enterprise@choreoatlas.com](mailto:enterprise@choreoatlas.com) 获取离线安装包。

## 🔒 安全验证

ChoreoAtlas 发布的所有二进制文件都经过数字签名，您可以验证完整性：

```bash
# 下载校验和文件
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/checksums.txt" -o checksums.txt

# 验证下载的文件（Linux/macOS）
sha256sum -c checksums.txt

# 查看 SBOM（软件物料清单）
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas.spdx.json"
```

### Cosign 签名验证

```bash
# 安装 cosign
go install github.com/sigstore/cosign/v2/cmd/cosign@latest

# 验证容器镜像签名
cosign verify choreoatlas/cli:latest --certificate-identity-regexp=".*" --certificate-oidc-issuer-regexp=".*"
```

## ❓ 故障排除

### 常见问题

**问题**: `command not found: choreoatlas`
**解决**: 确保二进制文件在 PATH 中，或使用完整路径执行

**问题**: Docker 权限被拒绝
**解决**: 确保用户在 `docker` 组中，或使用 `sudo`

**问题**: macOS 安全警告
**解决**: 运行 `sudo xattr -d com.apple.quarantine /usr/local/bin/choreoatlas`

### 获取帮助

如果遇到安装问题：

1. 搜索 [GitHub Issues](https://github.com/choreoatlas2025/cli/issues)
2. 访问 [GitHub Discussions](https://github.com/choreoatlas2025/cli/discussions)
3. 联系技术支持: [support@choreoatlas.com](mailto:support@choreoatlas.com)

## 🚀 下一步

安装完成后，继续：
- [快速开始](./quickstart.md) - 运行您的第一个验证
- [核心概念](./concepts/dual-contracts.md) - 了解双契约架构

---

<div className="callout success">
  <p><strong>✅ 安装成功！</strong></p>
  <p>现在您已经安装了 ChoreoAtlas CLI，可以开始体验契约即代码的微服务治理了。建议先运行 <a href="https://github.com/choreoatlas2025/quickstart-demo">Quickstart Demo</a> 获得直观感受。</p>
</div>