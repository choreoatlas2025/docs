# CI Integration

The public quickstart repository runs its verified two-trace demo in GitHub Actions. Start with that exact workflow before adapting the files and commands to your own traces.

## GitHub Actions example

```yaml
name: ChoreoAtlas Validate
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run public quickstart
        run: make demo

      - name: Upload real CLI reports
        uses: actions/upload-artifact@v4
        with:
          name: choreoatlas-reports
          path: reports/
```

### Key points

- This workflow belongs in the [quickstart-demo repository](https://github.com/choreoatlas2025/quickstart-demo), where `make demo` and the example files are present.
- `make demo` invokes the pinned Community Edition beta image. It expects one passing trace and one failed payment trace, then saves both HTML reports.
- When adapting the workflow to your own repository, replace the sample traces and inspect all `FAIL` and `SKIP` conditions before using a report as a release gate.

### Other CI platforms

For other CI systems, run `make demo` from the quickstart repository. When adapting it, ensure the working directory contains:

- `contracts/flows/*.flowspec.yaml`
- `traces/*.trace.json`
- Optional `contracts/services/` or discovered specs generated during the pipeline

Artifacts (HTML/JUnit/JSON) can be published through the platform-specific upload mechanisms.
