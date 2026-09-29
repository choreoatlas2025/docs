# API 参考

::: warning Beta 版本
ChoreoAtlas CLI 目前处于 **Beta** 状态，API 和命令接口后续可能调整。
:::

欢迎使用 ChoreoAtlas CLI API 参考。本节为 CLI 命令、配置选项和集成模式提供完整文档。

## 📚 文档章节

### [CLI 命令](/zh/api/cli-commands)
- 核心命令：`discover`、`validate`、`lint`、`ci-gate`
- 参数与退出码说明
- 示例与工作流程

## 🚀 快速命令参考

```bash
# 可选：一行别名（免安装）
alias choreoatlas='docker run --rm --user $(id -u):$(id -g) -v $(pwd):/workspace -w /workspace choreoatlas/cli:0.2.0-ce.beta.1'

# 从追踪生成契约（FlowSpec + ServiceSpec）
choreoatlas discover --trace <trace.json>   --out <flowspec.yaml>   --out-services <dir>

# 根据追踪校验编排
choreoatlas validate --flow <flowspec.yaml> --trace <trace.json>

# 结构与 Schema 校验
choreoatlas lint --flow <flowspec.yaml>

# CI/CD 门禁
choreoatlas ci-gate --flow <flowspec.yaml> --trace <trace.json>
```

### 获取帮助

```bash
choreoatlas --help
choreoatlas validate --help
choreoatlas discover --help
choreoatlas lint --help
```

## 📖 推荐阅读

- **[快速开始](/zh/guide/getting-started)** — 完整的探索 → 校验闭环
- **[基础用法](/zh/guide/basic-usage)** — 日常常用命令速查
- **[安装指南](/zh/guide/installation)** — Docker / 二进制 / 源码

## 🔗 外部资源

- **[GitHub 仓库](https://github.com/choreoatlas2025/cli)** — 源码与 Issues
- **[Docker Hub](https://hub.docker.com/u/choreoatlas)** — 官方镜像
- **[快速演示](https://github.com/choreoatlas2025/quickstart-demo)** — 可运行示例
