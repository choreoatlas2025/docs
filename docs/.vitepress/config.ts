import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'ChoreoAtlas CLI',
  description: 'Map, Verify, Steer cross-service choreography with contracts-as-code',
  
  // 多语言配置
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Guide', link: '/guide/' },
          { text: 'API', link: '/api/' },
          { 
            text: 'External Links',
            items: [
              { text: 'GitHub Repository', link: 'https://github.com/choreoatlas2025/cli' },
              { text: 'Quickstart Demo', link: 'https://github.com/choreoatlas2025/quickstart-demo' },
              { text: 'Docker Hub', link: 'https://hub.docker.com/u/choreoatlas' },
              { text: 'Business Website', link: 'https://choreoatlas.com' }
            ]
          }
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Introduction', link: '/guide/' },
                { text: 'Installation', link: '/guide/installation' },
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Basic Usage', link: '/guide/basic-usage' },
                { text: 'Reports', link: '/guide/reports' },
                { text: 'CI Integration', link: '/guide/ci-integration' },
                { text: 'Trace Conversion', link: '/guide/trace-conversion' },
                { text: 'Recipes: Batch Validation', link: '/guide/recipes-batch-validate' },
                { text: 'Recipes: Thresholds & Baselines', link: '/guide/recipes-baselines-thresholds' },
                { text: 'Recipes: Discover → Refine → Validate', link: '/guide/recipes-discover-refine-validate' }
              ]
            }
          ],
          '/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'CLI Commands', link: '/api/cli-commands' }
              ]
            }
          ]
        }
      }
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '指南', link: '/zh/guide/' },
          { text: 'API', link: '/zh/api/' },
          { 
            text: '外部链接',
            items: [
              { text: 'GitHub 仓库', link: 'https://github.com/choreoatlas2025/cli' },
              { text: '快速演示', link: 'https://github.com/choreoatlas2025/quickstart-demo' },
              { text: 'Docker Hub', link: 'https://hub.docker.com/u/choreoatlas' },
              { text: '商务网站', link: 'https://choreoatlas.com' }
            ]
          }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '指南',
              items: [
                { text: '介绍', link: '/zh/guide/' },
                { text: '安装', link: '/zh/guide/installation' },
                { text: '快速开始', link: '/zh/guide/getting-started' },
                { text: '基础用法', link: '/zh/guide/basic-usage' },
                { text: '报告输出', link: '/zh/guide/reports' },
                { text: 'CI 集成', link: '/zh/guide/ci-integration' },
                { text: '追踪转换', link: '/zh/guide/trace-conversion' },
                { text: 'Recipes：批量校验', link: '/zh/guide/recipes-batch-validate' },
                { text: 'Recipes：阈值与基线', link: '/zh/guide/recipes-baselines-thresholds' },
                { text: 'Recipes：发现→精修→校验', link: '/zh/guide/recipes-discover-refine-validate' }
              ]
            }
          ],
          '/zh/api/': [
            {
              text: 'API 参考',
              items: [
                { text: 'CLI 命令', link: '/zh/api/cli-commands' }
              ]
            }
          ]
        }
      }
    }
  },

  // 全局主题配置
  themeConfig: {
    logo: '/logo.svg',
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/choreoatlas2025/cli' }
    ],

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/choreoatlas2025/docs/edit/main/docs/:path'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 ChoreoAtlas'
    }
  },

  // 构建配置
  base: '/docs/',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,
  
  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'x-build', content: process.env.GITHUB_SHA?.slice(0,7) || 'local' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:title', content: 'ChoreoAtlas CLI | Contract-as-Code Orchestration' }],
    ['meta', { name: 'og:site_name', content: 'ChoreoAtlas CLI' }],
    ['meta', { name: 'og:image', content: 'https://choreoatlas.io/choreoatlas-social-card.jpg' }],
    ['meta', { name: 'og:url', content: 'https://choreoatlas.io/' }]
  ]
})
