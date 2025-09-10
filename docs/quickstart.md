---
sidebar_position: 3
---

# 快速开始

通过这个 15 分钟的快速指南，您将学会使用 ChoreoAtlas CLI 的核心功能：从追踪数据发现契约、验证服务编排、生成分析报告。

## 🎯 学习目标

完成本指南后，您将能够：
- 从追踪数据自动生成 ServiceSpec + FlowSpec 契约
- 验证微服务编排的正确性
- 生成并理解 HTML 验证报告
- 集成到 CI/CD 流水线

## 🚀 方式一：Quickstart Demo（推荐）

最快的体验方式是使用我们准备的完整演示：

```bash
# 克隆演示仓库
git clone https://github.com/choreoatlas2025/quickstart-demo.git
cd quickstart-demo

# 一键运行完整演示
make demo
```

这将自动执行：
1. 📊 从预录制的追踪生成 ServiceSpec + FlowSpec 契约
2. ✅ 验证成功和失败两种场景
3. 🌐 生成精美的 HTML 验证报告
4. 自动打开报告查看结果

<div className="callout success">
  <p><strong>🎉 就这么简单！</strong></p>
  <p>如果您看到了 HTML 报告显示验证通过，说明 ChoreoAtlas 已经成功运行。现在让我们深入了解每个步骤的细节。</p>
</div>

## 📋 方式二：手动步骤详解

如果您想了解每个命令的具体作用，可以按照以下步骤手动执行：

### 步骤 1: 准备追踪数据

ChoreoAtlas 需要 OpenTelemetry/Jaeger 格式的追踪数据作为输入：

```json title="successful-order.json"
{
  "traceID": "1a2b3c4d5e6f7890abcdef1234567890",
  "spans": [
    {
      "spanID": "1234567890abcdef",
      "operationName": "GET /catalogue",
      "startTime": 1694787600000000,
      "duration": 45000,
      "tags": {
        "http.method": "GET",
        "http.status_code": 200
      },
      "process": {
        "serviceName": "catalogue"
      }
    }
    // ... 更多 spans
  ]
}
```

### 步骤 2: 发现契约

使用 `discover` 命令从追踪数据中自动生成契约：

<div className="cli-example">

```bash
# 从追踪发现 ServiceSpec + FlowSpec 契约
choreoatlas discover \
  --trace traces/successful-order.json \
  --out-servicespec contracts/services/ \
  --out-flowspec contracts/flows/order-flow.flowspec.yaml \
  --format yaml
```

</div>

输出结果：
```
🔍 Analyzing trace data...
✅ Discovered 5 services: catalogue, cart, orders, payment, shipping  
✅ Generated ServiceSpec contracts in contracts/services/
✅ Generated FlowSpec: contracts/flows/order-flow.flowspec.yaml
📊 Flow analysis: 5 steps, 280ms total duration
```

### 步骤 3: 检查生成的契约

查看自动生成的 ServiceSpec 契约：

```yaml title="contracts/services/catalogue.servicespec.yaml"
apiVersion: servicespec.choreoatlas.io/v1
kind: ServiceSpec
service: "catalogue"

operations:
  - operationId: "getCatalogue"
    description: "Retrieve product catalogue"
    method: GET
    path: "/catalogue"
    preconditions:
      "service_available": "true"
    postconditions:
      "response_ok": "response.status == 200"
      "has_products": "size(response.body) > 0"
```

查看生成的 FlowSpec 编排契约：

```yaml title="contracts/flows/order-flow.flowspec.yaml"
apiVersion: flowspec.choreoatlas.io/v1
kind: FlowSpec
info:
  title: "订单履行流程"

services:
  catalogue:
    spec: "../services/catalogue.servicespec.yaml"

flow:
  - step: "浏览商品目录"
    call: "catalogue.getCatalogue"
    output:
      products: "response.body"
    
  - step: "添加到购物车"
    call: "cart.addToCart"
    depends_on: ["浏览商品目录"]
```

### 步骤 4: 验证编排

使用 `validate` 命令验证实际执行是否符合契约：

<div className="cli-example">

```bash
# 验证追踪与契约的匹配
choreoatlas validate \
  --servicespec contracts/services/ \
  --flowspec contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.json \
  --report-html reports/validation-report.html \
  --edition ce
```

</div>

输出结果：
```
✅ ServiceSpec validation: 5/5 services passed
✅ FlowSpec validation: All 5 steps executed correctly
✅ Temporal ordering: No violations detected
✅ Coverage: 100% of service interactions validated
📊 Generated report: reports/validation-report.html
```

