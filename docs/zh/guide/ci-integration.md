# CI 集成

公开的 quickstart 仓库已经在 GitHub Actions 中运行两份示例追踪。先复用该仓库已验证的工作流，再替换为自己的契约和追踪。

## GitHub Actions 示例

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

### 关键说明

- 该工作流适用于 [quickstart-demo 仓库](https://github.com/choreoatlas2025/quickstart-demo)，其中包含 `make demo` 和全部示例文件。
- 命令固定使用 CE Beta 镜像，生成一份通过和一份预期失败的 HTML 报告。
- 改用于自己的仓库前，请替换示例追踪，并检查报告中所有 `FAIL` 和 `SKIP` 条件。

### 其它 CI 平台

在其它 CI 系统中，可从 quickstart 仓库运行 `make demo`。迁移到自己的仓库时，确保工作目录包含：

- `contracts/flows/*.flowspec.yaml`
- `traces/*.trace.json`
- （可选）`contracts/services/` 或运行时生成的 ServiceSpec

生成的 HTML / JUnit / JSON 报告可通过平台各自的产物上传机制发布。
