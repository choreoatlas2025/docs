# ChoreoAtlas Documentation

This repository contains the official documentation for ChoreoAtlas CLI, built with [Docusaurus](https://docusaurus.io/).

## 🌐 Live Site

- **Chinese (Default)**: https://choreoatlas.io
- **English**: https://choreoatlas.io/en

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve built site
npm run serve
```

## 📝 Content Structure

- `/docs/` - Documentation content (Markdown)
- `/blog/` - Blog posts
- `/src/` - Custom React components and pages
- `/static/` - Static assets (images, files)
- `/i18n/` - Internationalization content

## 🌍 Internationalization

This site supports Chinese (default) and English:

- Chinese content in `/docs/` and `/blog/`
- English translations in `/i18n/en/`

To contribute translations:
1. Run `npm run write-translations` to extract translatable strings
2. Translate content in `/i18n/en/docusaurus-plugin-content-docs/current/`
3. Update navigation and UI strings in `/i18n/en/docusaurus-theme-classic/`

## 🔧 Configuration

- `docusaurus.config.js` - Main configuration
- `sidebars.js` - Documentation navigation
- `src/css/custom.css` - Custom styling

## 📚 Writing Documentation

### File Structure
```
docs/
├── intro.md                 # Homepage content
├── installation.md          # Installation guide  
├── quickstart.md            # Getting started
├── concepts/                # Core concepts
│   ├── dual-contracts.md    # Architecture overview
│   ├── servicespec.md       # Service contracts
│   └── flowspec.md          # Flow contracts
├── cli/                     # Command reference
├── reports/                 # Report analysis
└── ci-cd/                  # Integration guides
```

### Content Guidelines

1. **Use descriptive frontmatter**:
```yaml
---
sidebar_position: 1
title: Custom Page Title
description: Page description for SEO
---
```

2. **Include interactive examples**:
```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="homebrew" label="Homebrew">
    brew install choreoatlas
  </TabItem>
</Tabs>
```

3. **Use callout components**:
```jsx
<div className="callout success">
  <p><strong>✅ Success!</strong></p>
  <p>Configuration completed successfully.</p>
</div>
```

4. **Add edition badges**:
```jsx
<span className="edition-badge ce">CE</span>
<span className="edition-badge pro-free">Pro</span>
```

## 🎨 Custom Components

Available custom CSS classes:
- `.feature-card` - Feature highlight boxes
- `.cli-example` - Command line examples
- `.contract-example` - Contract code blocks
- `.callout.{success|warning|info}` - Colored callouts
- `.edition-badge.{ce|pro-free|pro-privacy|cloud}` - Product edition badges

## 🚀 Deployment

Documentation is automatically deployed to GitHub Pages on push to `main` branch.

Manual deployment:
```bash
npm run build
npm run deploy
```

## 📧 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm start`
5. Submit a pull request

For major changes, please open an issue first to discuss.

## 📄 License

Documentation content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

---

**ChoreoAtlas CLI** - Map, Verify, Steer cross-service choreography with contracts-as-code.