### 步骤 5: 查看验证报告

在浏览器中打开生成的 HTML 报告，您将看到：

- **验证摘要**: 总体通过/失败状态
- **服务分析**: 每个服务的契约遵循情况
- **流程时间线**: 步骤执行的时序关系
- **覆盖率指标**: 验证的完整性统计
- **错误分析**: 任何违反契约的详细信息

## 🔧 实际项目集成

### 从现有追踪系统导出

如果您已经有 Jaeger、Zipkin 或其他追踪系统：

```bash
# 从 Jaeger 导出追踪
curl "http://jaeger:16686/api/traces/your-trace-id" > your-trace.json

# 从 Zipkin 导出追踪  
curl "http://zipkin:9411/api/v2/trace/your-trace-id" > your-trace.json

# 生成契约
choreoatlas discover --trace your-trace.json --out-servicespec ./contracts/services/
```

### 设置 CI/CD 验证

在您的 `.github/workflows/validate.yml` 中添加：

```yaml title=".github/workflows/validate.yml"
name: Service Choreography Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Install ChoreoAtlas CLI
      run: |
        curl -L https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-linux-amd64.tar.gz | tar xz
        sudo mv choreoatlas /usr/local/bin/
    
    - name: Validate Choreography
      run: |
        choreoatlas validate \
          --servicespec contracts/services/ \
          --flowspec contracts/flows/order-flow.flowspec.yaml \
          --trace traces/integration-test.json \
          --report-junit reports/junit.xml \
          --edition ce
    
    - name: Upload Reports
      uses: actions/upload-artifact@v4
      with:
        name: validation-reports
        path: reports/
```

## 📊 理解验证结果

### 成功验证

当所有检查都通过时，您会看到：

<div className="callout success">
  <p><strong>✅ 验证通过</strong></p>
  <ul>
    <li>所有服务遵守 ServiceSpec 契约</li>
    <li>编排步骤按 FlowSpec 定义的顺序执行</li>
    <li>没有检测到时序违规或因果关系错误</li>
    <li>服务交互覆盖率达到预期阈值</li>
  </ul>
</div>

### 验证失败

当检测到契约违规时，报告会显示：

<div className="callout warning">
  <p><strong>⚠️ 检测到违规</strong></p>
  <ul>
    <li><strong>服务契约违规</strong>: 响应不符合 postconditions</li>
    <li><strong>时序错误</strong>: 步骤执行顺序与 FlowSpec 不符</li>
    <li><strong>依赖缺失</strong>: 缺少必需的服务调用</li>
    <li><strong>覆盖率不足</strong>: 部分服务交互未被验证</li>
  </ul>
</div>

## 💡 最佳实践

### 1. 渐进式采用

```bash
# 开始时先为核心服务生成契约
choreoatlas discover --trace critical-path.json --out-servicespec ./core-services/

# 逐步扩展到更多服务和流程
choreoatlas discover --trace full-flow.json --out-servicespec ./all-services/
```

### 2. 版本管理

```bash
# 为契约文件设置版本标签
git tag contracts-v1.0.0

# 在 CI 中验证契约兼容性
choreoatlas validate --baseline contracts-v1.0.0/ --current ./contracts/
```

### 3. 质量门禁

```bash
# 设置覆盖率阈值
choreoatlas validate \
  --coverage-threshold 80 \
  --max-duration 5s \
  --success-rate 0.99
```

## 🎓 下一步学习

现在您已经掌握了基本用法，继续深入学习：

1. **[ServiceSpec 详解](./servicespec/overview)** - 学习编写精确的服务契约
2. **[FlowSpec 详解](./flowspec/overview)** - 掌握复杂编排的建模
3. **[报告分析](./reports/html-reports)** - 深度解读验证报告
4. **[CI/CD 集成](./ci-cd/github-actions)** - 完整的自动化设置

## ❓ 常见问题

**Q: 追踪数据从哪里来？**
A: 从 Jaeger、Zipkin、OpenTelemetry Collector，或任何支持 OTLP 格式的追踪系统导出。

**Q: 可以验证部分流程吗？**
A: 是的，ChoreoAtlas 支持部分验证和增量覆盖率分析。

**Q: 如何处理敏感数据？**
A: 使用 Pro Privacy 版本，确保零遥测和完全离线运行，或使用数据脱敏功能。

---

<div className="callout info">
  <p><strong>🚀 准备好了吗？</strong></p>
  <p>现在您已经完成了快速入门，可以在真实项目中开始使用 ChoreoAtlas 了。记住，最好的学习方式就是实践！</p>
</div>