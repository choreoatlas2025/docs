---
layout: page
---

<CustomHeroSection />

<div class="home-content">

## Features

<div class="features-grid">
  <div class="feature-card">
    <div class="feature-icon">🔍</div>
    <h3>Service-level Semantic Verification</h3>
    <p>ServiceSpec contracts define preconditions and postconditions for each operation, enabling CEL-based semantic validation beyond simple schema checking.</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">⏱️</div>
    <h3>Orchestration-level Temporal Verification</h3>
    <p>FlowSpec contracts define step sequences and data flow, enabling temporal, causal, and DAG validation of service choreography.</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">📊</div>
    <h3>Real Trace-driven Validation</h3>
    <p>Validate contracts against actual execution traces (JSON/OTLP), bridging the gap between design and runtime behavior.</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">🚀</div>
    <h3>CI/CD Integration</h3>
    <p>Seamless integration with continuous integration pipelines for automated contract validation and governance.</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">🏗️</div>
    <h3>Atlas Component Family</h3>
    <p>Scout (discover), Proof (validate), and Pilot (lint) - complete toolchain for contract-driven development.</p>
  </div>
  <div class="feature-card">
    <div class="feature-icon">📋</div>
    <h3>Multiple Editions</h3>
    <p>Community Edition (CE), Pro Standard, Pro Privacy, and Cloud to fit different team and governance needs.</p>
  </div>
</div>

<style>
.home-content { max-width: 1024px; margin: 0 auto; padding: 0 1rem; }

.features-grid {
  display: grid;
  gap: 1.5rem;
  margin: 2rem 0;
  grid-template-columns: 1fr; /* default 1 column */
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
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--vp-brand);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.feature-card h3 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.feature-card p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}
</style>

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Features and APIs may change as we continue to improve the product. We welcome your feedback and contributions!
:::

## Quickstart (5 minutes)

```bash
# 1) One-line alias (no local install)
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'

# 2) Validate a sample flow and emit an HTML report
choreoatlas validate \
  --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format html --report-out reports/validation-report.html
```

Expected output
- PASS/FAIL lines for each orchestration step (e.g. `[PASS] Create Order`)
- `reports/validation-report.html` rendered with timeline, coverage, and gate status

Tips
- Use the [quickstart demo](https://github.com/choreoatlas2025/quickstart-demo) for a ready-to-run workspace (`git clone … && make demo`).
- Continue with [Getting Started](/guide/getting-started) for the full discover → lint → validate workflow.

## Supported Editions

::: info Community Edition (CE)
Free and Open Source
- ServiceSpec + FlowSpec contracts, local validation and linting
- Reports: HTML/JSON/JUnit; basic baselines and CI gating
- Zero telemetry, runs fully offline
:::

::: tip Pro Standard
Team features with opt‑in anonymous telemetry
- Everything in CE plus advanced baselines, history diff, trend analysis
- Org‑level policies, private rules/templates, notifications/Webhooks
- GitHub App style PR summaries and failure deep‑links
:::

::: tip Pro Privacy
Fully offline Pro for regulated environments
- All Pro Standard features with zero telemetry and no network egress
- Offline license activation; reproducible builds guidance
:::

::: warning Cloud
Managed workspace and collaboration
- Web console, teams/projects, hosted reports and history
- Connectors (OTLP/Jaeger/Tempo), continuous discovery and drift detection
- SSO/RBAC, audit/export, retention policies, API/SDK
:::

---

<div style="text-align: center; margin: 2rem 0;">
  <a href="/guide/getting-started" class="vp-button vp-button-medium vp-button-brand">Get Started →</a>
</div>

</div>
