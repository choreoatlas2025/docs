# 基础用法

::: warning Beta 版本
ChoreoAtlas CLI 目前处于 **Beta** 状态。使用方式和命令可能会发生变化。
:::

本指南将介绍 ChoreoAtlas CLI 的基本使用方法，包括核心概念、典型工作流程和实际示例。

## 核心概念

### 双契约架构

ChoreoAtlas CLI 采用双契约验证架构：

- **ServiceSpec** (`.servicespec.yaml`) - 服务级契约，定义单个服务操作的前置和后置条件
- **FlowSpec** (`.flowspec.yaml`) - 编排级契约，定义跨服务的流程步骤和数据流转

### Atlas 组件家族

- **Atlas Scout** (`ca discover`) - 从追踪中探索和生成契约
- **Atlas Proof** (`ca validate`) - 验证契约与执行追踪的匹配性
- **Atlas Pilot** (`ca lint`) - 静态验证和指导

## 典型工作流程

### 1. 探索阶段：从追踪生成契约

首先从实际的执行追踪中发现服务交互模式：

```bash
# 从生产环境追踪发现服务契约
ca discover --trace production-trace.json --output ./contracts/
```

这会生成：
- `order-service.servicespec.yaml` - 订单服务契约
- `payment-service.servicespec.yaml` - 支付服务契约
- `inventory-service.servicespec.yaml` - 库存服务契约
- `order-fulfillment.flowspec.yaml` - 订单履约流程契约

### 2. 验证阶段：静态检查

对生成的契约进行静态分析：

```bash
# 检查流程契约的语法和逻辑
ca lint --flow ./contracts/order-fulfillment.flowspec.yaml

# 启用严格模式检查
ca lint --flow ./contracts/order-fulfillment.flowspec.yaml --strict
```

输出示例：
```
✓ FlowSpec syntax is valid
✓ All service references are resolved
✓ Variable dependencies are correct
⚠ Warning: Step 'validate-payment' has no error handling
✓ All preconditions are satisfiable
```

### 3. 校验阶段：动态验证

使用实际追踪验证契约：

```bash
# 基本验证
ca validate --flow ./contracts/order-fulfillment.flowspec.yaml \
           --trace test-execution.json \
           --edition ce

# 生成详细 HTML 报告
ca validate --flow ./contracts/order-fulfillment.flowspec.yaml \
           --trace test-execution.json \
           --edition ce \
           --report html \
           --output ./reports/
```

验证报告包括：
- 步骤覆盖率分析
- 时序验证结果
- 前置/后置条件检查
- 变量传递验证

## 契约文件示例

### ServiceSpec 示例

```yaml
# order-service.servicespec.yaml
service: "order-service"
version: "1.0"

operations:
  - operationId: "create-order"
    description: "创建新订单"
    preconditions:
      user-authenticated: "request.headers.authorization != ''"
      valid-items: "size(request.body.items) > 0"
    postconditions:
      order-created: "response.status == 201"
      order-id-returned: "response.body.orderId != ''"

  - operationId: "get-order"
    description: "获取订单详情"
    preconditions:
      valid-order-id: "request.path.orderId matches '^[0-9]+$'"
    postconditions:
      order-found: "response.status in [200, 404]"
      valid-response: "response.status == 200 ? response.body.id != '' : true"
```

### FlowSpec 示例

```yaml
# order-fulfillment.flowspec.yaml
info:
  title: "订单履约流程"
  version: "1.0"
  description: "完整的电商订单处理流程"

services:
  order-svc:
    spec: "./order-service.servicespec.yaml"
  payment-svc:
    spec: "./payment-service.servicespec.yaml"
  inventory-svc:
    spec: "./inventory-service.servicespec.yaml"

flow:
  - step: "create-order"
    call: "order-svc.create-order"
    input:
      userId: "${user.id}"
      items: "${cart.items}"
    output:
      orderId: "response.body.orderId"
      orderTotal: "response.body.total"

  - step: "reserve-inventory"
    call: "inventory-svc.reserve-items"
    input:
      orderId: "${orderId}"
      items: "${cart.items}"
    output:
      reservationId: "response.body.reservationId"

  - step: "process-payment"
    call: "payment-svc.charge-card"
    input:
      amount: "${orderTotal}"
      orderId: "${orderId}"
    output:
      paymentId: "response.body.paymentId"
      paymentStatus: "response.body.status"

  - step: "confirm-order"
    call: "order-svc.confirm-order"
    input:
      orderId: "${orderId}"
      paymentId: "${paymentId}"
    condition: "${paymentStatus == 'success'}"
```

