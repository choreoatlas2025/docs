# CI 集成

将契约的 lint 与 validate 放入流水线，实现持续的编排校验。下面示例基于 GitHub Actions，其它平台（Jenkins、GitLab CI 等）同样适用。

## GitHub Actions 示例

```yaml
name: ChoreoAtlas Validate
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: 通过 Docker 创建别名
        run: echo "alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'" >> $BASH_ENV

      - name: CI gate（lint + validate）
        run: |
          source $BASH_ENV
          choreoatlas ci-gate \
            --flow contracts/flows/order-flow.graph.flowspec.yaml \
            --trace traces/successful-order.trace.json

      - name: 生成报告
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

### 关键说明

- Docker 别名保证在运行器上无需安装本地二进制即可使用最新 CLI。
- `choreoatlas ci-gate` 组合 lint + validate，若失败会返回非零退出码（适合 PR 校验）。
- 追加的 `choreoatlas validate` 命令生成 HTML / JUnit 报告，适合作为构建产物上传。
- 可通过 `--threshold-*`、`--baseline` 系列参数配置阈值或基线策略。

### 其它 CI 平台

在其它 CI 系统中，只需在流水线步骤内执行同样的命令。确保工作目录包含：

- `contracts/flows/*.flowspec.yaml`
- `traces/*.trace.json`
- （可选）`contracts/services/` 或运行时生成的 ServiceSpec

生成的 HTML / JUnit / JSON 报告可通过平台各自的产物上传机制发布。
