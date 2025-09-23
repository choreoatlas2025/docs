---
title: Recipe — 批量校验
description: 一次性校验多条追踪，生成报告并用于 CI 门禁。
---

# Recipe：批量校验

对多个 trace 批量执行校验，并收集报告供查看与统计。

## 批量生成报告

```bash
FLOW=contracts/flows/order-flow.graph.flowspec.yaml
OUT=reports/batch
mkdir -p "$OUT/html" "$OUT/junit"

for t in traces/*.trace.json; do
  name=$(basename "$t" .trace.json)
  choreoatlas validate \
    --flow "$FLOW" \
    --trace "$t" \
    --report-format html --report-out "$OUT/html/$name.html"

  choreoatlas validate \
    --flow "$FLOW" \
    --trace "$t" \
    --report-format junit --report-out "$OUT/junit/$name.junit.xml" || true
done
```

建议：同时产出 HTML 与 JUnit；校验失败不影响批量流程（`|| true`），最终统一判定。
## 聚合门禁

```bash
set -euo pipefail
FAIL=0
for t in traces/*.trace.json; do
  choreoatlas validate --flow "$FLOW" --trace "$t" \
    --threshold-steps 0.9 --threshold-conds 0.95 || FAIL=1
done
exit $FAIL
```

## 并行执行（GNU parallel）

```bash
find traces -name '*.trace.json' | parallel -j4 \
  'choreoatlas validate --flow contracts/flows/order-flow.graph.flowspec.yaml --trace {}'
```
