---
layout: page
---

<CustomHeroSection />

<div class="home-content">

## 功能亮点

<div class="features-grid">
  <div class="feature-card">
    <div class="feature-icon">🔍</div>
    <h3>服务级语义验证</h3>
    <p>ServiceSpec 契约定义操作的前置/后置条件，提供超越模式校验的基于 CEL 的语义验证。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">⏱️</div>
    <h3>编排级时序验证</h3>
    <p>FlowSpec 定义步骤与数据流，实现时序、因果与 DAG 校验。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">📊</div>
    <h3>真实追踪驱动</h3>
    <p>基于实际执行追踪（JSON/OTLP）进行验证，连接设计与运行时行为。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">🚀</div>
    <h3>CI/CD 集成</h3>
    <p>与持续集成管道无缝结合，实现自动化契约验证与治理。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">🏗️</div>
    <h3>Atlas 组件家族</h3>
    <p>Scout（探索）、Proof（校验）、Pilot（规范）组成完整工具链。</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">📋</div>
    <h3>多版本支持</h3>
    <p>社区版（CE）、Pro 标准版、Pro 隐私版与云端版，覆盖不同团队与治理需求。</p>
  </div>
</div>

<style>
.home-content { max-width: 1024px; margin: 0 auto; padding: 0 1rem; }

.features-grid {
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .features-grid { grid-template-columns: repeat(3, 1fr); }
}
.feature-card {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  transition: all .3s;
}
.feature-card:hover {
  border-color: var(--vp-brand);
  box-shadow: 0 8px 16px rgba(0,0,0,.1);
  transform: translateY(-2px);
}
.feature-icon { font-size: 2rem; margin-bottom: .75rem; }
.feature-card h3 { font-size: 1.125rem; margin-bottom: .5rem; color: var(--vp-c-text-1); }
.feature-card p { color: var(--vp-c-text-2); line-height: 1.6; margin: 0; }
</style>

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
免费开源
- ServiceSpec + FlowSpec 双契约，本地验证/检查
- 报告：HTML/JSON/JUnit；基础基线与 CI 门禁
- 零遥测，完全本地运行
:::

::: tip Pro 标准版 (Pro Standard)
团队能力（匿名遥测可选）
- 在 CE 基础上，提供高级基线、历史对比与趋势分析
- 组织级策略、私有规则/模板库、通知与 Webhook
- GitHub App 样式的 PR 摘要与失败溯源
:::

::: tip Pro 隐私版 (Pro Privacy)
完全离线/不可外呼
- 等同 Pro 标准版功能，零遥测、无任何网络外呼
- 支持离线许可激活；可复现构建指引
:::

::: warning 云端版 (Cloud)
托管工作区与协作
- Web 控制台、团队/项目、报告托管与历史留存
- 连接器（OTLP/Jaeger/Tempo），持续发现与漂移检测
- SSO/RBAC、审计与导出、保留策略、API/SDK
:::

---

<div style="text-align: center; margin: 2rem 0;">
  <a href="/docs/zh/guide/getting-started" class="vp-button vp-button-medium vp-button-brand">开始使用 →</a>
</div>

</div>
