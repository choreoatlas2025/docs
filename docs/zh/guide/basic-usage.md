---
sidebar_position: 4
---

# 基础用法

::: warning Beta 版本
ChoreoAtlas CLI 仍在 **Beta** 阶段，命令与参数可能调整。
:::

本页汇总快速上手后的常用命令，便于日常开发与运维。

## 别名回顾

```bash
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'
```

通过 Docker 别名始终使用最新 CLI，无需本地安装。

## Lint FlowSpec

```bash
choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml
```

- 默认执行 JSON Schema 校验（可通过 `--schema=false` 跳过）
- 检查步骤唯一性、依赖关系、变量引用
- 同步校验引用的 ServiceSpec

## 根据追踪执行校验

```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```

常见参数：
- `--threshold-steps`、`--threshold-conds`：覆盖率 / 条件通过率阈值
- `--skip-as-fail`：将 SKIP 条件视为失败
- `--baseline`、`--baseline-missing`：基线对比策略
- `--report-format`、`--report-out`：生成 HTML / JSON / JUnit 报告

## 从追踪生成契约

```bash
choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered
```

生成后可人工审阅、保留或与已有契约对比。

## 一次性脚本（示例）

```bash
#!/usr/bin/env bash
set -euo pipefail

alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'

choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered

choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml

choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```

## 退出码（速查）

| 退出码 | 含义 |
| --- | --- |
| `0` | 成功 |
| `1` | CLI 错误（参数无效等） |
| `2` | 输入或解析错误 |
| `3` | 校验失败 |
| `4` | Gate 失败（阈值或基线不满足） |

## 延伸阅读

- [快速开始](/zh/guide/getting-started)
- [CI 集成](/zh/guide/ci-integration)
- [追踪转换](/zh/guide/trace-conversion)
- [CLI 命令参考](/zh/api/cli-commands)
