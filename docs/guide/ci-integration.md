# CI Integration

Automate contract linting and validation inside your pipelines. The example below uses GitHub Actions, but the same steps apply to Jenkins, GitLab CI, or any runner that can execute shell commands.

## GitHub Actions example

```yaml
name: ChoreoAtlas Validate
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Alias ChoreoAtlas via Docker
        run: echo "alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'" >> $BASH_ENV

      - name: CI gate (lint + validate)
        run: |
          source $BASH_ENV
          choreoatlas ci-gate \
            --flow contracts/flows/order-flow.graph.flowspec.yaml \
            --trace traces/successful-order.trace.json

      - name: Generate reports
        run: |
          source $BASH_ENV
          choreoatlas validate \
            --flow contracts/flows/order-flow.graph.flowspec.yaml \
            --trace traces/successful-order.trace.json \
            --report-format junit --report-out reports/junit.xml
          choreoatlas validate \
            --flow contracts/flows/order-flow.graph.flowspec.yaml \
            --trace traces/successful-order.trace.json \
            --report-format html --report-out reports/report.html

      - uses: actions/upload-artifact@v4
        with:
          name: choreoatlas-reports
          path: reports/
```

### Key points

- The Docker alias ensures the CLI is always up to date without installing binaries on the runner.
- `choreoatlas ci-gate` combines lint + validate and exits non-zero on failure (useful for PR checks).
- Additional `choreoatlas validate` commands produce HTML/JUnit reports that can be uploaded as artifacts.
- Customize thresholds or baselines with `--threshold-*` and `--baseline` flags.

### Other CI platforms

For other CI systems, run the same commands in your pipeline steps. Ensure the working directory contains:

- `contracts/flows/*.flowspec.yaml`
- `traces/*.trace.json`
- Optional `contracts/services/` or discovered specs generated during the pipeline

Artifacts (HTML/JUnit/JSON) can be published through the platform-specific upload mechanisms.
