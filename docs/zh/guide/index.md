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
# 安装 ChoreoAtlas CLI
curl -sSL https://choreoatlas.io/install.sh | bash

# 验证安装
ca version

# 运行示例
ca validate --flow examples/order.flowspec.yaml \
           --trace examples/order.trace.json
```

## 支持的版本

- **社区版 (CE)**: 完全免费，适合个人开发者和小团队
- **专业版 (Pro)**: 企业级功能，包含高级基线和团队协作
- **云端版 (Cloud)**: 托管服务，提供 Web 控制台和持续监控