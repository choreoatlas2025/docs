# CLI Commands Reference

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Commands and options may change as we refine the interface.
:::

Complete reference for all ChoreoAtlas CLI commands.

## Global Options (CE)

```bash
--help, -h     Show help
--version      Show version information
```

## Commands

### `choreoatlas discover`

Generate ServiceSpec and FlowSpec contracts from execution traces.

```bash
choreoatlas discover [options]
```

**Options:**
```bash
--trace string         Path to trace file (CE internal JSON)
--out string           Output path for FlowSpec file
--out-services string  Output directory for ServiceSpec files
--title string         FlowSpec title (optional)
```

**Examples:**
```bash
# Basic discovery (FlowSpec + ServiceSpecs)
choreoatlas discover \
  --trace traces/sample.trace.json \
  --out contracts/flows/main.flowspec.yaml \
  --out-services contracts/services
```

### `choreoatlas validate`

Validate ServiceSpec and FlowSpec contracts against execution traces.

```bash
choreoatlas validate [options]
```

**Options:**
```bash
--flow string               Path to FlowSpec file
--trace string              Path to trace file (CE internal JSON)
--semantic bool             Enable semantic validation (default true)
--causality string          strict|temporal|off (default temporal)
--causality-tolerance int   Tolerance in ms (default 50)
--baseline string           Baseline file (optional)
--baseline-missing string   fail|treat-as-absolute (default fail)
--threshold-steps float     Step coverage threshold (default 0.9)
--threshold-conds float     Condition pass threshold (default 0.95)
--skip-as-fail              Treat SKIP conditions as FAIL
--report-format string      json|junit|html (optional)
--report-out string         Report output path (required with --report-format)
```

**Examples:**
```bash
# Basic validation
choreoatlas validate \
  --flow contracts/flows/main.flowspec.yaml \
  --trace traces/order-success.trace.json

# Generate HTML report
choreoatlas validate \
  --flow contracts/flows/main.flowspec.yaml \
  --trace traces/order-success.trace.json \
  --report-format html --report-out reports/validation.html

# Gate by thresholds (no baseline)
choreoatlas validate \
  --flow contracts/flows/main.flowspec.yaml \
  --trace traces/order-success.trace.json \
  --threshold-steps 0.9 --threshold-conds 0.95
```

### `choreoatlas lint`

Static validation of ServiceSpec and FlowSpec contracts.

```bash
choreoatlas lint [options]
```

**Options:**
```bash
--flow string    Path to FlowSpec file
--schema bool    Enable JSON Schema validation (default true)
```

**Examples:**
```bash
# Lint FlowSpec file (+ schema validation)
choreoatlas lint --flow contracts/flows/main.flowspec.yaml
```

### `choreoatlas ci-gate`

Combined lint and validate for CI/CD pipelines.

```bash
choreoatlas ci-gate [options]
```

**Options:**
```bash
--flow string   Path to FlowSpec file
--trace string  Path to trace file
```

**Examples:**
```bash
# CI validation and report artifacts
choreoatlas ci-gate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/integration-test.trace.json
choreoatlas validate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/integration-test.trace.json \
  --report-format junit --report-out reports/junit.xml
choreoatlas validate \
  --flow contracts/flows/order-flow.flowspec.yaml \
  --trace traces/integration-test.trace.json \
  --report-format html --report-out reports/report.html
```

### `ca version`

Display version and build information.

```bash
ca version [options]
```

**Options:**
```bash
--json    Output in JSON format
--short   Show only version number
```

**Examples:**
```bash
# Full version info
ca version

# JSON format
ca version --json

# Short version
ca version --short
```

## Configuration File

Create `.choreoatlas.yaml` in your project root:

```yaml
# Default edition
edition: ce

# Default paths
servicespec_dir: ./contracts/services
flowspec_dir: ./contracts/flows
traces_dir: ./traces
reports_dir: ./reports

# Validation settings
coverage:
  threshold: 80
  fail_on_low: true

strict_mode: false
fail_on_warnings: false

# Report settings
reports:
  html: true
  json: true
  junit: false
  
# Pro/Cloud settings (if applicable)
baseline:
  enabled: false
  path: ./baselines/

notifications:
  slack_webhook: ""
  email: []
```

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Contract validation failed
- `3` - Coverage threshold not met
- `4` - Configuration error
- `5` - File not found

## Environment Variables

```bash
# Override edition
export CHOREOATLAS_EDITION=profree

# Disable telemetry (Pro editions)
export CHOREOATLAS_TELEMETRY=false

# Custom config path
export CHOREOATLAS_CONFIG=/path/to/config.yaml

# Debug logging
export CHOREOATLAS_DEBUG=true
```

## Examples

### Complete Workflow

```bash
#!/bin/bash
set -e

echo "🔍 Discovering contracts from traces..."
ca discover \
  --trace ./traces/production-sample.json \
  --out-servicespec ./contracts/services/ \
  --out-flowspec ./contracts/flows/main-flow.flowspec.yaml

echo "🧹 Linting contracts..."
ca lint --servicespec ./contracts/services/ --flowspec ./contracts/flows/

echo "✅ Validating against test traces..."
ca validate \
  --servicespec ./contracts/services/ \
  --flowspec ./contracts/flows/main-flow.flowspec.yaml \
  --trace ./traces/integration-test.json \
  --report-html ./reports/validation.html \
  --coverage-threshold 75

echo "🎉 All checks passed!"
```

### CI/CD Integration

```bash
# GitHub Actions step
- name: Validate Service Choreography
  run: |
    ca ci-gate \
      --servicespec ./contracts/services/ \
      --flowspec ./contracts/flows/order-flow.flowspec.yaml \
      --trace ./traces/e2e-test.json \
      --junit ./reports/choreography-junit.xml \
      --coverage-threshold 80 \
      --fail-on-warnings
```
