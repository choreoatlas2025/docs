---
title: Recipe — 发现→精修→校验
description: 从真实追踪生成契约，精修后用于持续校验与门禁。
---

# Recipe：发现 → 精修 → 校验

## 1）从追踪发现契约

```bash
choreoatlas discover \
  --trace traces/successful-order.trace.json \
  --out contracts/flows/order-flow.discovered.flowspec.yaml \
  --out-services contracts/services.discovered
```

## 2）精修契约

- 统一命名（业务含义清晰）。
- 在 ServiceSpec 中补充 CEL 前/后置条件。
- 在 FlowSpec 中编码因果与时序关系。

结构检查：

```bash
choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml
```

## 3）用真实追踪校验

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format html --report-out reports/validation-report.html
```

## 4）接入 CI 门禁

```bash
choreoatlas ci-gate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/pull-request.trace.json
```

建议将 HTML/JUnit 报告作为构建工件上传。
