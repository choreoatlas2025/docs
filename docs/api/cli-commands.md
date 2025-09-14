# CLI Commands Reference

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Commands and options may change as we refine the interface.
:::

Complete reference for all ChoreoAtlas CLI commands.

## Global Options

All commands support these global options:

```bash
--edition string     Edition to use (ce, profree, proprivacy, cloud) (default "ce")
--config string      Config file path (default ".choreoatlas.yaml")
--verbose, -v        Enable verbose logging
--quiet, -q         Suppress all output except errors
--help, -h          Show help
--version           Show version information
```

## Commands

### `ca discover`

Generate ServiceSpec and FlowSpec contracts from execution traces.

```bash
ca discover [options]
```

**Options:**
```bash
--trace string           Path to trace file (JSON/OTLP format)
--out-servicespec dir    Output directory for ServiceSpec files
--out-flowspec string    Output path for FlowSpec file
--format string          Output format: yaml, json (default "yaml")
--service-filter string  Filter services by regex pattern
```

**Examples:**
```bash
# Basic discovery
ca discover --trace order.json --out-servicespec ./services/

# Generate both ServiceSpec and FlowSpec
ca discover \
  --trace order.json \
  --out-servicespec ./services/ \
  --out-flowspec ./flows/order.flowspec.yaml

# Filter specific services
ca discover \
  --trace order.json \
  --service-filter "^(order|payment|shipping)$" \
  --out-servicespec ./core-services/
```

### `ca validate`

Validate ServiceSpec and FlowSpec contracts against execution traces.

```bash
ca validate [options]
```

**Options:**
```bash
--servicespec string     Path to ServiceSpec directory or file
--flowspec string        Path to FlowSpec file
--trace string           Path to trace file for validation
--report-html string     Generate HTML report at path
--report-json string     Generate JSON report at path
--report-junit string    Generate JUnit XML report at path
--baseline string        Baseline report for comparison
--coverage-threshold int Coverage threshold (0-100) (default 50)
```

**Examples:**
```bash
# Basic validation
ca validate \
  --servicespec ./services/ \
  --flowspec ./flows/order.flowspec.yaml \
  --trace ./traces/order-success.json

# Generate HTML report
ca validate \
  --servicespec ./services/ \
  --flowspec ./flows/order.flowspec.yaml \
  --trace ./traces/order-success.json \
  --report-html ./reports/validation.html

# Set coverage threshold
ca validate \
  --servicespec ./services/ \
  --flowspec ./flows/order.flowspec.yaml \
  --trace ./traces/order-success.json \
  --coverage-threshold 80
```

### `ca lint`

Static validation of ServiceSpec and FlowSpec contracts.

```bash
ca lint [options]
```

**Options:**
```bash
--servicespec string    Path to ServiceSpec directory or file
--flowspec string       Path to FlowSpec file
--strict               Enable strict mode (warnings become errors)
--format string        Output format: text, json (default "text")
```

**Examples:**
```bash
# Lint ServiceSpec files
ca lint --servicespec ./services/

# Lint FlowSpec file
ca lint --flowspec ./flows/order.flowspec.yaml

# Strict mode
ca lint --servicespec ./services/ --strict
```

### `ca ci-gate`

Combined lint and validate for CI/CD pipelines.

```bash
ca ci-gate [options]
```

**Options:**
```bash
--servicespec string     Path to ServiceSpec directory
--flowspec string        Path to FlowSpec file
--trace string           Path to trace file
--junit string           JUnit XML output path
--coverage-threshold int Required coverage percentage
--fail-on-warnings      Treat warnings as failures
```

**Examples:**
```bash
# CI validation with JUnit output
ca ci-gate \
  --servicespec ./services/ \
  --flowspec ./flows/order.flowspec.yaml \
  --trace ./traces/integration-test.json \
  --junit ./reports/junit.xml \
  --coverage-threshold 75
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