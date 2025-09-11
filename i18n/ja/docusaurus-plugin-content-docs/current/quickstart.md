---
sidebar_position: 3
---

# クイックスタート

この15分のクイックガイドを通じて、ChoreoAtlas CLIの核心機能を学びます：トレースデータからコントラクトを発見、サービスオーケストレーションの検証、分析レポートの生成。

## 🎯 学習目標

このガイドを完了すると、以下ができるようになります：
- トレースデータからServiceSpec + FlowSpecコントラクトを自動生成
- マイクロサービスオーケストレーションの正確性を検証
- HTMLバリデーションレポートを生成し理解
- CI/CDパイプラインへの統合

## 🚀 方法1：Quickstart Demo（推奨）

最も早い体験方法は、準備済みの完全デモを使用することです：

```bash
# デモリポジトリをクローン
git clone https://github.com/choreoatlas2025/quickstart-demo.git
cd quickstart-demo

# ワンクリックで完全デモを実行
make demo
```

これにより自動的に以下が実行されます：
1. 📊 事前録画されたトレースからServiceSpec + FlowSpecコントラクトを生成
2. ✅ 成功と失敗の両シナリオを検証
3. 🌐 美麗なHTMLバリデーションレポートを生成
4. 自動的にレポートを開いて結果を表示

<div className="callout success">
  <p><strong>🎉 とても簡単！</strong></p>
  <p>HTMLレポートが検証通過を表示していれば、ChoreoAtlasが正常に動作しています。各ステップの詳細を深く理解していきましょう。</p>
</div>

## 📋 方法2：手動ステップ詳細

各コマンドの具体的な動作を理解したい場合は、以下のステップを手動で実行してください：

### ステップ1: トレースデータの準備

ChoreoAtlasはOpenTelemetry/Jaeger形式のトレースデータを入力として必要とします：

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
    // ... その他のspans
  ]
}
```

### ステップ2: コントラクトの発見

`discover`コマンドを使用してトレースデータからコントラクトを自動生成：

<div className="cli-example">

```bash
# トレースからServiceSpec + FlowSpecコントラクトを発見
choreoatlas discover \
  --trace traces/successful-order.json \
  --out-servicespec contracts/services/ \
  --out-flowspec contracts/flows/order-flow.flowspec.yaml \
  --format yaml
```

</div>

出力結果：
```
🔍 トレースデータを分析中...
✅ 5つのサービスを発見: catalogue, cart, orders, payment, shipping  
✅ ServiceSpecコントラクトをcontracts/services/に生成
✅ FlowSpecを生成: contracts/flows/order-flow.flowspec.yaml
📊 フロー分析: 5ステップ、合計実行時間280ms
```

### ステップ3: 生成されたコントラクトの確認

自動生成されたServiceSpecコントラクトを確認：

```yaml title="contracts/services/catalogue.servicespec.yaml"
apiVersion: servicespec.choreoatlas.io/v1
kind: ServiceSpec
service: "catalogue"

operations:
  - operationId: "getCatalogue"
    description: "商品カタログを取得"
    method: GET
    path: "/catalogue"
    preconditions:
      "service_available": "true"
    postconditions:
      "response_ok": "response.status == 200"
      "has_products": "size(response.body) > 0"
```

生成されたFlowSpecオーケストレーションコントラクトを確認：

```yaml title="contracts/flows/order-flow.flowspec.yaml"
apiVersion: flowspec.choreoatlas.io/v1
kind: FlowSpec
info:
  title: "注文履行プロセス"

services:
  catalogue:
    spec: "../services/catalogue.servicespec.yaml"

flow:
  - step: "商品カタログ閲覧"
    call: "catalogue.getCatalogue"
    output:
      products: "response.body"
    
  - step: "カートに追加"
    call: "cart.addToCart"
    depends_on: ["商品カタログ閲覧"]
```

### ステップ4: オーケストレーションの検証

`validate`コマンドを使用して実際の実行がコントラクトに準拠しているか検証：

<div className="cli-example">

```bash
# トレースとコントラクトのマッチングを検証
choreoatlas validate \
  --servicespec contracts/services/ \
  --flowspec contracts/flows/order-flow.flowspec.yaml \
  --trace traces/successful-order.json \
  --report-html reports/validation-report.html \
  --edition ce
