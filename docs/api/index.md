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
# Discover contracts from traces
ca discover --trace <file> --output <dir>

# Validate contracts against execution
ca validate --flow <file> --trace <file> --edition ce

# Static analysis and linting
ca lint --flow <file>

# CI/CD gate command
ca ci-gate --flow <file> --trace <file> --edition ce
```

### Getting Help
```bash
# Global help
ca --help

# Command-specific help
ca validate --help
ca discover --help
ca lint --help
```

## 📖 Related Documentation

- **[Getting Started](/guide/getting-started)** - First-time setup and basic workflow
- **[Basic Usage](/guide/basic-usage)** - Common usage patterns and examples
- **[Installation Guide](/guide/installation)** - Installation methods and requirements

## 🔗 External Resources

- **[GitHub Repository](https://github.com/choreoatlas2025/cli)** - Source code and issues
- **[Docker Hub](https://hub.docker.com/u/choreoatlas)** - Container images
- **[Quickstart Demo](https://github.com/choreoatlas2025/quickstart-demo)** - Interactive examples