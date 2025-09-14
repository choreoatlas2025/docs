# CLI 命令参考

::: warning Beta 版本
ChoreoAtlas CLI 目前处于 **Beta** 状态。命令和选项可能会随着接口的优化而发生变化。
:::

ChoreoAtlas CLI (`ca`) 提供了一套完整的命令来管理和验证服务契约。

## 核心命令

### `ca discover` - Atlas Scout (发现)

从执行追踪中发现并生成初始契约。

```bash
ca discover --trace <追踪文件> [选项]
```

**选项:**
- `--trace <文件>` - 输入追踪文件路径 (JSON 格式)
- `--output <目录>` - 输出契约文件的目录 (默认: `./services/`)
- `--format <格式>` - 输出格式: `yaml` 或 `json` (默认: `yaml`)

**示例:**
```bash
# 从追踪生成 ServiceSpec 和 FlowSpec
ca discover --trace examples/traces/order-flow.json --output ./contracts/

# 指定输出格式
ca discover --trace order.json --format json --output ./specs/
```

### `ca validate` - Atlas Proof (校验)

验证 FlowSpec 与实际执行追踪的匹配性。

```bash
ca validate --flow <流程文件> --trace <追踪文件> [选项]
```

**选项:**
- `--flow <文件>` - FlowSpec 规约文件路径
- `--trace <文件>` - 执行追踪文件路径
- `--edition <版本>` - 产品版本: `ce`, `profree`, `proprivacy`, `cloud`
- `--report <格式>` - 报告格式: `html`, `json`, `junit` (默认: `html`)
- `--output <目录>` - 报告输出目录 (默认: `./reports/`)
- `--baseline <文件>` - 基线文件路径 (Pro+ 版本)
- `--coverage-threshold <百分比>` - 覆盖率阈值 (默认: 80)

**示例:**
```bash
# 基本验证
ca validate --flow order.flowspec.yaml --trace order-trace.json --edition ce

# 生成 JUnit 格式报告
ca validate --flow order.flowspec.yaml --trace order-trace.json --report junit --output ./ci-reports/

# Pro 版本的基线验证
ca validate --flow order.flowspec.yaml --trace order-trace.json --edition profree --baseline baseline.json
```

### `ca lint` - Atlas Pilot (指导)

对 FlowSpec 和 ServiceSpec 进行静态分析和验证。

```bash
ca lint --flow <流程文件> [选项]
```

**选项:**
- `--flow <文件>` - FlowSpec 规约文件路径
- `--services <目录>` - ServiceSpec 文件目录 (默认: `./services/`)
- `--strict` - 启用严格模式检查
- `--format <格式>` - 输出格式: `text`, `json` (默认: `text`)

**示例:**
```bash
# 基本语法检查
ca lint --flow order.flowspec.yaml

# 严格模式检查
ca lint --flow order.flowspec.yaml --strict

# JSON 格式输出
ca lint --flow order.flowspec.yaml --format json
```

### `ca ci-gate` - CI 门禁

组合 lint 和 validate 操作的 CI/CD 集成命令。

```bash
ca ci-gate --flow <流程文件> --trace <追踪文件> [选项]
```

**选项:**
- `--flow <文件>` - FlowSpec 规约文件路径
- `--trace <文件>` - 执行追踪文件路径
- `--edition <版本>` - 产品版本
- `--fail-on-coverage <百分比>` - 覆盖率低于阈值时失败
- `--fail-on-lint` - lint 检查失败时退出
- `--report-dir <目录>` - 报告输出目录

**示例:**
```bash
# CI 管道中的完整检查
ca ci-gate --flow order.flowspec.yaml --trace order-trace.json --edition ce --fail-on-coverage 85
```

## 企业功能命令 (Pro+ 版本)

### `ca baseline` - 基线管理

管理验证基线和趋势分析。

```bash
ca baseline <子命令> [选项]
```

**子命令:**
- `create` - 创建新基线
- `update` - 更新现有基线
- `compare` - 比较验证结果与基线
- `trend` - 生成趋势分析报告

**示例:**
```bash
# 创建基线
ca baseline create --flow order.flowspec.yaml --trace baseline-trace.json --output baseline.json

# 趋势比较
ca baseline compare --current results.json --baseline baseline.json
```

### `ca policy` - 策略管理

管理组织级验证策略和规则。

```bash
ca policy <子命令> [选项]
```

**子命令:**
- `validate` - 验证策略文件
- `apply` - 应用策略到项目
- `list` - 列出可用策略

### `ca audit` - 审计日志

生成和导出审计日志。

```bash
ca audit export --format <格式> --output <文件> [选项]
```

## 全局选项

所有命令都支持以下全局选项:

- `--config <文件>` - 指定配置文件路径
- `--verbose` - 启用详细输出
- `--quiet` - 静默模式
- `--no-color` - 禁用彩色输出
- `--help` - 显示帮助信息
- `--version` - 显示版本信息

## 配置文件

ChoreoAtlas CLI 支持 YAML 配置文件 (默认: `.choreoatlas.yaml`):

```yaml
# .choreoatlas.yaml
edition: ce
reports:
  format: html
  output: ./reports
coverage:
  threshold: 80
services:
  directory: ./services
policies:
  directory: ./policies
```

## 环境变量

- `CHOREOATLAS_EDITION` - 默认产品版本
- `CHOREOATLAS_CONFIG` - 配置文件路径
- `CHOREOATLAS_TELEMETRY` - 遥测开关 (`0` 禁用，`1` 启用)
- `CHOREOATLAS_NO_COLOR` - 禁用彩色输出

## 退出码

- `0` - 成功
- `1` - 一般错误
- `2` - 配置错误
- `3` - 验证失败
- `4` - 覆盖率不达标
- `5` - 基线偏差过大

## 示例工作流

### 完整的契约驱动开发流程

```bash
# 1. 从追踪发现契约
ca discover --trace production-trace.json --output ./contracts/

# 2. 静态验证契约
ca lint --flow ./contracts/order-fulfillment.flowspec.yaml

# 3. 动态验证契约
ca validate --flow ./contracts/order-fulfillment.flowspec.yaml \
           --trace test-trace.json \
           --edition ce \
           --report html

# 4. CI 门禁集成
ca ci-gate --flow ./contracts/order-fulfillment.flowspec.yaml \
          --trace integration-trace.json \
          --edition ce \
          --fail-on-coverage 90
```

## 获取帮助

```bash
# 查看所有命令
ca --help

# 查看特定命令帮助
ca validate --help

# 查看版本信息
ca --version
```