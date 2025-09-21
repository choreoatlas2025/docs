# Getting Started

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Features and APIs may change as we continue to improve the product.
:::

Get up and running with ChoreoAtlas CLI in just 15 minutes. This guide will walk you through the core workflow: discovering contracts from traces, validating service orchestrations, and generating analysis reports.

## 🎯 What You'll Learn

- How to install and configure ChoreoAtlas CLI
- Core concepts: ServiceSpec and FlowSpec dual contracts
- Discovering contracts from execution traces
- Validating orchestrations against real traces
- Generating and interpreting validation reports

## 📋 Prerequisites

- **Go 1.24+** (for building from source)
- **Docker** (optional, for containerized usage)
- Basic understanding of microservices and distributed systems
- Sample execution traces (JSON format)

## 🚀 Quick Installation

### Option 1: Download Binary (Recommended)

```bash
# Visit releases and download the binary for your platform
# https://github.com/choreoatlas2025/cli/releases

# Verify installation (binary named 'choreoatlas')
choreoatlas --version
```

### Option 2: Using Docker

```bash
# Create a convenient alias (no local install needed)
alias ca='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'
```

### Option 3: Build from Source

```bash
# Clone the repository
git clone https://github.com/choreoatlas2025/cli.git
cd cli

# Build the binary
make build

# Add to PATH
export PATH=$PWD/bin:$PATH
```

## 🔍 Core Workflow Walkthrough

### Step 1: Prepare Sample Data

First, let's create a simple trace file in the CE internal format:

```bash
# Create a sample directory
mkdir -p choreoatlas-demo/traces
cd choreoatlas-demo

# Create a sample trace (order fulfillment scenario)
cat > traces/order-trace.json << 'EOF'
{
  "spans": [
    {
      "name": "create-order",
      "service": "order-service",
      "startNanos": 1694787600090000000,
      "endNanos": 1694787600215000000,
      "attributes": {"http.status_code": 201}
    },
    {
      "name": "reserve-items",
      "service": "inventory-service",
      "startNanos": 1694787600050000000,
      "endNanos": 1694787600082000000,
      "attributes": {"http.status_code": 201}
    },
    {
      "name": "charge-payment",
      "service": "payment-service",
      "startNanos": 1694787600110000000,
      "endNanos": 1694787600188000000,
      "attributes": {"http.status_code": 200}
    },
    {
      "name": "confirm-order",
      "service": "order-service",
      "startNanos": 1694787600000000000,
      "endNanos": 1694787600045000000,
      "attributes": {"http.status_code": 200}
    }
  ]
}
EOF
```

### Step 2: Discover Contracts (Atlas Scout)

Use the `discover` command to generate initial contracts from your trace data:

```bash
# Generate FlowSpec and ServiceSpecs from trace
choreoatlas discover \
  --trace traces/order-trace.json \
  --out contracts/order-fulfillment.flowspec.yaml \
  --out-services contracts/services

# Check generated files
ls -la contracts/
```

You should see files like:
- `order-service.servicespec.yaml`
- `inventory-service.servicespec.yaml`
- `payment-service.servicespec.yaml`
- `order-fulfillment.flowspec.yaml`

### Step 3: Review Generated Contracts

Let's examine the generated FlowSpec:

```bash
# View the generated flow specification
cat contracts/order-fulfillment.flowspec.yaml
```

Expected output:
```yaml
info:
  title: "Order Fulfillment Flow"
  version: "1.0"

services:
  order-svc:
    spec: "./order-service.servicespec.yaml"
  inventory-svc:
    spec: "./inventory-service.servicespec.yaml"
  payment-svc:
    spec: "./payment-service.servicespec.yaml"

flow:
  - step: "create-order"
    call: "order-svc.create-order"
    output:
      orderId: "response.body.orderId"

  - step: "reserve-items"
    call: "inventory-svc.reserve-items"
    input:
      orderId: "${orderId}"

  - step: "charge-payment"
    call: "payment-svc.charge-payment"
    input:
      orderId: "${orderId}"

  - step: "confirm-order"
    call: "order-svc.confirm-order"
    input:
      orderId: "${orderId}"
```

### Step 4: Validate Contracts (Atlas Proof)

Now validate your contracts against the execution trace:

