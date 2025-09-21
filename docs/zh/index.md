---
layout: home

hero:
  name: ChoreoAtlas CLI
  text: 契约即代码编排
  tagline: 通过可执行契约映射、验证、指导跨服务编排
  image:
    src: /logo.svg
    alt: ChoreoAtlas CLI
  actions:
    - theme: brand
      text: 开始使用
      link: /zh/guide/getting-started
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/choreoatlas2025/cli

features:
  - icon: 🔍
    title: 服务级语义验证
    details: ServiceSpec 契约定义每个操作的前置条件和后置条件，实现基于 CEL 的语义验证，超越简单的模式检查。
  - icon: ⏱️
    title: 编排级时序验证  
    details: FlowSpec 契约定义步骤序列和数据流，实现对服务编排的时序、因果和 DAG 验证。
  - icon: 📊
    title: 真实追踪驱动验证
    details: 针对实际执行追踪（JSON/OTLP）验证契约，弥合设计与运行时行为之间的差距。
  - icon: 🚀
    title: CI/CD 集成
    details: 与持续集成管道无缝集成，实现自动化契约验证和治理。
  - icon: 🏗️
    title: Atlas 组件家族
    details: Scout（探索）、Proof（校验）、Pilot（指导）- 契约驱动开发的完整工具链。
  - icon: 📋
    title: 多版本支持
    details: 社区版（CE）、专业版（Pro）和云端版，满足不同团队和组织的需求。
---

::: warning Beta 版本
ChoreoAtlas CLI 目前处于 **Beta** 状态。我们持续改进产品，功能和 API 可能会发生变化。欢迎您的反馈和贡献！
:::

## 5 分钟极速上手

```bash
# 1）一行别名（无需本地安装）
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'

# 2）执行校验并生成 HTML 报告
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format html --report-out reports/validation-report.html
```

预期输出
- 每个编排步骤的 PASS/FAIL 行（例如 `[PASS] 创建订单`）
- `reports/validation-report.html`，包含时间线、覆盖率和 Gate 状态

提示
- 使用 [quickstart-demo](https://github.com/choreoatlas2025/quickstart-demo) 获得开箱即用的环境（`git clone … && make demo`）。
- 想了解完整流程，请继续阅读 [快速开始](/zh/guide/getting-started)，掌握探索 → 检查 → 校验的闭环。

## 支持版本

::: info 社区版 (CE)
**免费开源**
- ServiceSpec + FlowSpec 双契约
- 本地验证和检查
- 基础报告（HTML/JSON/JUnit）
- CI 集成示例
:::

::: tip 专业版 (Pro)
**高级功能**
- 高级基线和趋势分析
- 团队协作和治理
- Webhook 集成和通知
- 私有策略仓库
:::

::: warning 云端版
**托管服务**
- Web 控制台和团队工作区
- 持续监控和漂移检测
- SSO、RBAC 和企业安全
- 自动化 API/SDK
:::

---

<div style="text-align: center; margin: 2rem 0;">
  <a href="/zh/guide/getting-started" class="vp-button vp-button-medium vp-button-brand">开始使用 →</a>
</div>