## 追踪文件格式

### 基本 JSON 追踪格式

```json
{
  "spans": [
    {
      "name": "create-order",
      "service": "order-service",
      "timestamp": "2025-01-15T10:00:00Z",
      "duration": "45ms",
      "tags": {
        "http.method": "POST",
        "http.url": "/orders",
        "http.status_code": "201"
      }
    },
    {
      "name": "reserve-items",
      "service": "inventory-service",
      "timestamp": "2025-01-15T10:00:01Z",
      "duration": "23ms",
      "parent": "create-order"
    }
  ]
}
```

## 常见使用场景

### 场景 1：新服务集成验证

```bash
# 发现新服务的契约
ca discover --trace integration-test-trace.json --output ./new-service/

# 验证新服务是否符合现有流程
ca validate --flow existing-flow.flowspec.yaml \
           --trace integration-trace.json \
           --edition ce
```

### 场景 2：回归测试

```bash
# 在 CI/CD 中验证变更不会破坏契约
ca ci-gate --flow order-flow.flowspec.yaml \
          --trace regression-trace.json \
          --edition ce \
          --fail-on-coverage 90 \
          --report-dir ./ci-reports/
```

### 场景 3：生产环境监控

```bash
# 定期验证生产追踪与契约的匹配性
ca validate --flow production-flow.flowspec.yaml \
           --trace daily-sample.json \
           --edition profree \
           --baseline production-baseline.json
```

## 报告和输出

### HTML 报告

生成的 HTML 报告包含：
- 执行摘要和覆盖率
- 步骤级验证详情
- 失败原因和建议
- 时序图和流程可视化

### JSON 报告

适用于程序化分析的结构化报告：

```json
{
  "summary": {
    "total_steps": 4,
    "passed_steps": 3,
    "failed_steps": 1,
    "coverage": 75.0
  },
  "steps": [
    {
      "name": "create-order",
      "status": "passed",
      "preconditions": {"all": "passed"},
      "postconditions": {"all": "passed"}
    }
  ]
}
```

### JUnit 报告

用于 CI/CD 集成的测试结果格式：

```xml
<testsuite name="ChoreoAtlas Validation" tests="4" failures="1">
  <testcase name="create-order" classname="order-fulfillment"/>
  <testcase name="reserve-inventory" classname="order-fulfillment"/>
  <testcase name="process-payment" classname="order-fulfillment">
    <failure message="Postcondition failed: payment.status == 'success'"/>
  </testcase>
</testsuite>
```

## 配置和定制

### 配置文件

创建 `.choreoatlas.yaml` 配置文件：

```yaml
# 默认设置
edition: ce
reports:
  format: html
  output: ./reports

# 覆盖率阈值
coverage:
  threshold: 85

# 服务目录
services:
  directory: ./contracts/services

# 严格模式
lint:
  strict: true

# 输出控制
output:
  verbose: false
  color: true
```

### 环境变量

```bash
# 设置默认版本
export CHOREOATLAS_EDITION=ce

# 禁用遥测（Pro 版本）
export CHOREOATLAS_TELEMETRY=0

# 自定义配置文件
export CHOREOATLAS_CONFIG=./custom-config.yaml
```

## 故障排查

### 常见错误

**契约文件未找到**
```bash
Error: FlowSpec file not found: order-flow.flowspec.yaml
Solution: 检查文件路径是否正确
```

**服务引用无法解析**
```bash
Error: Service reference 'payment-svc' cannot be resolved
Solution: 确保 ServiceSpec 文件存在且路径正确
```

**验证失败**
```bash
Error: Step 'process-payment' failed validation
Reason: Postcondition 'payment-successful' not satisfied
Solution: 检查追踪数据或调整契约条件
```

### 调试技巧

```bash
# 启用详细输出
ca validate --flow order.flowspec.yaml --trace order.json --verbose

# 生成调试信息
ca lint --flow order.flowspec.yaml --format json > debug.json

# 检查特定步骤
ca validate --flow order.flowspec.yaml --trace order.json --steps "create-order,process-payment"
```

## 下一步

- 了解 [版本功能差异](/guide/editions)
- 查看 [高级配置](/guide/advanced-config)
- 学习 [CI/CD 集成](/guide/ci-integration)
- 探索 [企业功能](/guide/enterprise-features)