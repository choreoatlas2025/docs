---
title: Recipe — Batch Validation
description: Validate many traces against a FlowSpec, emit reports, and gate in CI.
---

# Recipe: Batch Validation

Validate multiple traces in one go and collect reports for inspection.

## Validate all traces in a folder

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

Notes:

- Generate both HTML and JUnit. Let validation failures continue (`|| true`) to finish the batch.
- Upload the two report folders as CI artifacts.

## Gate on aggregate

To fail the job when any run fails, collect exit codes and return non-zero:

```bash
set -euo pipefail
FAIL=0
for t in traces/*.trace.json; do
  choreoatlas validate --flow "$FLOW" --trace "$t" \
    --threshold-steps 0.9 --threshold-conds 0.95 || FAIL=1
done
exit $FAIL
```

## Parallel execution (GNU parallel)

```bash
find traces -name '*.trace.json' | parallel -j4 \
  'choreoatlas validate --flow {= s:.trace.json$:: =}.flowspec.yaml --trace {}'
```

Adjust `-j` to your CI runner capacity.

