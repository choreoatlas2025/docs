---
title: 报告输出
description: HTML、JSON 与 JUnit 报告格式与字段说明，含 GateResult 示例。
---

# 报告输出

ChoreoAtlas 可生成三类报告，分别用于人工查看、程序消费与 CI 集成：HTML、JSON 与 JUnit。

## 快速使用

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format html --report-out reports/validation-report.html
```

多份报告可通过多次执行 `validate` 生成（改变 `--report-format` 与 `--report-out`）。

## HTML 报告

- 目的：人类友好视图，含时间线、覆盖率、门禁摘要。
- 文件：`reports/validation-report.html`
- 内容：总体状态、逐步结果、覆盖率条、阈值/基线摘要、版本角标（CE / Pro Standard / Pro Privacy）。

示例：`/docs/samples/validation-report.html`。

## JSON 报告

用于程序化消费与自助看板。

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format json --report-out reports/validation.json
```

示例结构（节选）：

```json
{
  "flow": "contracts/flows/order-flow.graph.flowspec.yaml",
  "trace": "traces/successful-order.trace.json",
  "summary": { "status": "PASS", "steps": 4, "issues": 0 },
  "coverage": { "steps": 1.0, "conditions": 0.98 },
  "thresholds": { "steps": 0.9, "conditions": 0.95, "skipAsFail": false },
  "baseline": { "path": null, "mode": "none" },
  "gateResult": { "code": 0, "reason": "ok" }
}
```

## JUnit 报告

被各类 CI 系统广泛支持，便于汇总统计。

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format junit --report-out reports/validation.junit.xml
```

映射规则：

- 每个编排步骤映射为一个 test case。
- 失败（含阈值/基线不满足）以 `<failure>` 节点表示。
- 进程退出码区分“校验失败”与“门禁失败”。

## GateResult 与退出码

用于 CI 门禁的约定：

- `0` 成功
- `3` 校验失败（trace 与 FlowSpec 不一致）
- `4` 门禁失败（阈值或基线不满足）

JSON 报告中的 `gateResult`（含 `code` 与 `reason`）用于显式驱动 CI 判定。

## 建议

- CI 中同时产出 HTML 与 JUnit：HTML 用于人工核查，JUnit 供看板统计。
- 报告作为构建工件保留 14–30 天。
- 用阈值防回退，用基线抑噪声。
