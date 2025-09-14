# Installation

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. Installation methods and packages may change.
:::

This guide covers all the ways to install ChoreoAtlas CLI on your system.

## Quick Install (Recommended)

```bash
# Install via curl
curl -sSL https://choreoatlas.io/install.sh | bash

# Verify installation
ca version
```

## Manual Installation

### Download from GitHub Releases

1. Visit our [GitHub Releases](https://github.com/choreoatlas2025/cli/releases) page
2. Download the binary for your platform:
   - **Linux AMD64**: `choreoatlas-linux-amd64.tar.gz`
   - **Linux ARM64**: `choreoatlas-linux-arm64.tar.gz`
   - **macOS AMD64**: `choreoatlas-darwin-amd64.tar.gz`
   - **macOS ARM64**: `choreoatlas-darwin-arm64.tar.gz`
   - **Windows AMD64**: `choreoatlas-windows-amd64.zip`

3. Extract and install:

```bash
# Linux/macOS
tar -xzf choreoatlas-*.tar.gz
sudo mv choreoatlas /usr/local/bin/ca
chmod +x /usr/local/bin/ca

# Verify installation
ca version
```

### Docker Installation

```bash
# Pull the official image
docker pull choreoatlas/cli:latest

# Create an alias
echo 'alias ca="docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest"' >> ~/.bashrc
source ~/.bashrc

# Verify
ca version
```

## System Requirements

- **OS**: Linux, macOS, Windows
- **Arch**: amd64, arm64  
- **Memory**: 64MB RAM minimum
- **Storage**: 20MB available space

## Next Steps

Once installed, head to our [Getting Started Guide](./getting-started.md) to create your first contracts.