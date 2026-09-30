# Basic Usage

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta**; commands and flags may evolve.
:::

This page summarises the everyday commands you will run after completing the quickstart.

## Alias recap

Use the pinned Docker beta image without a local installation:

```bash
alias choreoatlas='docker run --rm --user $(id -u):$(id -g) -v $(pwd):/workspace -w /workspace choreoatlas/cli:0.2.0-ce.beta.1'
```

## Lint a FlowSpec

```bash
choreoatlas lint --flow contracts/flows/order-flow.graph.flowspec.yaml --schema=false
```

This command checks the graph structure but skips JSON Schema validation. The current beta's bundled schema does not accept every field in the quickstart's curated graph example. Do not treat this command as full schema validation. The [verified quickstart](/guide/getting-started) uses `make demo` to generate actual validation reports.

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

## Reproduce both sample reports

```bash
make demo
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
