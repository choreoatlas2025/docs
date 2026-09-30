# Getting Started

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Features and APIs may change as we continue to improve the product.
:::

This guide runs the published Community Edition beta against two prerecorded sample traces. It creates one passing report and one expected failure report so you can inspect what the CLI actually checks.

## Prerequisites

- Docker and Make
- Git (to clone the quickstart demo)
- Familiarity with basic shell commands

## Run the verified sample

```bash
git clone https://github.com/choreoatlas2025/quickstart-demo.git
cd quickstart-demo
make demo
```

The repository contains sample FlowSpec/ServiceSpec files and traces under `contracts/` and `traces/`. The command uses the pinned `choreoatlas/cli:0.2.0-ce.beta.1` Docker image and writes two real CLI reports:

- `reports/successful-order-report.html`: five flow steps pass in the supplied successful order trace.
- `reports/failed-payment-report.html`: the supplied failed payment trace fails the gate, as expected.

Open both reports locally. Some input preconditions show `SKIP` because the sample trace lacks those input fields. A passing flow result does not mean every condition was evaluated.

## Inspect the CLI commands

The demo runs `discover` and `validate`. To run a command yourself from inside `quickstart-demo`, create this alias in an interactive shell:

```bash
alias choreoatlas='docker run --rm --user $(id -u):$(id -g) -v $(pwd):/workspace -w /workspace choreoatlas/cli:0.2.0-ce.beta.1'
```

> Prefer installers? Download binaries from [GitHub Releases](https://github.com/choreoatlas2025/cli/releases) instead of using Docker.

### Discover contracts from a trace

```bash
choreoatlas discover   --trace traces/successful-order.trace.json   --out contracts/flows/order-flow.discovered.flowspec.yaml   --out-services contracts/services.discovered
```

Review the generated files and compare them with the curated sample (`contracts/flows/order-flow.graph.flowspec.yaml`). The current beta's bundled lint schema does not accept every field in this curated graph example, so this guide uses the verified validation path rather than presenting lint as a prerequisite.

### Validate against a trace

```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format html --report-out reports/validation-report.html
```

Add a machine-readable format if needed:
```bash
choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml   --trace traces/successful-order.trace.json   --report-format json --report-out reports/validation-report.json
```

## Read the results

- `reports/validation-report.html` – timeline, coverage, and gate status
- Optional `reports/validation-report.json` – structured data for automation
- Report details – PASS/FAIL/SKIP for each step and condition

Open the HTML report locally (for example `open reports/validation-report.html` on macOS or `xdg-open` on Linux).

## Next steps

- **CI Integration:** run the same `make demo` command in a pipeline ([guide/ci-integration](/guide/ci-integration)).
- **Trace Conversion:** convert Jaeger/OTLP traces into the CE internal format ([guide/trace-conversion](/guide/trace-conversion)).

You are now ready to apply ChoreoAtlas CLI to your own traces or extend the quickstart demo.
