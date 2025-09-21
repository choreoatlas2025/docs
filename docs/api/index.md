# API Reference

::: warning Beta Version
ChoreoAtlas CLI is currently in **Beta** status. APIs and command interfaces may change as we refine the product.
:::

Welcome to the ChoreoAtlas CLI API Reference. This section provides comprehensive documentation for all CLI commands, configuration options, and integration patterns.

## 📚 Documentation Sections

### [CLI Commands](/api/cli-commands)
Complete reference for all ChoreoAtlas CLI commands including:
- Core commands (`discover`, `validate`, `lint`)
- Enterprise features (`baseline`, `policy`, `audit`)
- Global options and configuration
- Usage examples and workflows

## 🚀 Quick Command Reference

### Essential Commands
```bash
# Optional: alias for shorter commands
alias ca=choreoatlas

# Discover contracts from traces (FlowSpec + ServiceSpecs)
choreoatlas discover --trace <trace.json> \
  --out <flowspec.yaml> \
  --out-services <dir>

# Validate against execution traces
choreoatlas validate --flow <flowspec.yaml> --trace <trace.json>

# Static analysis and linting (schema + structure)
choreoatlas lint --flow <flowspec.yaml>

# CI/CD gate (lint + validate with exit codes)
choreoatlas ci-gate --flow <flowspec.yaml> --trace <trace.json>
```

### Getting Help
```bash
# Global help
choreoatlas --help

# Command-specific help
choreoatlas validate --help
choreoatlas discover --help
choreoatlas lint --help
```

## 📖 Related Documentation

- **[Getting Started](/guide/getting-started)** - First-time setup and basic workflow
- **[Basic Usage](/guide/basic-usage)** - Common usage patterns and examples
- **[Installation Guide](/guide/installation)** - Installation methods and requirements

## 🔗 External Resources

- **[GitHub Repository](https://github.com/choreoatlas2025/cli)** - Source code and issues
- **[Docker Hub](https://hub.docker.com/u/choreoatlas)** - Container images
- **[Quickstart Demo](https://github.com/choreoatlas2025/quickstart-demo)** - Interactive examples
