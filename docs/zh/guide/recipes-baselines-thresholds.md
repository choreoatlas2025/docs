---
title: Recipe — 阈值与基线
description: 用阈值与历史基线稳定校验，减少噪声。
---

# Recipe：阈值与基线

## 强约束阈值

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --threshold-steps 1.0 \
  --threshold-conds 1.0 \
  --skip-as-fail
```

当阈值不满足时，以退出码 `4` 失败（适合 CI 门禁）。

## 建立基线

从一次“已知正确”的运行生成 JSON 报告，作为基线：

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format json --report-out baselines/order-flow.ok.json
```

后续与该基线对比：

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/regression.trace.json \
  --baseline baselines/order-flow.ok.json
```

缺失基线的策略（默认失败）：

```bash
choreoatlas validate ... --baseline-missing treat-as-absolute
```

## CI 建议

- 基线文件纳入版本库（`baselines/<flow>.json`），按变更评审。
- 阈值 + 基线组合：阈值防回退，基线抑制抖动。
