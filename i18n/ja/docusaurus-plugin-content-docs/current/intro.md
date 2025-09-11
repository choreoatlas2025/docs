---
sidebar_position: 1
---

# ChoreoAtlas CLI 紹介

**ChoreoAtlas CLI** へようこそ - Contract-as-Codeによるクロスサービスオーケストレーション統制プラットフォームです。

## ChoreoAtlas とは？

ChoreoAtlas はデュアルコントラクトアーキテクチャを実装し、マイクロサービスオーケストレーションにセマンティック検証とテンポラル検証を提供します：

- **ServiceSpec Contract**: 各サービスの操作仕様、前提条件、事後条件を定義
- **FlowSpec Contract**: クロスサービスオーケストレーションのステップシーケンスとデータフローを定義

## コア機能

### 🔍 Atlas Scout (探索)
実際の実行トレースから初期コントラクトを自動生成し、サービス仕様を迅速に確立します。

### ✅ Atlas Proof (検証)  
FlowSpecオーケストレーションと実際の実行トレースの整合性を検証し、設計と実装の一致を確保します。

### 🧭 Atlas Pilot (誘導)
コントラクトの一貫性を静的に検証し、サービス参照エラーと変数依存の問題を発見します。

## クイックスタート

```bash
# ChoreoAtlas CLI をインストール
curl -sSL https://choreoatlas.io/install.sh | bash

# インストールを確認
ca version

# サンプルを実行
ca validate --flow examples/order.flowspec.yaml \
           --trace examples/order.trace.json
```

## サポートされているバージョン

- **Community Edition (CE)**: 完全無料、個人開発者と小チーム向け
- **Professional Edition (Pro)**: エンタープライズ級機能、高度なベースラインとチームコラボレーション
- **Cloud Edition**: マネージドサービス、Webコンソールと継続監視を提供