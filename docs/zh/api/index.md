# API 参考

::: warning Beta 版本
ChoreoAtlas CLI 目前处于 **Beta** 状态。API 和命令接口可能会随着产品的完善而发生变化。
:::

欢迎使用 ChoreoAtlas CLI API 参考文档。本节提供所有 CLI 命令、配置选项和集成模式的完整文档。

## 📚 文档章节

### [CLI 命令](/zh/api/cli-commands)
所有 ChoreoAtlas CLI 命令的完整参考，包括：
- 核心命令 (`discover`, `validate`, `lint`)
- 企业功能 (`baseline`, `policy`, `audit`)
- 全局选项和配置
- 使用示例和工作流程

## 🚀 快速命令参考

### 核心命令
```bash
# 从追踪发现契约
ca discover --trace <文件> --output <目录>

# 验证契约与执行追踪
ca validate --flow <文件> --trace <文件> --edition ce

# 静态分析和检查
ca lint --flow <文件>

# CI/CD 门禁命令
ca ci-gate --flow <文件> --trace <文件> --edition ce
```

### 获取帮助
```bash
# 全局帮助
ca --help

# 特定命令帮助
ca validate --help
ca discover --help
ca lint --help
```

## 📖 相关文档

- **[快速开始](/zh/guide/getting-started)** - 首次设置和基本工作流程
- **[基础用法](/zh/guide/basic-usage)** - 常见使用模式和示例
- **[安装指南](/zh/guide/installation)** - 安装方法和要求

## 🔗 外部资源

- **[GitHub 仓库](https://github.com/choreoatlas2025/cli)** - 源代码和问题反馈
- **[Docker Hub](https://hub.docker.com/u/choreoatlas)** - 容器镜像
- **[快速演示](https://github.com/choreoatlas2025/quickstart-demo)** - 交互式示例