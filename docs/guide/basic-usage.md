# Basic Usage

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta**; commands and flags may evolve.
:::

This page summarises the everyday commands you will run after completing the quickstart.

## Alias recap

Use the Docker alias so you always run the latest CLI without local installation:

```bash
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'
```

## Lint a FlowSpec

```bash
choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml
```

By default, lint performs:
- JSON Schema validation (set `--schema=false` to skip)
- Flow graph checks (unique steps, dependencies, variable resolution)
- ServiceSpec schema validation for referenced services

## Validate against a trace

```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```

Useful flags:
- `--threshold-steps`, `--threshold-conds`: enforce minimum coverage/condition rates
- `--skip-as-fail`: treat SKIP conditions as failures
- `--baseline`, `--baseline-missing`: compare against a stored baseline
- `--report-format`, `--report-out`: emit HTML/JSON/JUnit reports

## Discover contracts from a trace

```bash
choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered
```

Review the generated files, keep what you need, and iterate on the specs.

## Combined workflow script

```bash
#!/usr/bin/env bash
set -euo pipefail

alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'

choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered

choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml

choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```

## Exit codes (recap)

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | CLI error (invalid flags, unexpected failures) |
| `2` | Input or parsing error |
| `3` | Validation failed |
| `4` | Gate failed |

## Related topics

- [Getting Started](/guide/getting-started)
- [CI Integration](/guide/ci-integration)
- [Trace Conversion](/guide/trace-conversion)
- [CLI Reference](/api/cli-commands)
