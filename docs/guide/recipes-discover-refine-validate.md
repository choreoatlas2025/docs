---
title: Recipe — Discover → Refine → Validate
description: Generate contracts from traces, refine them, and validate continuously.
---

# Recipe: Discover → Refine → Validate

This workflow bootstraps contracts from real traffic and turns them into enforceable gates.

## 1) Discover from a trace

```bash
choreoatlas discover \
  --trace traces/successful-order.trace.json \
  --out contracts/flows/order-flow.discovered.flowspec.yaml \
  --out-services contracts/services.discovered
```

Review the discovered FlowSpec and ServiceSpecs.

## 2) Refine contracts

- Rename steps and operations to clear business names.
- Add CEL conditions in ServiceSpec for pre/postconditions.
- Encode temporal constraints in FlowSpec (causal edges, ordering, fan-in/out).

Run structural checks:

```bash
choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml
```

## 3) Validate with real traces

```bash
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format html --report-out reports/validation-report.html
```

## 4) Put it in CI

```bash
choreoatlas ci-gate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/pull-request.trace.json
```

Artifacts: upload `reports/validation-report.html` and/or `reports/validation.junit.xml`.

