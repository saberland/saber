const path = require('path')
const { fs } = require('saber-utils')

class VueRenderer {
  constructor(api) {
    this.api = api

    this.api.hooks.chainWebpack.tap('vue-renderer', (config, { type }) => {
      config.entry(type).add(path.join(__dirname, `app/entry-${type}.js`))

      config.output.path(api.resolveCache(`dist-${type}`))

      config.plugin('vue').use(require('vue-loader/lib/plugin'))

      config.module
        .rule('pson')
        .test(/\.pson$/)
        .use('vue-loader')
        .loader(require.resolve('vue-loader'))
        .end()
        .use('pson-loader')
        .loader(require.resolve('./pson-loader'))

      config.module
        .rule('page-data')
        .resourceQuery(/blockType=page-data/)
        .use('page-data-loader')
        .loader(require.resolve('./page-data-loader'))

        config.module
        .rule('page-component')
        .resourceQuery(/blockType=page-component/)
        .use('page-component-loader')
        .loader(require.resolve('./page-component-loader'))

      config.module.rule('js')
        .resourceQuery(query => {
          return !query.match(/saberPage/)
        })

      config.module.rule('saber-page-js')
        .test(/\.js$/)
        .resourceQuery(/saberPage/)
        .use('vue-loader')
        .loader('vue-loader')
        .end()
        .use('saber-page-loader')
        .loader(require.resolve('./saber-page-loader'))
        .options({
          api
        })

      config.module
        .rule('saber-page')
        .test([/\.md$/, /\.vue$/])
        .use('vue-loader')
        .loader('vue-loader')
        .end()
        .use('saber-page-loader')
        .loader(require.resolve('./saber-page-loader'))
        .options({
          api
        })

      if (type === 'server') {
        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/server-plugin'), [
            {
              filename: 'bundle-manifest.json'
            }
          ])

        const externals = config.get('externals') || []
        config.externals(
          externals.concat([
            require('webpack-node-externals')({
              whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i]
            })
          ])
        )
      } else if (type === 'browser') {
        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/client-plugin'), [
            {
              filename: 'bundle-manifest.json'
            }
          ])
      }
    })

    api.hooks.emitRoutes.tapPromise('vue-renderer', () => this.writeRoutes())
  }

  async writeRoutes() {
    const pages = [...this.api.source.pages.values()]
    const routes = `export default [
      ${pages
        .map(
          page => `{
        path: ${JSON.stringify(page.attributes.permalink)},
        component: function() {
          ${
            page.internal.file
              ? `
          return import(${JSON.stringify(`${page.internal.file}?saberPage=${page.internal.id}`)})
          `
              : `
          return import(${JSON.stringify(`#cache/pages/${page.internal.id}.pson`)})
          `
          }
        }
      }`
        )
        .join(',\n')}
    ]`

    if (routes !== this.prevRoutes) {
      this.prevRoutes = routes
      await fs.outputFile(this.api.resolveCache('routes.js'), routes, 'utf8')
    }
  }

  async $build() {
    const browserConfig = this.api
      .createWebpackChain({ type: 'browser' })
      .toConfig()
    const serverConfig = this.api
      .createWebpackChain({ type: 'server' })
      .toConfig()

    // Remove dist-browser
    await fs.remove(this.api.resolveCache('dist-browser'))

    const browserCompiler = require('webpack')(browserConfig)
    const serverCompiler = require('webpack')(serverConfig)
    await Promise.all([
      runCompiler(browserCompiler),
      runCompiler(serverCompiler)
    ])
  }

  async $generate() {
    // Remove .saber/public
    await fs.remove(this.api.resolveCache('public'))

    const { createBundleRenderer } = require('vue-server-renderer')
    const renderer = createBundleRenderer(
      require(this.api.resolveCache('dist-server/bundle-manifest.json')),
      {
        clientManifest: require(this.api.resolveCache(
          'dist-browser/bundle-manifest.json'
        )),
        runInNewContext: false,
        inject: false
      }
    )
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, 'default-index.html'),
      'utf8'
    )
    const getFileName = permalink => {
      const filename = permalink.endsWith('.html')
        ? permalink
        : permalink.replace(/\/?$/, '/index.html')
      return path.join(this.api.resolveCache('public'), filename)
    }
    await Promise.all(
      [...this.api.source.pages.values()].map(async page => {
        const context = { url: page.attributes.permalink }
        const app = await renderer.renderToString(context)
        const {
          title,
          meta,
          link,
          style,
          script,
          noscript,
          bodyAttrs,
          headAttrs,
          htmlAttrs
        } = context.head.inject()

        const html = htmlTemplate
          .replace(
            /<title>.*<\/title>/,
            () => `
                ${meta.text()}
                ${title.text()}
                ${link.text()}
                ${context.renderStyles()}
                ${style.text()}
                ${script.text()}
                ${noscript.text()}
                `
          )
          .replace(
            /<html(\s+)?(.*)>/,
            `<html data-saber-ssr ${htmlAttrs.text()}$1$2>`
          )
          .replace(/<head(\s+)?(.*)>/, `<head ${headAttrs.text()}$1$2>`)
          .replace(/<body(\s+)?(.*)>/, `<body ${bodyAttrs.text()}$1$2>`)
          .replace(
            '</body>',
            `${context.renderState()}${context.renderScripts()}</body>`
          )
          .replace(`<div id="_saber"></div>`, app)
        await fs.outputFile(
          getFileName(page.attributes.permalink),
          html,
          'utf8'
        )
      })
    )

    // Copy .saber/dist-browser/_saber to .saber/public/_saber
    await fs.copy(
      this.api.resolveCache('dist-browser/_saber'),
      this.api.resolveCache('public/_saber')
    )

    // Copy files in public/ to the root of .saber/public/
    const publicFolder = this.api.resolveCwd('public')
    if (await fs.pathExists(publicFolder)) {
      await fs.copy(publicFolder, this.api.resolveCache('public'))
    }
  }
}

VueRenderer.defaultTheme = path.join(__dirname, 'app/theme')
VueRenderer.htmlTemplate = path.join(__dirname, 'default-index.html')

module.exports = VueRenderer

function runCompiler(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}
