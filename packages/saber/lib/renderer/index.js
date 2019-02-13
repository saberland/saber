const path = require('path')
const { fs } = require('saber-utils')
const { log } = require('saber-log')

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

      config.module.rule('js').resourceQuery(query => {
        return !query.match(/saberPage/)
      })

      config.module
        .rule('saber-page-js')
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
              whitelist: [/\.(?!(?:jsx?|json)$).{1,5}(\?.+)?$/i]
            })
          ])
        )
      } else if (type === 'client') {
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
        .map(page => {
          const chunkNameComment = `/* webpackChunkName: "page--${
            page.internal.file
              ? path
                  .relative(this.api.resolveCwd('pages'), page.internal.file)
                  .replace(/[^a-z0-9_-]/gi, '-')
              : page.internal.id
          }" */ `
          const componentPath = page.internal.file
            ? `${page.internal.file}?saberPage=${page.internal.id}`
            : `#cache/pages/${page.internal.id}.pson`
          return `{
              path: ${JSON.stringify(page.attributes.permalink)},
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
            path.join(__dirname, 'app/404.vue')
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
      require(this.api.resolveCache('dist-server/bundle-manifest.json')),
      {
        clientManifest: require(this.api.resolveCache(
          'dist-client/bundle-manifest.json'
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
        const html = `<!DOCTYPE html>${require('./saber-document')(
          context,
          markup
        )}`
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

    // Copy files in public/ to the root of .saber/public/
    const publicFolder = this.api.resolveCwd('public')
    if (await fs.pathExists(publicFolder)) {
      await fs.copy(publicFolder, this.api.resolveCache('public'))
    }
  }

  getRequestHandler() {
    const webpack = require('webpack')
    const server = require('polka')()

    let renderer
    let clientManifest
    let serverBundle

    const clientConfig = this.api
      .createWebpackChain({ type: 'client' })
      .toConfig()
    const serverConfig = this.api
      .createWebpackChain({ type: 'server' })
      .toConfig()

    clientConfig.entry.client.unshift(
      require.resolve('webpack-hot-middleware/client')
    )
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

    const clientCompiler = webpack(clientConfig)
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

    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
      logLevel: 'silent',
      publicPath: clientConfig.output.publicPath
    })

    clientCompiler.hooks.done.tap('get-bundle-manifest', stats => {
      if (!stats.hasErrors()) {
        clientManifest = JSON.parse(
          devMiddleware.fileSystem.readFileSync(
            this.api.resolveCache('dist-client/bundle-manifest.json'),
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
            this.api.resolveCache('dist-server/bundle-manifest.json'),
            'utf8'
          )
        )
        updateRenderer()
      }
    })

    server.use(
      require('serve-static')(this.api.resolveCwd('public'), {
        dotfiles: 'allow'
      })
    )

    server.use(devMiddleware)
    server.use(
      require('webpack-hot-middleware')(clientCompiler, {
        log: false
      })
    )
    serverCompiler.watch({}, () => {})

    server.get('*', async (req, res) => {
      if (!renderer) {
        return res.end(`Please wait for compilation..`)
      }
      try {
        const context = { url: req.url, req, res }
        const markup = await renderer.renderToString(context)
        const html = `<!DOCTYPE html>${require('./saber-document')(
          context,
          markup
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

    return server.handler
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
