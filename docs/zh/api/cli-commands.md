# CLI 命令参考（CE）

::: warning Beta 版本
ChoreoAtlas CLI 目前处于 **Beta** 阶段，命令和参数后续可能调整。
:::

## 全局选项（社区版）

```bash
--help, -h     显示帮助信息
--version      输出版本信息
```

## 域与别名

顶层域与含义：

```
spec        # 契约域：discover | lint | validate | convert
run         # 运行域：validate
system      # 工具域：version
```

常用别名（等价）：`lint` ≙ `spec lint`，`validate` ≙ `run validate`，`discover` ≙ `spec discover`。

## `choreoatlas spec discover`

从追踪文件生成 FlowSpec 与 ServiceSpec 契约。

```bash
choreoatlas spec discover [选项]
```

**常用选项**

```bash
--trace string         CE 内部格式的追踪文件路径
--out string           FlowSpec 输出路径（默认 `discovered.flowspec.yaml`）
--out-services string  ServiceSpec 输出目录（默认 `./services`）
--title string         FlowSpec 标题（可选）
--emit-graph          输出 graph(DAG) 表达（CE 默认 flow；占位）
```

**示例**

```bash
choreoatlas spec discover \
  --trace traces/successful-order.trace.json \
  --out contracts/flows/order-flow.discovered.flowspec.yaml \
  --out-services contracts/services.discovered
```

说明：
- CE 不会将 `otel.*`/`http.*`/`span.*` 等遥测属性写入 FlowSpec.input；这些将映射为 ServiceSpec 的 pre/postconditions。
- 操作名从 HTTP/RPC 信息规范化，保证稳定可读。

## `choreoatlas spec convert`

将 DAG（graph）表达转换为顺序式 flow（CE 默认表达）。

```bash
choreoatlas spec convert --in <输入.flowspec.yaml> --to flow --out <输出.flowspec.yaml>
```

示例：

```bash
choreoatlas spec convert \
  --in examples/flows/order-fulfillment-dag.flowspec.yaml \
  --to flow \
  --out converted.flow.yaml
```

## `choreoatlas run validate`

根据追踪数据校验流程，并可生成报告。

```bash
choreoatlas run validate [选项]
```

**常用选项**

```bash
--flow string               FlowSpec 文件路径（默认 `.flowspec.yaml`）
--trace string              追踪文件路径（必填）
--semantic bool             是否启用语义校验（默认 `true`）
--causality string          因果模式：`strict` / `temporal` / `off`（默认 `temporal`）
--causality-tolerance int   因果容差（毫秒，默认 `50`）
--baseline string           基线文件路径（可选）
--baseline-missing string   基线缺失时策略：`fail` / `treat-as-absolute`（默认 `fail`）
--threshold-steps float     步骤覆盖率阈值（默认 `0.9`）
--threshold-conds float     条件通过率阈值（默认 `0.95`）
--skip-as-fail              将 SKIP 条件视为失败
--report-format string      报告格式：`html` / `json` / `junit`
--report-out string         报告输出路径（与 `--report-format` 搭配）
--summary                   当存在 `GITHUB_STEP_SUMMARY` 时输出步骤摘要
```

**示例**

```bash
# 生成 HTML 报告 + GitHub Step Summary
choreoatlas run validate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format html --report-out reports/validation-report.html --summary

# 严格阈值
choreoatlas run validate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --threshold-steps 1.0 --threshold-conds 1.0 --skip-as-fail
```

## `choreoatlas lint`

对 FlowSpec 及其引用的 ServiceSpec 进行结构和 Schema 校验。

```bash
choreoatlas lint [选项]
```

**常用选项**

```bash
--flow string   FlowSpec 文件路径（默认 `.flowspec.yaml`）
--schema bool   是否执行 JSON Schema 校验（默认 `true`）
```

**示例**

```bash
choreoatlas spec lint --flow contracts/flows/order-flow.flowspec.yaml
```

## `choreoatlas ci-gate`

在 CI/CD 中组合 lint + validate，任何失败都会返回非零退出码。

```bash
choreoatlas ci-gate [选项]
```

**常用选项**

```bash
--flow string   FlowSpec 文件路径（必填）
--trace string  追踪文件路径（必填）
```

**示例**

```bash
choreoatlas ci-gate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.trace.json
```

## `choreoatlas version`

输出版本和构建信息。

```bash
choreoatlas version [选项]
```

```bash
--json    以 JSON 输出
--short   仅输出版本号
```

## 退出码

| 退出码 | 说明 |
| --- | --- |
| `0` | 成功 |
| `1` | CLI 错误（参数无效等） |
| `2` | 输入或解析错误（文件缺失、格式无效） |
| `3` | 校验失败（追踪与 FlowSpec 不一致） |
| `4` | Gate 失败（阈值或基线不满足） |

## 可选环境变量

```bash
# 自定义配置文件路径（若启用）
export CHOREOATLAS_CONFIG=/path/to/config.yaml

# 开启调试日志
export CHOREOATLAS_DEBUG=true
```

## 示例脚本（完整闭环）

```bash
#!/usr/bin/env bash
set -euo pipefail

alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'

choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered

choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml

choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```
