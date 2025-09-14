# Welcome to ChoreoAtlas CLI

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Features and APIs may change as we continue to improve the product.
:::

**Map, Verify, Steer cross-service choreography with contracts-as-code**

ChoreoAtlas CLI is a "contract-as-code" microservice orchestration governance platform that uses the **ServiceSpec + FlowSpec** dual contract system to generate executable contracts from real execution traces, validating service-level semantics and orchestration-level temporal relationships in CI/CD and runtime.

## 🎯 Core Value

ChoreoAtlas implements a **dual contract architecture** that provides both service-level and orchestration-level validation:

- **ServiceSpec Contracts**: Define the "what" - preconditions, postconditions, and semantic rules for individual service operations
- **FlowSpec Contracts**: Define the "how" - step sequences, data flow, and choreography across multiple services

## Key Problems We Solve

### 1. The Documentation-Reality Gap
Traditional API documentation becomes stale quickly. ChoreoAtlas contracts are executable and validated against real traces, ensuring they stay current.

### 2. Microservice Integration Complexity  
As systems grow, understanding the relationships and dependencies between services becomes increasingly difficult. ChoreoAtlas provides a clear, verifiable map of service interactions.

### 3. Runtime Behavior Drift
Services evolve over time, sometimes breaking assumptions that other services depend on. ChoreoAtlas detects these drifts automatically.

### 4. Testing in Production Complexity
Contract validation works with real execution traces from production systems, enabling "testing in production" with confidence.

## The Atlas Component Family

**🔍 Atlas Scout (`discover`)**
- Automatically generates initial contracts from execution traces
- Discovers service relationships and data flows
- Creates baseline contracts for existing systems

**✅ Atlas Proof (`validate`)**  
- Validates FlowSpec choreography against actual execution traces
- Ensures design matches implementation
- Provides detailed coverage and compliance reports

**🧭 Atlas Pilot (`lint`)**
- Static validation of contract consistency
- Detects service reference errors and variable dependencies  
- Provides guidance for contract improvements

## Supported Editions

- **Community Edition (CE)**: Completely free, suitable for individual developers and small teams
- **Professional Edition (Pro)**: Enterprise features including advanced baselines and team collaboration  
- **Cloud Edition (Cloud)**: Managed service with web console and continuous monitoring

## Getting Started

Ready to try ChoreoAtlas? Start with our [Getting Started Guide](./getting-started.md) for a hands-on introduction, or explore the [Quickstart Demo](https://github.com/choreoatlas2025/quickstart-demo) for a complete example.