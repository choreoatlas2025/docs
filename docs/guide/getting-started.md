# Getting Started

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Features and APIs may change as we continue to improve the product.
:::

This guide shows how to go from trace data to validated reports in minutes. You will discover contracts, lint them, validate against real traces, and review the generated outputs.

## Prerequisites

- Docker **or** the ChoreoAtlas binary (v0.7.0+)
- Git (to clone the quickstart demo)
- Familiarity with basic shell commands

## Step 0 – Clone the quickstart workspace (recommended)

```bash
git clone https://github.com/choreoatlas2025/quickstart-demo.git
cd quickstart-demo
```

The repository includes sample FlowSpec/ServiceSpec files and traces under `contracts/` and `traces/`.

## Step 1 – Create a one-line alias

```bash
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'
```

> Prefer installers? Download binaries from [GitHub Releases](https://github.com/choreoatlas2025/cli/releases) instead of using Docker.

## Step 2 – Discover contracts from a trace

```bash
choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered
```

Expected output (abridged):
```
🔍 Analyzing trace data...
✅ Generated FlowSpec: contracts/flows/order-flow.discovered.flowspec.yaml
✅ Generated ServiceSpecs under contracts/services.discovered/
```

Review the generated files and keep either the discovered version or the curated sample (`contracts/flows/order-flow.graph.flowspec.yaml`).

## Step 3 – Lint the FlowSpec

```bash
choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml
```

The linter runs JSON Schema validation (unless `--schema=false`) and structural checks. Successful output looks like:
```
[SCHEMA] FlowSpec structure validation passed
[SCHEMA] ServiceSpec structure validation passed
Lint: OK
```

## Step 4 – Validate against a trace

```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```

Sample console output:
```
[PASS] Create Order (orders.createOrder)
[PASS] Authorize Payment (payment.authorizePayment)
Report saved: reports/validation-report.html (format: html)
Validate: OK
```

Add more formats if needed:
```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format json --report-out reports/validation-report.json
```

## Step 5 – Inspect the results

- `reports/validation-report.html` – timeline, coverage, and gate status
- Optional `reports/validation-report.json` – structured data for automation
- Console output – PASS/FAIL for each orchestration step

Open the HTML report locally (for example `open reports/validation-report.html` on macOS or `xdg-open` on Linux).

## Next steps

- **CI Integration:** automate lint + validate + report in your pipelines ([guide/ci-integration](/guide/ci-integration)).
- **Trace Conversion:** convert Jaeger/OTLP traces into the CE internal format ([guide/trace-conversion](/guide/trace-conversion)).
- **Troubleshooting:** common validation errors and fixes ([guide/troubleshooting](/guide/troubleshooting)).

You are now ready to apply ChoreoAtlas CLI to your own traces or extend the quickstart demo.
