// @ts-check

/** @type {import('saber').SaberConfig} */
const config = {
  siteConfig: {
    title: 'Saber',
    description: 'A framework for building modern static websites.',
    lang: 'en'
  },
  theme: './src',
  markdown: {
    headings: {
      permalink: true
    },
    plugins: [{ resolve: 'markdown-it-footnote' }]
  },
  build: { lazy: true, extractCSS: true },
  permalinks: { post: '/blog/:slug' },
  themeConfig: {
    sidebarMenu: [
      {
        title: 'Basics',
        children: [
          { title: 'Introduction', link: '/docs' },
          { title: 'Installation', link: '/docs/installation' },
          { title: 'Project Structure', link: '/docs/project-structure' },
          { title: 'Pages', link: '/docs/pages' },
          { title: 'Routing', link: '/docs/routing' },
          { title: 'Permalinks', link: '/docs/permalinks' },
          { title: 'Layouts', link: '/docs/layouts' },
          { title: 'Themes', link: '/docs/themes' },
          { title: 'Markdown Features', link: '/docs/markdown-features' },
          {
            title: 'Using Vue in Markdown',
            link: '/docs/using-vue-in-markdown'
          },
          {
            title: 'Manipulating <head>',
            link: '/docs/manipulating-head'
          },
          { title: 'Page Transition', link: '/docs/page-transition' },
          { title: 'Internationalization', link: '/docs/i18n' },
          {
            title: 'Working with Webpack',
            link: '/docs/working-with-webpack'
          },
          { title: 'Deployment', link: '/docs/deployment' }
        ]
      },
      {
        title: 'Styles and Assets',
        children: [
          { title: 'Using CSS Modules', link: '/docs/css-modules' },
          {
            title: 'Using CSS Preprocessors',
            link: '/docs/css-preprocessors'
          },
          { title: 'Using PostCSS', link: '/docs/postcss' },
          {
            title: 'Using Images, Fonts and Files',
            link: '/docs/images-fonts-and-files'
          },
          { title: 'Using the Static Folder', link: '/docs/static-folder' }
        ]
      },
      {
        title: 'References',
        children: [
          { title: 'Saber Config', link: '/docs/saber-config' },
          { title: 'Built-in Components', link: '/docs/components' },
          { title: 'Plugin API', link: '/docs/plugin-api' },
          { title: 'Saber Instance', link: '/docs/saber-instance' },
          { title: 'Saber Browser APIs', link: '/docs/browser-apis' },
          { title: 'Saber Node APIs', link: '/docs/node-apis' },
          { title: 'Page Interface', link: '/docs/page-interface' }
        ]
      }
    ]
  },
  plugins: [
    {
      resolve: '../packages/saber-plugin-google-analytics',
      options: { trackId: 'UA-54857209-16' }
    },
    { resolve: '../packages/saber-plugin-query-posts' },
    { resolve: '../packages/saber-plugin-netlify-redirect' },
    { resolve: '../packages/saber-plugin-git-modification-time' },
    { resolve: '../packages/saber-plugin-prismjs' },
    {
      resolve: '../packages/saber-plugin-pwa',
      options: {
        generateSWOptions: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/css/,
              handler: 'StaleWhileRevalidate'
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/s\//,
              handler: 'StaleWhileRevalidate'
            }
          ]
        }
      }
    },
    {
      resolve: '../packages/saber-plugin-search'
    },
    {
      resolve: '../packages/saber-plugin-image'
    },
    {
      resolve: '../packages/saber-plugin-code-copy',
      options: {
        buttonStyle: {
          border: 'none'
        }
      }
    }
  ],
  template: {
    openLinkInNewTab: true
  }
}

module.exports = config
