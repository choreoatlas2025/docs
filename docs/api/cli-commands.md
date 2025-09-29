# CLI Commands Reference (CE)

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Commands and options may change as we refine the interface.
:::

## Global Options (Community Edition)

```bash
--help, -h     Show help information
--version      Print version information
```

## Domains and Aliases

Top-level domains and their meanings:

```
spec        # Contracts: discover | lint | validate | convert
run         # Runtime:   validate
system      # Utilities: version
```

Common aliases (equivalent): `lint` ≙ `spec lint`, `validate` ≙ `run validate`, `discover` ≙ `spec discover`.

## `choreoatlas spec discover`

Generate FlowSpec and ServiceSpec contracts directly from a trace file.

```bash
choreoatlas spec discover [options]
```

**Options**

```bash
--trace string         Path to the trace file (CE internal JSON)
--out string           Output path for the FlowSpec file (default `discovered.flowspec.yaml`)
--out-services string  Directory for generated ServiceSpec files (default `./services`)
--title string         FlowSpec title (optional)
--emit-graph          Emit graph(DAG) format (CE defaults to flow; placeholder)
```

**Example**

```bash
choreoatlas spec discover \
  --trace traces/successful-order.trace.json \
  --out contracts/flows/order-flow.discovered.flowspec.yaml \
  --out-services contracts/services.discovered
```

Notes:
- CE keeps FlowSpec.input clean (no `otel.*`/`http.*`/`span.*`). Telemetry is mapped into ServiceSpec pre/postconditions.
- Operation IDs are normalized from HTTP/RPC span info for stability.

## `choreoatlas spec convert`

Convert a DAG (graph) FlowSpec to sequential flow (CE default representation).

```bash
choreoatlas spec convert --in <input.flowspec.yaml> --to flow --out <output.flowspec.yaml>
```

Example:

```bash
choreoatlas spec convert \
  --in examples/flows/order-fulfillment-dag.flowspec.yaml \
  --to flow \
  --out converted.flow.yaml
```

## `choreoatlas run validate`

Validate an orchestration against a trace and optionally emit reports.

```bash
choreoatlas run validate [options]
```

**Options**

```bash
--flow string               FlowSpec file path (default `.flowspec.yaml`)
--trace string              Trace file path (required)
--semantic bool             Enable semantic validation (default `true`)
--causality string          Causality mode: `strict`, `temporal`, or `off` (default `temporal`)
--causality-tolerance int   Causality tolerance in milliseconds (default `50`)
--baseline string           Baseline file path (optional)
--baseline-missing string   Strategy when baseline is missing: `fail` or `treat-as-absolute` (default `fail`)
--threshold-steps float     Minimum step coverage (default `0.9`)
--threshold-conds float     Minimum condition pass rate (default `0.95`)
--skip-as-fail              Treat SKIP conditions as failures
--report-format string      Report format: `html`, `json`, or `junit`
--report-out string         Output file for the report (required when `--report-format` is set)
--summary                   Write GitHub Step Summary when `GITHUB_STEP_SUMMARY` is present
```

**Examples**

```bash
# Basic validation with an HTML report
choreoatlas run validate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format html --report-out reports/validation-report.html --summary

# Enforce strict coverage thresholds
choreoatlas run validate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --threshold-steps 1.0 --threshold-conds 1.0 --skip-as-fail
```

## `choreoatlas lint`

Run structural and schema validation over a FlowSpec and its referenced ServiceSpecs.

```bash
choreoatlas lint [options]
```

**Options**

```bash
--flow string   FlowSpec file path (default `.flowspec.yaml`)
--schema bool   Enable JSON Schema validation (default `true`)
```

**Example**

```bash
choreoatlas spec lint --flow contracts/flows/order-flow.flowspec.yaml
```

## `choreoatlas ci-gate`

Combine lint + validate for CI/CD usage. Exits non-zero if validation fails.

```bash
choreoatlas ci-gate [options]
```

**Options**

```bash
--flow string   FlowSpec file path (required)
--trace string  Trace file path (required)
```

**Example**

```bash
choreoatlas ci-gate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.trace.json
```

## `choreoatlas version`

Display version and build metadata.

```bash
choreoatlas version [options]
```

```bash
--json    Output version information as JSON
--short   Print only the version number
```

## Exit Codes

| Code | Description |
| --- | --- |
| `0` | Success |
| `1` | CLI error (invalid flags, unexpected failures) |
| `2` | Input or parsing error (missing files, invalid format) |
| `3` | Validation failed (trace and FlowSpec mismatch) |
| `4` | Gate failed (thresholds or baseline not satisfied) |

## Environment Variables (optional)

```bash
# Custom configuration file path (if supported)
export CHOREOATLAS_CONFIG=/path/to/config.yaml

# Enable verbose debug logs
export CHOREOATLAS_DEBUG=true
```

## Complete Workflow Script (sample)

```bash
#!/usr/bin/env bash
set -euo pipefail

alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'

choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered

choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml

choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```
