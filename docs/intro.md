---
sidebar_position: 1
slug: /
---

# 欢迎使用 ChoreoAtlas CLI

**Map, Verify, Steer cross-service choreography with contracts-as-code**

ChoreoAtlas CLI 是一个"契约即代码"的微服务编排治理平台，通过 **ServiceSpec + FlowSpec** 双契约体系，从真实追踪数据中生成可执行契约，在 CI/CD 和运行时验证服务级语义和编排级时序关系。

## 🎯 核心价值

<div className="row">
  <div className="col col--4">
    <div className="feature-card">
      <h3>🔍 从追踪到契约</h3>
      <p>自动从 OpenTelemetry、Jaeger、Zipkin 追踪数据中发现并生成 ServiceSpec + FlowSpec 双契约</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="feature-card">
      <h3>✅ 双层验证</h3>
      <p>ServiceSpec 验证服务级语义（CEL条件），FlowSpec 验证编排级时序、因果关系和 DAG 拓扑</p>
    </div>
  </div>
  <div className="col col--4">
    <div className="feature-card">
      <h3>🚪 CI/CD 门禁</h3>
      <p>在持续集成中验证服务编排，防止回归和变更风险，支持 GitHub Actions、GitLab CI 等</p>
    </div>
  </div>
</div>

## 📋 快速开始

### 安装 ChoreoAtlas CLI

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="homebrew" label="Homebrew (推荐)" default>

```bash
brew tap choreoatlas2025/tap
brew install choreoatlas
```

  </TabItem>
  <TabItem value="docker" label="Docker">

```bash
# 使用最新版本
docker run --rm choreoatlas/cli:latest version

# 创建别名便于使用
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'
```

  </TabItem>
  <TabItem value="binary" label="二进制下载">

访问 [GitHub Releases](https://github.com/choreoatlas2025/cli/releases) 下载适合您平台的二进制文件。

```bash
# Linux/macOS
curl -L https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-$(uname -s)-$(uname -m).tar.gz | tar xz
sudo mv choreoatlas /usr/local/bin/
```

  </TabItem>
</Tabs>

### 10分钟体验

直接使用我们准备的 Quickstart Demo：

```bash
git clone https://github.com/choreoatlas2025/quickstart-demo.git
cd quickstart-demo
make demo
```

这将会：
1. 🔍 **发现** - 从示例追踪生成 ServiceSpec + FlowSpec 契约
2. ✅ **验证** - 验证编排与执行追踪的匹配
3. 📊 **报告** - 生成并打开 HTML 验证报告

## 🏗️ 双契约架构

ChoreoAtlas 采用 **ServiceSpec + FlowSpec 双契约架构**，分离服务契约与编排契约的治理：

### ServiceSpec (服务契约)
定义单个服务的操作规约、前置条件和后置条件：

```yaml title="catalogue.servicespec.yaml"
apiVersion: servicespec.choreoatlas.io/v1
kind: ServiceSpec
service: "catalogue"

operations:
  - operationId: "getCatalogue"
    method: GET
    path: "/catalogue"
    preconditions:
      "service_available": "true"
    postconditions:
      "response_ok": "response.status == 200"
      "has_products": "size(response.body) > 0"
```

### FlowSpec (流程契约)
定义跨服务编排的步骤序列、依赖关系和时序约束：

```yaml title="order-flow.flowspec.yaml"
apiVersion: flowspec.choreoatlas.io/v1
kind: FlowSpec
info:
  title: "订单履行流程"

services:
  catalogue:
    spec: "./services/catalogue.servicespec.yaml"
  cart:
    spec: "./services/cart.servicespec.yaml"

flow:
  - step: "浏览商品目录"
    call: "catalogue.getCatalogue"
    output:
      products: "response.body"
      
  - step: "添加到购物车"
    call: "cart.addToCart"
    depends_on: ["浏览商品目录"]
    input:
      itemId: "${selectedItemId}"
```

## 🎭 使用场景

### 1. 平台工程团队
- 建立微服务间的契约标准
- 自动化编排验证和门禁
- 防止服务接口变更引起的级联故障

### 2. SRE/可观测性团队
- 从现有追踪数据中提取治理规则
- 验证生产环境的编排健康度
- 建立服务依赖的基线和阈值

### 3. 质量保障团队
- 在 CI/CD 中集成编排验证
- 自动生成测试报告和覆盖率分析
- 跟踪服务契约的演进历史

## 🌟 版本对比

<div className="row">
  <div className="col col--6">
    <div className="feature-card">
      <h3><span className="edition-badge ce">CE</span> Community Edition</h3>
      <p><strong>完全免费</strong> - Apache 2.0 许可证</p>
      <ul>
        <li>ServiceSpec + FlowSpec 双契约验证</li>
        <li>HTML/JSON/JUnit 报告</li>
        <li>基线门禁和覆盖率分析</li>
        <li>CI 集成（GitHub Actions）</li>
        <li>零数据收集，完全本地运行</li>
      </ul>
    </div>
  </div>
  <div className="col col--6">
    <div className="feature-card">
      <h3><span className="edition-badge pro-free">Pro</span> Professional</h3>
      <p><strong>$19/用户/月</strong> - 企业级功能</p>
      <ul>
        <li>CE 版全部功能</li>
        <li>高级基线：趋势对比、历史回放</li>
        <li>组织级策略和私有规则库</li>
        <li>PR 检查 App 与通知集成</li>
        <li>可选匿名遥测（可关闭）</li>
      </ul>
    </div>
  </div>
</div>

## 🚀 下一步

1. **[安装 CLI](./installation)** - 选择适合的安装方式
2. **[快速开始](./quickstart)** - 15分钟完成第一个验证
3. **[ServiceSpec 指南](./servicespec/overview)** - 学习服务契约编写
4. **[FlowSpec 指南](./flowspec/overview)** - 掌握编排流程定义
5. **[CI/CD 集成](./ci-cd/github-actions)** - 设置自动化门禁

---

<div className="callout info">
  <p><strong>💡 提示</strong></p>
  <p>ChoreoAtlas 与 WSO2 Choreo 无任何关联。我们是独立的开源项目，专注于微服务编排的契约治理。</p>
</div>