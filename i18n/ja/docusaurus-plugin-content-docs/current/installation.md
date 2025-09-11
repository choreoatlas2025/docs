---
sidebar_position: 2
---

# インストールガイド

このページでは、ChoreoAtlas CLIの様々なインストール方法を提供します。お使いの環境に最適なインストール方法を選択してください。

## 🍺 Homebrew (推奨)

macOSおよびLinuxユーザーにとって最も便利なインストール方法：

```bash
# ChoreoAtlas Homebrew Tapを追加
brew tap choreoatlas2025/tap

# ChoreoAtlas CLIをインストール
brew install choreoatlas

# インストールを検証
choreoatlas version
```

### バージョンの更新

```bash
brew upgrade choreoatlas
```

## 🐳 Docker

ローカルインストール不要で、コンテナ環境や一時的な使用に適しています：

```bash
# 最新バージョンを実行
docker run --rm choreoatlas/cli:latest version

# 便利なエイリアスを作成
echo 'alias choreoatlas="docker run --rm -v \$(pwd):/workspace choreoatlas/cli:latest"' >> ~/.bashrc
source ~/.bashrc

# エイリアスを使用
choreoatlas validate --help
```

### Dockerイメージバージョン

- `choreoatlas/cli:latest` - 最新安定版
- `choreoatlas/cli:v0.1.2` - 指定バージョン
- `ghcr.io/choreoatlas2025/cli:latest` - GitHub Container Registry

## 📦 プリビルドバイナリ

GitHub Releasesから直接プリビルドバイナリファイルをダウンロード：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="linux" label="Linux" default>

```bash
# アーキテクチャを自動検出してダウンロード
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-linux-$(uname -m).tar.gz" | tar xz

# PATHに移動
sudo mv choreoatlas /usr/local/bin/
chmod +x /usr/local/bin/choreoatlas

# インストールを検証
choreoatlas version
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
# Intel Mac
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-darwin-amd64.tar.gz" | tar xz

# Apple Silicon Mac
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-darwin-arm64.tar.gz" | tar xz

# PATHに移動
sudo mv choreoatlas /usr/local/bin/
chmod +x /usr/local/bin/choreoatlas

# インストールを検証
choreoatlas version
```

  </TabItem>
  <TabItem value="windows" label="Windows">

1. [GitHub Releases](https://github.com/choreoatlas2025/cli/releases/latest)にアクセス
2. `choreoatlas-windows-amd64.zip`をダウンロード
3. 展開して`choreoatlas.exe`をPATHに追加

またはPowerShellを使用：

```powershell
# 現在のディレクトリにダウンロードして展開
Invoke-WebRequest -Uri "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas-windows-amd64.zip" -OutFile "choreoatlas.zip"
Expand-Archive -Path "choreoatlas.zip" -DestinationPath "."

# インストールを検証
.\choreoatlas.exe version
```

  </TabItem>
</Tabs>

## 📋 システム要件

### 最小要件
- **オペレーティングシステム**: Linux, macOS, Windows
- **アーキテクチャ**: amd64, arm64
- **メモリ**: 64MB RAM
- **ストレージ**: 20MB 利用可能領域

### 推奨構成
- **メモリ**: 256MB+ RAM（大きなトレースファイル処理用）
- **CPU**: 2+ コア（並列検証用）
- **ストレージ**: 100MB+（キャッシュとレポート用）

## 🔧 設定の検証

インストール完了後、CLIが正しく設定されているか確認：

```bash
# バージョン情報を確認
choreoatlas version

# 利用可能なコマンドを確認
choreoatlas --help

# Docker統合を検証（Dockerを使用している場合）
docker run --rm choreoatlas/cli:latest --help
```

期待される出力例：
```
ChoreoAtlas CLI v0.1.2
Built with Go 1.21, commit abc1234
Edition: ce
Platform: darwin/arm64
```

## 🏢 エンタープライズインストール

### プライベートイメージリポジトリ

企業環境では、Dockerイメージをプライベートリポジトリにプッシュできます：

```bash
# パブリックイメージをプル
docker pull choreoatlas/cli:latest

# プライベートリポジトリに再タグ付け
docker tag choreoatlas/cli:latest your-registry.com/choreoatlas/cli:latest

# プライベートリポジトリにプッシュ
docker push your-registry.com/choreoatlas/cli:latest
```

### オフラインインストールパッケージ

Pro Privacy版では完全オフラインのインストールパッケージを提供：
- プリビルドバイナリファイル
- すべての依存関係とリソース
- オフライン検証とライセンスファイル
- SBOMと署名検証

オフラインインストールパッケージについては [enterprise@choreoatlas.com](mailto:enterprise@choreoatlas.com) にお問い合わせください。

## 🔒 セキュリティ検証

ChoreoAtlasリリースのすべてのバイナリファイルはデジタル署名されており、整合性を検証できます：

```bash
# チェックサムファイルをダウンロード
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/checksums.txt" -o checksums.txt

# ダウンロードしたファイルを検証（Linux/macOS）
sha256sum -c checksums.txt

# SBOM（ソフトウェア部品表）を表示
curl -L "https://github.com/choreoatlas2025/cli/releases/latest/download/choreoatlas.spdx.json"
```

### Cosign署名検証

```bash
# cosignをインストール
go install github.com/sigstore/cosign/v2/cmd/cosign@latest

# コンテナイメージ署名を検証
cosign verify choreoatlas/cli:latest --certificate-identity-regexp=".*" --certificate-oidc-issuer-regexp=".*"
```

## ❓ トラブルシューティング

### よくある問題

**問題**: `command not found: choreoatlas`
**解決策**: バイナリファイルがPATHにあることを確認するか、フルパスで実行

**問題**: Docker権限が拒否された
**解決策**: ユーザーが`docker`グループに属していることを確認するか、`sudo`を使用

**問題**: macOSセキュリティ警告
**解決策**: `sudo xattr -d com.apple.quarantine /usr/local/bin/choreoatlas`を実行

### ヘルプの取得

インストールに問題が発生した場合：

1. [GitHub Issues](https://github.com/choreoatlas2025/cli/issues)を検索
2. [GitHub Discussions](https://github.com/choreoatlas2025/cli/discussions)にアクセス
3. テクニカルサポートに連絡: [support@choreoatlas.com](mailto:support@choreoatlas.com)

## 🚀 次のステップ

インストール完了後、以下に進んでください：
- [クイックスタート](./quickstart.md) - 最初の検証を実行
- [コア概念](./concepts/dual-contracts.md) - デュアルコントラクトアーキテクチャを理解

---

<div className="callout success">
  <p><strong>✅ インストール成功！</strong></p>
  <p>ChoreoAtlas CLIのインストールが完了しました。契約即コードによるマイクロサービスガバナンスを体験していただけます。直感的に理解するため、まず<a href="https://github.com/choreoatlas2025/quickstart-demo">Quickstart Demo</a>を実行することをお勧めします。</p>
</div>