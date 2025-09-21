---
layout: home

hero:
  name: ChoreoAtlas CLI
  text: Contract-as-Code Orchestration
  tagline: Map, Verify, Steer cross-service choreography with executable contracts
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/choreoatlas2025/cli
  image:
    src: /logo.svg
    alt: ChoreoAtlas CLI

features:
  - icon: 🔍
    title: Service-level Semantic Verification
    details: ServiceSpec contracts define preconditions and postconditions for each operation, enabling CEL-based semantic validation beyond simple schema checking.
  - icon: ⏱️
    title: Orchestration-level Temporal Verification  
    details: FlowSpec contracts define step sequences and data flow, enabling temporal, causal, and DAG validation of service choreography.
  - icon: 📊
    title: Real Trace-driven Validation
    details: Validate contracts against actual execution traces (JSON/OTLP), bridging the gap between design and runtime behavior.
  - icon: 🚀
    title: CI/CD Integration
    details: Seamless integration with continuous integration pipelines for automated contract validation and governance.
  - icon: 🏗️
    title: Atlas Component Family
    details: Scout (discover), Proof (validate), and Pilot (lint) - complete toolchain for contract-driven development.
  - icon: 📋
    title: Multiple Editions
    details: Community Edition (CE), Professional (Pro), and Cloud editions to meet different team and organizational needs.
---

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
**Free and Open Source**
- ServiceSpec + FlowSpec dual contracts
- Local validation and linting
- Basic reporting (HTML/JSON/JUnit)
- CI integration examples
:::

::: tip Professional Edition (Pro)
**Advanced Features**
- Advanced baselines and trend analysis
- Team collaboration and governance
- Webhook integrations and notifications
- Private policy repositories
:::

::: warning Cloud Edition
**Managed Service**
- Web console and team workspaces
- Continuous monitoring and drift detection
- SSO, RBAC, and enterprise security
- API/SDK for automation
:::

---

<div style="text-align: center; margin: 2rem 0;">
  <a href="/guide/getting-started" class="vp-button vp-button-medium vp-button-brand">Get Started →</a>
</div>