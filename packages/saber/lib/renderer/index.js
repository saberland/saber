const path = require('path')
const { fs } = require('saber-utils')
const { log } = require('saber-log')
const slash = require('../utils/slash')

const ID = 'vue-renderer'

class VueRenderer {
  constructor(api) {
    this.api = api

    this.api.hooks.chainWebpack.tap(ID, (config, { type }) => {
      config.entry(type).add(path.join(__dirname, `app/entry-${type}.js`))

      config.output.path(api.resolveCache(`dist-${type}`))

      // Use locally installed Vue if possible
      if (api.hasDependency('vue')) {
        config.resolve.alias.set(
          'vue',
          path.dirname(api.localResolve('vue/package.json'))
        )
      } else {
        // Otherwise use the one shipped with Saber
        config.resolve.alias.set(
          'vue',
          path.dirname(require.resolve('vue/package.json'))
        )
      }

      config.plugin('vue').use(require('vue-loader/lib/plugin'))

      // Handle `<extend-component>` block in .vue file
      config.module
        .rule('extend-component')
        .resourceQuery(/blockType=extend-component/)
        .use('extend-component-loader')
        .loader(require.resolve('./extend-component-loader'))

      // prettier-ignore
      config.module
        .rule('js')
        .oneOf('saber-page')
          .before('normal')
          .resourceQuery(/saberPage/)
          .use('vue-loader')
            .loader('vue-loader')
            .end()
          .use('saber-page-loader')
            .loader(require.resolve('./saber-page-loader'))
            .options({
              api
            })

      const { supportedExtensions } = api.transformers
      const pageExtensions = supportedExtensions
        .map(ext => new RegExp(`\\.${ext}$`))
        .filter(re => !re.test('.js'))

      config.module
        .rule('saber-page')
        .test(pageExtensions.concat(/\.saberpage$/))
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
              filename: '../bundle-manifest/server.json'
            }
          ])

