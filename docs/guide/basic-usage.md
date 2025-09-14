# Basic Usage

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Usage patterns and commands may evolve.
:::

This guide covers the fundamental usage patterns of ChoreoAtlas CLI.

## Command Structure

ChoreoAtlas CLI follows a simple command structure:

```bash
ca <command> [options] [arguments]
```

## Core Commands

### `ca lint` - Static Validation

Validate contract structure and references without execution data:

```bash
# Lint a FlowSpec
ca lint --flow myflow.flowspec.yaml

# Lint a ServiceSpec
ca lint --service myservice.servicespec.yaml

# Lint all specs in a directory
ca lint --directory ./contracts/
```

### `ca validate` - Dynamic Validation

Validate contracts against actual execution traces:

```bash
# Basic validation
ca validate --flow myflow.flowspec.yaml --trace execution.trace.json

# Specify edition
ca validate --flow myflow.flowspec.yaml --trace execution.trace.json --edition ce

# Output to file
ca validate --flow myflow.flowspec.yaml --trace execution.trace.json --output validation-report.json
```

### `ca discover` - Contract Generation

Generate contracts from execution traces:

```bash
# Basic discovery
ca discover --trace execution.trace.json --output ./generated-contracts/

# Discover with options
ca discover --trace execution.trace.json --output ./contracts/ --format yaml
```

## Common Workflows

### 1. New Project Setup

```bash
# Create project directory
mkdir my-microservice-contracts
cd my-microservice-contracts

# Generate initial contracts from traces
ca discover --trace production.trace.json --output ./

# Validate the generated contracts
ca lint --directory ./
```

### 2. Contract Validation in CI

```bash
# Run in CI pipeline
ca validate --flow order-flow.flowspec.yaml \
           --trace test-execution.trace.json \
           --edition ce \
           --output junit-results.xml \
           --format junit
```

### 3. Development Workflow

```bash
# 1. Create/modify contracts
vim user-service.servicespec.yaml

# 2. Static validation
ca lint --service user-service.servicespec.yaml

# 3. Test against sample data
ca validate --flow user-flow.flowspec.yaml --trace sample.trace.json

# 4. Generate reports
ca validate --flow user-flow.flowspec.yaml --trace sample.trace.json --format html
```

## Output Formats

ChoreoAtlas supports multiple output formats:

```bash
# JSON (default)
ca validate --flow myflow.flowspec.yaml --trace trace.json --format json

# HTML report
ca validate --flow myflow.flowspec.yaml --trace trace.json --format html

# JUnit XML (for CI)
ca validate --flow myflow.flowspec.yaml --trace trace.json --format junit

# Plain text summary
ca validate --flow myflow.flowspec.yaml --trace trace.json --format text
```

## Configuration

Create a `.choreoatlas.yaml` config file in your project root:

```yaml
# Default edition
edition: ce

# Default paths
contracts_dir: ./contracts
traces_dir: ./traces

# Validation settings
strict_mode: true
fail_on_warnings: false

# Report settings
default_format: html
output_dir: ./reports
```

## Next Steps

- Learn about [ServiceSpec contracts](./servicespec.md)
- Understand [FlowSpec orchestration](./flowspec.md)
- Explore [advanced validation features](./validation.md)