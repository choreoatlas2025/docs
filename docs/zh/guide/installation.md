---
sidebar_position: 2
---

# 安装指南

::: warning Beta 版本
ChoreoAtlas CLI 仍处于 **Beta** 阶段，安装方式后续可能调整。
:::

以下列出三种常见安装方法。

## 方式一：Docker 一行别名（推荐）

```bash
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'
```

- 无需安装或升级本地二进制
- 只要本机有 Docker 即可运行
- 本站文档默认使用该方式

## 方式二：下载发行版二进制

1. 前往 [GitHub Releases](https://github.com/choreoatlas2025/cli/releases)
2. 下载对应平台压缩包（Linux/macOS/Windows，amd64/arm64）
3. 解压并移动到 PATH，例如：

```bash
tar -xzf choreoatlas-darwin-arm64.tar.gz
sudo mv choreoatlas /usr/local/bin/choreoatlas
chmod +x /usr/local/bin/choreoatlas
```

验证安装：

```bash
choreoatlas --version
```

## 方式三：源码编译

```bash
git clone https://github.com/choreoatlas2025/cli.git
cd cli
make build
export PATH=$PWD/bin:$PATH
choreoatlas --version
```

## 系统要求

- **操作系统**：Linux / macOS / Windows
- **架构**：amd64 或 arm64
- **内存**：≥ 64MB
- **存储**：≥ 20MB
- **追踪数据**：OpenTelemetry/Jaeger JSON，或已转换的 CE 内部格式

安装完成后，建议直接前往 [快速开始](/zh/guide/getting-started) 跑通首个示例。
