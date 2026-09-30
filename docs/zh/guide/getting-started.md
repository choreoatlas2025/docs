---
sidebar_position: 3
---

# 快速开始

::: warning Beta 版本
ChoreoAtlas CLI 当前处于 **Beta** 状态，功能和 API 后续可能调整。
:::

本指南使用已发布的 CE Beta 和两份预录示例追踪，生成一份通过报告与一份预期失败报告。先看实际结果，再决定是否用于自己的系统。

## 前置条件

- Docker 和 Make
- Git（用于克隆 quickstart 仓库）
- 基础命令行操作能力

## 运行已验证的示例

```bash
git clone https://github.com/choreoatlas2025/quickstart-demo.git
cd quickstart-demo
make demo
```

仓库内包含示例 FlowSpec、ServiceSpec 与追踪文件。运行后打开 `reports/successful-order-report.html` 和 `reports/failed-payment-report.html`：前者的 5 个流程步骤通过，后者的支付失败会触发 Gate 失败。示例追踪缺少部分输入字段，因此有些前置条件显示为 `SKIP`；流程通过不代表所有条件都被检查。

## 查看 CLI 命令

如需在 `quickstart-demo` 目录手动运行命令，可在交互式终端设置别名：

```bash
alias choreoatlas='docker run --rm --user $(id -u):$(id -g) -v $(pwd):/workspace -w /workspace choreoatlas/cli:0.2.0-ce.beta.1'
```

> 如果希望本地安装，可以从 [GitHub Releases](https://github.com/choreoatlas2025/cli/releases) 下载对应平台的二进制。

### 从追踪生成契约

```bash
choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered
```

可将生成文件与仓库内整理过的 `contracts/flows/order-flow.graph.flowspec.yaml` 对照。当前 Beta 随附的 lint schema 不接受这份图示例中的所有字段，因此本指南不将 lint 作为运行前提。

### 根据追踪执行校验

```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```

如需 JSON 等结构化数据，可追加：
```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format json --report-out reports/validation-report.json
```

## 查看结果

- `reports/validation-report.html`：时间线、覆盖率、Gate 状态一目了然
- `reports/validation-report.json`（可选）：结构化数据，方便自动化处理
- 控制台输出：每个步骤的 PASS/FAIL 行

在本地打开 HTML 报告（如 `open reports/validation-report.html` 或 `xdg-open`）。

## 下一步

- **CI 集成**：在流水线中运行相同的 `make demo` 命令（参考 [CI 集成指南](/zh/guide/ci-integration)）。
- **追踪转换**：将 Jaeger/OTLP 追踪转换为 CE 内部格式（参考 [追踪转换说明](/zh/guide/trace-conversion)）。

可先在示例中核对 PASS、FAIL 和 SKIP，再尝试导入自己的追踪数据。
