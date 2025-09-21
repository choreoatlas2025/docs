# Installation

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta**; packaging may evolve.
:::

Choose one of the following installation methods.

## Option 1 – Docker alias (recommended)

```bash
alias choreoatlas='docker run --rm -v $(pwd):/workspace choreoatlas/cli:latest'
```

- No binaries to install or update manually
- Works on any host with Docker installed
- Used throughout the quickstart and guides

## Option 2 – Download from GitHub Releases

1. Visit the [GitHub Releases](https://github.com/choreoatlas2025/cli/releases) page
2. Download the archive for your platform (Linux/macOS/Windows, amd64 or arm64)
3. Extract and move the binary into your PATH, for example:

```bash
tar -xzf choreoatlas-darwin-arm64.tar.gz
sudo mv choreoatlas /usr/local/bin/choreoatlas
chmod +x /usr/local/bin/choreoatlas
```

Verify the installation:

```bash
choreoatlas --version
```

## Option 3 – Build from source

```bash
git clone https://github.com/choreoatlas2025/cli.git
cd cli
make build
export PATH=$PWD/bin:$PATH
choreoatlas --version
```

## System requirements

- **OS**: Linux, macOS, or Windows
- **CPU**: amd64 / arm64
- **Memory**: 64MB minimum
- **Storage**: 20MB available space
- **Trace data**: OpenTelemetry/Jaeger JSON or converted CE format

You are ready to continue with the [Getting Started guide](./getting-started.md).
