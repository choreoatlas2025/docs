---
title: Recipe — Thresholds & Baselines
description: Stabilize validation with thresholds and historical baselines.
---

# Recipe: Thresholds & Baselines

Use thresholds to enforce minimum coverage and baselines to compare against a known-good run.

## Enforce strict thresholds

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --threshold-steps 1.0 \
  --threshold-conds 1.0 \
  --skip-as-fail
```

Gate result: non-zero exit code `4` if thresholds are not met.

## Establish a baseline

Create a JSON report from a known-good run and keep it as baseline:

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format json --report-out baselines/order-flow.ok.json
```

Compare new runs against the baseline:

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/regression.trace.json \
  --baseline baselines/order-flow.ok.json
```

Default policy: gate fails when baseline is missing. To treat missing baseline as absolute mode:

```bash
choreoatlas validate ... --baseline-missing treat-as-absolute
```

## CI suggestions

- Store baselines under `baselines/<flow>.json` and review changes like code.
- Combine thresholds with baselines: threshold catches regressions; baseline stabilizes noise.
