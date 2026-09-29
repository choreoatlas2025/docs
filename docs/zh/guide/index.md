---
sidebar_position: 1
---

# ChoreoAtlas CLI 简介

::: warning Beta 版本
ChoreoAtlas CLI 目前处于 **Beta** 状态。功能和 API 可能会发生变化。
:::

欢迎使用 **ChoreoAtlas CLI** - 基于契约即代码的跨服务编排治理平台。

## 什么是 ChoreoAtlas？

ChoreoAtlas 实现双契约架构，为微服务编排提供语义验证和时序验证：

- **ServiceSpec 契约**: 定义每个服务的操作规约、前置条件和后置条件
- **FlowSpec 契约**: 定义跨服务编排的步骤序列和数据流转

## 核心功能

### 🔍 Atlas Scout (探索)
从真实执行追踪自动生成初始契约，快速建立服务规约。

### ✅ Atlas Proof (校验)  
验证 FlowSpec 编排与实际执行追踪的匹配度，确保设计与实现一致。

### 🧭 Atlas Pilot (指导)
静态验证契约一致性，发现服务引用错误和变量依赖问题。

## 快速开始

```bash
alias choreoatlas='docker run --rm -v $(pwd):/workspace -w /workspace choreoatlas/cli:latest'

choreoatlas validate   --flow contracts/flows/order-flow.graph.flowspec.yaml \
  --trace traces/successful-order.trace.json \
  --report-format html --report-out reports/validation-report.html
```

## 当前可用版本

[社区版 0.2.0-ce.beta.1](https://github.com/choreoatlas2025/cli/releases/tag/v0.2.0-ce.beta.1) 是已发布的测试版，可通过演示仓库体验本地 CLI 工作流。
