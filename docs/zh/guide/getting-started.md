---
sidebar_position: 3
---

# 快速开始

::: warning Beta 版本
ChoreoAtlas CLI 当前处于 **Beta** 状态，功能和 API 后续可能调整。
:::

本指南会手把手演示：从追踪数据生成契约、执行校验、产出报告，仅需几分钟即可跑通完整流程。

## 前置条件

- Docker 或 ChoreoAtlas 二进制（建议使用官方镜像）
- Git（用于克隆 quickstart 仓库）
- 基础命令行操作能力

## 第 0 步：克隆 quickstart 演示仓库（推荐）

```bash
git clone https://github.com/choreoatlas2025/quickstart-demo.git
cd quickstart-demo
```

仓库内已准备好示例 FlowSpec / ServiceSpec / Trace 文件，可直接练习。

## 第 1 步：设置一行别名

```bash
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'
```

> 如果希望本地安装，可以从 [GitHub Releases](https://github.com/choreoatlas2025/cli/releases) 下载对应平台的二进制。

## 第 2 步：从追踪生成契约

```bash
choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered
```

输出示例：
```
🔍 Analyzing trace data...
✅ Generated FlowSpec: contracts/flows/order-flow.discovered.flowspec.yaml
✅ Generated ServiceSpecs under contracts/services.discovered/
```

查看生成的文件，决定使用自动生成版本，或保留仓库内已精修的 `contracts/flows/order-flow.graph.flowspec.yaml`。

## 第 3 步：执行 Lint

```bash
choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml
```

默认会做 JSON Schema 校验和结构检查，成功输出如下：
```
[SCHEMA] FlowSpec structure validation passed
[SCHEMA] ServiceSpec structure validation passed
Lint: OK
```

## 第 4 步：根据追踪执行校验

```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```

可能的控制台输出：
```
[PASS] Create Order (orders.createOrder)
[PASS] Authorize Payment (payment.authorizePayment)
Report saved: reports/validation-report.html (format: html)
Validate: OK
```

如需 JSON 等结构化数据，可追加：
```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format json --report-out reports/validation-report.json
```

## 第 5 步：查看结果

- `reports/validation-report.html`：时间线、覆盖率、Gate 状态一目了然
- `reports/validation-report.json`（可选）：结构化数据，方便自动化处理
- 控制台输出：每个步骤的 PASS/FAIL 行

在本地打开 HTML 报告（如 `open reports/validation-report.html` 或 `xdg-open`）。

## 下一步

- **CI 集成**：在流水线中自动完成 lint + validate + 报告（参考 [CI 集成指南](/zh/guide/ci-integration)）。
- **追踪转换**：将 Jaeger/OTLP 追踪转换为 CE 内部格式（参考 [追踪转换说明](/zh/guide/trace-conversion)）。

完成以上步骤后，您已经掌握 ChoreoAtlas CLI 的完整闭环，可以开始针对自己的追踪数据进行契约治理。
