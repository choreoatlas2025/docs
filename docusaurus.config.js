// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ChoreoAtlas CLI',
  tagline: 'Map, Verify, Steer cross-service choreography with contracts-as-code',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://choreoatlas2025.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'choreoatlas2025', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // 设置docs为根路径，避免双重/docs/路径
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/choreoatlas2025/docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/choreoatlas2025/docs/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/choreoatlas-social-card.jpg',
      navbar: {
        title: 'ChoreoAtlas',
        logo: {
          alt: 'ChoreoAtlas CLI Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/choreoatlas2025/quickstart-demo',
            label: 'Quickstart',
            position: 'right',
          },
          {
            href: 'https://github.com/choreoatlas2025/cli',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Quick Start',
                to: '/docs/',
              },
              {
                label: 'Installation',
                to: '/installation',
              },
              {
                label: 'Quick Guide',
                to: '/quickstart',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/choreoatlas2025/cli/discussions',
              },
              {
                label: 'Issues & Support',
                href: 'https://github.com/choreoatlas2025/cli/issues',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/choreoatlas2025/cli',
              },
              {
                label: 'Docker Hub',
                href: 'https://hub.docker.com/u/choreoatlas',
              },
            ],
          },
          {
            title: 'Product',
            items: [
              {
                label: 'Pricing',
                href: 'https://choreoatlas.com/pricing',
              },
              {
                label: 'Try Demo',
                href: 'https://github.com/choreoatlas2025/quickstart-demo',
              },
              {
                label: 'Enterprise',
                href: 'https://choreoatlas.com/enterprise',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ChoreoAtlas. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'yaml', 'json', 'go'],
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'YOUR_ALGOLIA_APP_ID',
        // Public API key: it is safe to commit it
        apiKey: 'YOUR_ALGOLIA_SEARCH_API_KEY',
        indexName: 'choreoatlas',
        // Optional: see doc section below
        contextualSearch: true,
        // Optional: Algolia search parameters
        searchParameters: {},
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
      },
    }),
};

module.exports = config;