```

</div>

出力結果：
```
✅ ServiceSpecバリデーション: 5/5サービスが合格
✅ FlowSpecバリデーション: 5ステップすべて正しく実行
✅ 時間順序: 違反は検出されませんでした
✅ カバレッジ: サービス相互作用の100%が検証済み
📊 レポートを生成: reports/validation-report.html
```

### ステップ5: バリデーションレポートの確認

ブラウザで生成されたHTMLレポートを開くと、以下が表示されます：

- **バリデーション概要**: 全体の合格/不合格状態
- **サービス分析**: 各サービスのコントラクト遵守状況
- **プロセスタイムライン**: ステップ実行の時系列関係
- **カバレッジ指標**: バリデーションの完全性統計
- **エラー分析**: コントラクト違反の詳細情報

## 🔧 実際のプロジェクト統合

### 既存のトレースシステムからのエクスポート

Jaeger、Zipkin、またはその他のトレースシステムを既に使用している場合：

```bash
# Jaegerからトレースをエクスポート
curl "http://jaeger:16686/api/traces/your-trace-id" > your-trace.json

# Zipkinからトレースをエクスポート
curl "http://zipkin:9411/api/v2/trace/your-trace-id" > your-trace.json

# コントラクトを生成
choreoatlas discover --trace your-trace.json --out-servicespec ./contracts/services/
```

### CI/CDバリデーションの設定

`.github/workflows/validate.yml`に以下を追加：

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

## 📊 バリデーション結果の理解

### 成功したバリデーション

すべてのチェックが通過した場合、以下が表示されます：

<div className="callout success">
  <p><strong>✅ バリデーション合格</strong></p>
  <ul>
    <li>すべてのサービスがServiceSpecコントラクトに準拠</li>
    <li>オーケストレーションステップがFlowSpecで定義された順序で実行</li>
    <li>時系列違反や因果関係エラーは検出されず</li>
    <li>サービス相互作用のカバレッジが期待する閾値を達成</li>
  </ul>
</div>

### バリデーション失敗

コントラクト違反が検出された場合、レポートには以下が表示されます：

<div className="callout warning">
  <p><strong>⚠️ 違反を検出</strong></p>
  <ul>
    <li><strong>サービスコントラクト違反</strong>: レスポンスがpostconditionsに準拠していない</li>
    <li><strong>時系列エラー</strong>: ステップ実行順序がFlowSpecと異なる</li>
    <li><strong>依存関係の欠如</strong>: 必要なサービス呼び出しが不足</li>
    <li><strong>カバレッジ不足</strong>: 一部のサービス相互作用が検証されていない</li>
  </ul>
</div>

## 💡 ベストプラクティス

### 1. 段階的な採用

```bash
# 最初はコアサービス用のコントラクトを生成
choreoatlas discover --trace critical-path.json --out-servicespec ./core-services/

# 徐々により多くのサービスとプロセスに拡張
choreoatlas discover --trace full-flow.json --out-servicespec ./all-services/
```

### 2. バージョン管理

```bash
# コントラクトファイルにバージョンタグを設定
git tag contracts-v1.0.0

# CIでコントラクト互換性を検証
choreoatlas validate --baseline contracts-v1.0.0/ --current ./contracts/
```

### 3. 品質ゲート

```bash
# カバレッジ閾値を設定
choreoatlas validate \
  --coverage-threshold 80 \
  --max-duration 5s \
  --success-rate 0.99
```

## 🎓 次のステップ学習

基本的な使用方法をマスターしたので、さらに深く学習を続けましょう：

1. **[デュアルコントラクトアーキテクチャ詳解](./concepts/dual-contracts)** - ServiceSpec + FlowSpec設計パターンの深い理解

## ❓ よくある質問

**Q: トレースデータはどこから取得しますか？**
A: Jaeger、Zipkin、OpenTelemetry Collector、またはOTLP形式をサポートする任意のトレースシステムからエクスポートします。

**Q: 部分的なフローを検証できますか？**
A: はい、ChoreoAtlasは部分検証と増分カバレッジ分析をサポートしています。

**Q: 機密データはどのように処理しますか？**
A: Pro Privacyバージョンを使用して、ゼロテレメトリーと完全オフライン実行を保証するか、データマスキング機能を使用してください。

---

<div className="callout info">
  <p><strong>🚀 準備完了ですか？</strong></p>
  <p>クイックスタートガイドを完了しました。実際のプロジェクトでChoreoAtlasの使用を開始できます。最良の学習方法は実践することです！</p>
</div>