        const externals = config.get('externals') || []
        config.externals(
          externals.concat([
            require('webpack-node-externals')({
              whitelist: ['saber/config', /\.(?!(?:jsx?|json)$).{1,5}(\?.+)?$/i]
            })
          ])
        )
      } else if (type === 'client') {
        config
          .plugin('vue-ssr')
          .use(require('vue-server-renderer/client-plugin'), [
            {
              filename: '../bundle-manifest/client.json'
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
        .map(page => {
          const relativePath = slash(page.internal.relative)
          const absolutePath = slash(page.internal.absolute)
          const chunkNameComment = `/* webpackChunkName: "page--${
            page.internal.isFile
              ? path
                  .relative(this.api.resolveCwd('pages'), absolutePath)
                  .replace(/[^a-z0-9_-]/gi, '-')
              : page.internal.id
          }" */ `
          const componentPath = page.internal.isFile
            ? `${absolutePath}?saberPage=${page.internal.id}`
            : `#cache/pages/${page.internal.id}.saberpage`
          return `{
              path: ${JSON.stringify(page.attributes.permalink)},
              meta: {
                __relative: ${JSON.stringify(relativePath)}
              },
              component: function() {
                ${`
                return import(${chunkNameComment}${JSON.stringify(
                  componentPath
                )})
                `}
              }
            }`
        })
        .join(',\n')},
      // An addtional route to catch all other requests, i.e. 404 page
      {
        path: '*',
        name: 404,
        component: function () {
          return import(/* webpackChunkName: "404-page" */ ${JSON.stringify(
            slash(path.join(__dirname, 'app/404.vue'))
          )})
        }
      }
    ]`

    if (routes !== this.prevRoutes) {
      this.prevRoutes = routes
      await fs.outputFile(this.api.resolveCache('routes.js'), routes, 'utf8')
    }
  }

  async build() {
    const clientConfig = this.api
      .createWebpackChain({ type: 'client' })
      .toConfig()
    const serverConfig = this.api
      .createWebpackChain({ type: 'server' })
      .toConfig()

    // Remove dist-client
    await fs.remove(this.api.resolveCache('dist-client'))

    const clientCompiler = require('webpack')(clientConfig)
    const serverCompiler = require('webpack')(serverConfig)
    await Promise.all([
      runCompiler(clientCompiler),
      runCompiler(serverCompiler)
    ])
  }

  async generate() {
    // Remove .saber/public
    await fs.remove(this.api.resolveCache('public'))

    const { createBundleRenderer } = require('vue-server-renderer')
    const renderer = createBundleRenderer(
      require(this.api.resolveCache('bundle-manifest/server.json')),
      {
        clientManifest: require(this.api.resolveCache(
          'bundle-manifest/client.json'
        )),
        runInNewContext: false,
        inject: false,
        basedir: this.api.resolveCache('dist-server')
      }
    )
    const getFileName = permalink => {
      const filename = permalink.endsWith('.html')
        ? permalink
        : permalink.replace(/\/?$/, '/index.html')
      return path.join(this.api.resolveCache('public'), filename)
    }
    await Promise.all(
      [
        ...this.api.source.pages.values(),
        {
          attributes: {
            permalink: '/__never_existed__.html',
            generatedFileName: '404.html'
          }
        }
      ].map(async page => {
        const context = { url: page.attributes.permalink }
        const generatedFileName = getFileName(
          page.attributes.generatedFileName || page.attributes.permalink
        )
        log.info(
          'Generating',
          path.relative(this.api.resolveCache('public'), generatedFileName)
        )
        const markup = await renderer.renderToString(context)
        const html = `<!DOCTYPE html>${this.api.getDocument(context)}`
          .replace(/^\s+/gm, '')
          .replace(/\n+</g, '<')
          .replace('<div id="_saber"></div>', markup)
        await fs.outputFile(generatedFileName, html, 'utf8')
      })
    )

    // Copy .saber/dist-client to .saber/public/_saber
    await fs.copy(
      this.api.resolveCache('dist-client'),
      this.api.resolveCache('public/_saber')
    )

    const copyPublicFiles = async dir => {
      if (await fs.pathExists(dir)) {
        await fs.copy(dir, this.api.resolveCache('public'))
      }
    }

    // Copy files in $theme/public/ to the root of .saber/public/
    await copyPublicFiles(path.join(this.api.theme, 'public'))
    // Copy files in public/ to the root of .saber/public/
    await copyPublicFiles(this.api.resolveCwd('public'))
  }

  getRequestHandler({ ssr } = {}) {
    const webpack = require('webpack')
    const server = require('polka')()

    let renderer
    let clientManifest
    let serverBundle

    const clientConfig = this.api
      .createWebpackChain({ type: 'client' })
      .toConfig()

    clientConfig.entry.client.unshift(
      require.resolve('webpack-hot-middleware/client')
    )
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

    const clientCompiler = webpack(clientConfig)

    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
      logLevel: 'silent',
      publicPath: clientConfig.output.publicPath
    })

    if (ssr) {
      const serverConfig = this.api
        .createWebpackChain({ type: 'server' })
        .toConfig()
      const serverCompiler = webpack(serverConfig)
      const updateRenderer = () => {
        if (clientManifest && serverBundle) {
          const { createBundleRenderer } = require('vue-server-renderer')
          renderer = createBundleRenderer(serverBundle, {
            clientManifest,
            runInNewContext: false,
            inject: false,
            basedir: this.api.resolveCache('dist-server')
          })
          log.debug('Updated server renderer')
        }
      }
      clientCompiler.hooks.done.tap('get-bundle-manifest', stats => {
        if (!stats.hasErrors()) {
          clientManifest = JSON.parse(
            devMiddleware.fileSystem.readFileSync(
              this.api.resolveCache('bundle-manifest/client.json'),
              'utf8'
            )
          )
          updateRenderer()
        }
      })

      const serverMFS = new webpack.MemoryOutputFileSystem()
      serverCompiler.outputFileSystem = serverMFS
      serverCompiler.hooks.done.tap('get-bundle-manifest', stats => {
        if (!stats.hasErrors()) {
          serverBundle = JSON.parse(
            serverMFS.readFileSync(
              this.api.resolveCache('bundle-manifest/server.json'),
              'utf8'
            )
          )
          updateRenderer()
        }
      })

      serverCompiler.watch({}, () => {})
    }

    server.use(
      require('serve-static')(this.api.resolveCwd('public'), {
        dotfiles: 'allow'
      })
    )
    server.use(
      require('serve-static')(path.join(this.api.theme, 'public'), {
        dotfiles: 'allow'
      })
    )

    server.use(devMiddleware)
    server.use(
      require('webpack-hot-middleware')(clientCompiler, {
        log: false
      })
    )

    if (ssr) {
      server.get('*', async (req, res) => {
        if (!renderer) {
          return res.end(`Please wait for compilation..`)
        }
        try {
          const context = { url: req.url, req, res }
          const markup = await renderer.renderToString(context)
          const html = `<!DOCTYPE html>${this.api.getDocument(
            context
          )}`.replace('<div id="_saber"></div>', markup)
          res.setHeader('content-type', 'text/html')
          res.end(html)
        } catch (error) {
          log.error(error.stack)
          res.statusCode = 500
          if (this.api.mode === 'production') {
            res.end('Interal server error')
          } else {
            res.end(error.stack)
          }
        }
      })
    } else {
      const head = new Proxy(
        {},
        {
          get() {
            return ''
          }
        }
      )
      const noop = () => ''
      const renderScripts = () =>
        `<script src="/_saber/js/client.js" defer></script>`
      server.get('*', (req, res) => {
        const context = {
          url: req.url,
          head,
          renderStyles: noop,
          renderScripts,
          renderState: noop
        }
        const html = `<!DOCTYPE html>${this.api.getDocument(context)}`
        res.setHeader('content-type', 'text/html')
        res.end(html)
      })
    }

    return server.handler
  }
}

VueRenderer.defaultTheme = path.join(__dirname, 'app/theme')
VueRenderer.getDocument = require('./get-document')

module.exports = VueRenderer

function runCompiler(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}