```bash
# Perform validation
choreoatlas validate --flow contracts/order-fulfillment.flowspec.yaml \
           --trace traces/order-trace.json \
           --report-format html --report-out reports/validation-report.html

# Check results
ls -la reports/
# Open reports/validation-report.html in your browser
```

### Step 5: Static Analysis (Atlas Pilot)

Run static checks on your contracts:

```bash
# Lint the flow specification
choreoatlas lint --flow contracts/order-fulfillment.flowspec.yaml

# Expected output:
# ✓ FlowSpec syntax is valid
# ✓ All service references are resolved
# ✓ Variable dependencies are correct
# ✓ All preconditions are satisfiable
```

### Step 6: CI Integration

For automated validation in CI/CD pipelines:

```bash
# Combined lint + validate for CI gates
choreoatlas ci-gate --flow contracts/order-fulfillment.flowspec.yaml \
          --trace traces/order-trace.json
```

## 📊 Understanding Validation Reports

The HTML report provides comprehensive insights:

### Coverage Analysis
- **Step Coverage**: Which orchestration steps were exercised
- **Service Coverage**: Which services participated
- **Condition Coverage**: Which pre/post conditions were validated

### Validation Results
- **✅ Passed Steps**: Steps that matched expected behavior
- **❌ Failed Steps**: Steps that violated contracts
- **⚠️ Warnings**: Potential issues or missing data

### Temporal Analysis
- **Sequence Validation**: Correct order of service calls
- **Dependency Checking**: Variable flow between steps
- **Timing Analysis**: Duration and latency insights

## 🛠️ Common Customizations

### Configuration File

Create `.choreoatlas.yaml` in your project root:

```yaml
# Default edition
edition: ce

# Report settings
reports:
  format: html
  output: ./reports

# Coverage thresholds
coverage:
  threshold: 85

# Service specifications directory
services:
  directory: ./contracts/services

# Validation settings
validation:
  strict: true
  timeout: 30s
```

### Environment Variables

```bash
# Set default edition
export CHOREOATLAS_EDITION=ce

# Disable telemetry (Pro versions)
export CHOREOATLAS_TELEMETRY=0

# Custom config location
export CHOREOATLAS_CONFIG=./custom-config.yaml
```

## 🚨 Troubleshooting

### Common Issues

**Issue**: `FlowSpec file not found`
```bash
# Solution: Check file path
ls -la contracts/
ca lint --flow ./contracts/order-fulfillment.flowspec.yaml
```

**Issue**: `Service reference cannot be resolved`
```bash
# Solution: Verify ServiceSpec files exist
ls -la contracts/*servicespec.yaml
```

**Issue**: `Validation failed - step not found in trace`
```bash
# Solution: Check trace format and step names
ca validate --verbose --flow contracts/order-fulfillment.flowspec.yaml \
           --trace traces/order-trace.json
```

**Issue**: `Permission denied` (Docker)
```bash
# Solution: Fix volume permissions
docker run --rm -v $(pwd):/workspace -u $(id -u):$(id -g) \
  choreoatlas/cli:latest validate --flow /workspace/contracts/order-fulfillment.flowspec.yaml
```

## 🎓 Next Steps

Now that you've completed the getting started guide:

1. **📖 Explore Advanced Features**: Learn about [basic usage patterns](/guide/basic-usage)
2. **🔧 Configure Your Environment**: Set up [advanced configuration](/guide/advanced-config)
3. **⚙️ CI/CD Integration**: Implement [continuous validation](/guide/ci-integration)
4. **🏢 Enterprise Features**: Discover [Pro edition capabilities](/guide/enterprise-features)

## 💬 Need Help?

- **📚 Documentation**: Browse the complete [CLI reference](/api/cli-commands)
- **🐛 Issues**: Report bugs on [GitHub Issues](https://github.com/choreoatlas2025/cli/issues)
- **💬 Discussions**: Join the [GitHub Discussions](https://github.com/choreoatlas2025/cli/discussions)
- **🏢 Enterprise Support**: Contact [sales@choreoatlas.com](mailto:sales@choreoatlas.com)

---

Congratulations! You've successfully set up ChoreoAtlas CLI and completed your first contract validation workflow. 🎉
