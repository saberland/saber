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
  permalinks: { post: '/blog/:slug.html' },
  themeConfig: {
    sidebarMenu: [
      {
        title: 'Basics',
        children: [
          { title: 'Introduction', link: '/docs' },
          { title: 'Installation', link: '/docs/installation.html' },
          { title: 'Project Structure', link: '/docs/project-structure.html' },
          { title: 'Pages', link: '/docs/pages.html' },
          { title: 'Routing', link: '/docs/routing.html' },
          { title: 'Permalinks', link: '/docs/permalinks.html' },
          { title: 'Layouts', link: '/docs/layouts.html' },
          { title: 'Themes', link: '/docs/themes.html' },
          { title: 'Markdown Features', link: '/docs/markdown-features.html' },
          {
            title: 'Using Vue in Markdown',
            link: '/docs/using-vue-in-markdown.html'
          },
          {
            title: 'Manipulating <head>',
            link: '/docs/manipulating-head.html'
          },
          { title: 'Page Transition', link: '/docs/page-transition.html' },
          { title: 'Internationalization', link: '/docs/i18n.html' },
          {
            title: 'Working with Webpack',
            link: '/docs/working-with-webpack.html'
          },
          { title: 'Deployment', link: '/docs/deployment.html' }
        ]
      },
      {
        title: 'Styles and Assets',
        children: [
          { title: 'Using CSS Modules', link: '/docs/css-modules.html' },
          {
            title: 'Using CSS Preprocessors',
            link: '/docs/css-preprocessors.html'
          },
          { title: 'Using PostCSS', link: '/docs/postcss.html' },
          {
            title: 'Using Images, Fonts and Files',
            link: '/docs/images-fonts-and-files.html'
          },
          { title: 'Using the Static Folder', link: '/docs/static-folder.html' }
        ]
      },
      {
        title: 'References',
        children: [
          { title: 'Saber Config', link: '/docs/saber-config.html' },
          { title: 'Built-in Components', link: '/docs/components.html' },
          { title: 'Plugin API', link: '/docs/plugin-api.html' },
          { title: 'Saber Instance', link: '/docs/saber-instance.html' },
          { title: 'Saber Browser APIs', link: '/docs/browser-apis.html' },
          { title: 'Saber Node APIs', link: '/docs/node-apis.html' },
          { title: 'Page Interface', link: '/docs/page-interface.html' }
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
