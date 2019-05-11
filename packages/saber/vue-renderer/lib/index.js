const path = require('path')
const { EventEmitter } = require('events')
const { fs, slash } = require('saber-utils')
const { log } = require('saber-log')
const { SyncWaterfallHook } = require('tapable')

const ID = 'vue-renderer'

class VueRenderer {
  constructor(api) {
    this.api = api
    // In dev mode pages will be built when visited
    this.visitedRoutes = new Set()
    this.builtRoutes = new Set()

    this.hooks = {
      getVueLoaderOptions: new SyncWaterfallHook(['options'])
    }

    this.api.hooks.chainWebpack.tap(ID, (config, { type }) => {
      config.entry(type).add(path.join(__dirname, `../app/entry-${type}.js`))

      config.output.path(api.resolveCache(`dist-${type}`))

      config.resolve.extensions.merge(['.vue'])

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

      // Transform js files in ../app folder
      config.module.rule('js').include.add(path.join(__dirname, '../app'))

      const vueLoaderOptions = this.hooks.getVueLoaderOptions.call({
        compilerOptions: {
          modules: []
        },
        transformAssetUrls: {}
      })

      // Add `saber-page` rule under `js` rule to handle .js pages
      // prettier-ignore
      config.module
        .rule('js')
        .oneOf('saber-page')
          .before('normal')
          .resourceQuery(query => {
            return /saberPage/.test(query) && !/type=script/.test(query)
          })
          .use('vue-loader')
            .loader('vue-loader')
            .options(vueLoaderOptions)
            .end()
          .use('saber-page-loader')
            .loader(require.resolve('./saber-page-loader'))
            .options({
              api
            })

      // Handle .vue components and .vue pages
      // prettier-ignore
      config.module.rule('vue')
        .test(/\.vue$/)
        .use('vue-loader')
          .loader('vue-loader')
          .options(vueLoaderOptions)
          .end()
        // saber-page-loader will return original content
        // if the resource query doesn't contain `saberPage`
        .use('saber-page-loader')
          .loader(require.resolve('./saber-page-loader'))
          .options({
            api
          })

      // Get the available extensions for pages
      // Excluding .vue and .js pages because we handled them in their own rules
      const { supportedExtensions } = api.transformers
      const pageExtensions = supportedExtensions
        .map(ext => new RegExp(`\\.${ext}$`))
        .filter(re => !re.test('.js') && !re.test('.vue'))
        .concat(/\.saberpage$/)

      config.module
        .rule('saber-page')
        .test(pageExtensions)
        .resourceQuery(query => {
          return /saberPage/.test(query)
        })
        .use('vue-loader')
        .loader('vue-loader')
        .options(vueLoaderOptions)
        .end()
        .use('saber-page-loader')
        .loader(require.resolve('./saber-page-loader'))
        .options({
          api
        })

      // Handle `<page-prop>` block in .vue file
      config.module
        .rule('page-prop')
        .type('javascript/auto')
        .resourceQuery(/blockType=page-prop/)
        .use('page-prop-loader')
        .loader(require.resolve('./page-prop-loader'))
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
              whitelist: [
                'saber/config',
                'saber/variables',
                /\.(?!(?:jsx?|json)$).{1,5}(\?.+)?$/i
              ]
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
    if (this._writingRoutes) {
      return
    }

    this._writingRoutes = true
    const pages = [...this.api.pages.values()]
    const redirectRoutesInBrowser = [...this.api.pages.redirectRoutes.values()]
      .filter(route => route.redirectInBrowser)
      .map(
        route => `{ path: '${route.fromPath}', redirect: '${route.toPath}' }`
      )
      .join(',\n')
    const routes = `
    export default [
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
          // Always give the path a resource query
          const componentPath = page.internal.isFile
            ? `${absolutePath}?saberPage=${page.internal.id}`
            : `#cache/pages/${page.internal.id}.saberpage?saberPage=${
                page.internal.id
              }`
          return `{
              path: ${JSON.stringify(page.attributes.permalink)},
              meta: {
                __relative: '${relativePath}',
                __pageId: '${page.internal.id}'
              },
              component: function() {
                ${
                  this.api.lazy &&
                  !this.visitedRoutes.has(page.attributes.permalink)
                    ? 'return Promise.resolve({render: function(){}})'
                    : `
                return import(${chunkNameComment}${JSON.stringify(
                        componentPath
                      )})
                `
                }
              }
            }`
        })
        .join(',\n')},
      ${redirectRoutesInBrowser ? `${redirectRoutesInBrowser},` : ''}
      // An addtional route to catch all other requests, i.e. 404 page
      {
        path: '*',
        name: 404,
        component: function () {
          return import(/* webpackChunkName: "404-page" */ ${JSON.stringify(
            slash(path.join(__dirname, '../app/404.vue'))
          )})
        }
      }
    ]`

    if (routes !== this.prevRoutes) {
      this.prevRoutes = routes
      await fs.outputFile(this.api.resolveCache('routes.js'), routes, 'utf8')
    }

    this._writingRoutes = false
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
    const outDir = this.api.resolveOutDir()

    // Remove output directory
    await fs.remove(outDir)

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

    const getOutputFilePath = permalink => {
      const filename = permalink.endsWith('.html')
        ? permalink
        : permalink.replace(/\/?$/, '/index.html')
      return path.join(outDir, filename)
    }

    /**
     * @param {Array<{permalink:string, outputFilePath: string}>} routes
     */
    const writeFiles = routes =>
      Promise.all(
        routes.map(async route => {
          const context = {
            url: route.permalink
          }
          log.info('Generating', path.relative(outDir, route.outputFilePath))
          try {
            const markup = await renderer.renderToString(context)
            let documentData = require('./get-initial-document-data')(context)
            documentData = this.api.hooks.getDocumentData.call(
              documentData,
              context
            )
            let document = require('./get-initial-document')(documentData)
            document = this.api.hooks.getDocument.call(document, context)
            const html = `<!DOCTYPE html>${document}`
              .replace(/^\s+/gm, '')
              .replace(/\n+</g, '<')
              .replace('<div id="_saber"></div>', markup)
            const exportedPage = {
              content: html,
              path: route.outputFilePath
            }
            await this.api.hooks.beforeExportPage.promise(context, exportedPage)
            await fs.outputFile(route.outputFilePath, html, 'utf8')
            await this.api.hooks.afterExportPage.promise(context, exportedPage)
          } catch (error) {
            log.error(`Failed to render ${context.url}`)
            throw error
          }
        })
      )

    await writeFiles(
      [
        ...this.api.pages.values(),
        {
          attributes: {
            permalink: '/__never_existed__.html',
            outputFilePath: '404.html'
          }
        }
      ].map(page => ({
        permalink: page.attributes.permalink,
        outputFilePath: getOutputFilePath(
          page.attributes.outputFilePath || page.attributes.permalink
        )
      }))
    )

    // Copy .saber/dist-client/ to public/_saber/
    await fs.copy(
      this.api.resolveCache('dist-client'),
      path.join(outDir, '_saber')
    )

    // Copy static files to outDir
    const copyStaticFiles = async dir => {
      if (await fs.pathExists(dir)) {
        await fs.copy(dir, outDir)
      }
    }

    // Copy files in $theme/static/ to the root of public/
    await copyStaticFiles(path.join(this.api.theme, 'static'))
    // Copy files in static/ to the root of public/
    await copyStaticFiles(this.api.resolveCwd('static'))
  }

  getRequestHandler() {
    const webpack = require('webpack')
    const server = require('polka')()

    this.api.hooks.onCreateServer.call(server)

    const clientConfig = this.api
      .createWebpackChain({ type: 'client' })
      .toConfig()

    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

    const clientCompiler = webpack(clientConfig)

    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
      logLevel: 'silent',
      publicPath: clientConfig.output.publicPath
    })

    const hotMiddleware = require('webpack-hot-middleware')(clientCompiler, {
      log: false
    })

    const event = new EventEmitter()
    clientCompiler.hooks.watchRun.tap('saber-serve', () => {
      event.emit('rebuild')
    })
    clientCompiler.hooks.done.tap('saber-serve', stats => {
      event.emit('done', stats.hasErrors())
    })

    server.get('/_saber/visit-page', async (req, res) => {
      const pathname = removeTrailingSlash(decodeURI(req.query.route))
      log.info(`Navigating to ${pathname}`)
      res.end()

      if (this.builtRoutes.has(pathname)) {
        hotMiddleware.publish({ action: 'router:push', route: pathname })
      } else {
        event.once('done', error => {
          this.builtRoutes.add(pathname)
          hotMiddleware.publish({
            action: 'router:push',
            route: pathname,
            error
          })
        })
        this.visitedRoutes.add(pathname)
        await this.writeRoutes()
      }
    })

    server.use(
      require('serve-static')(this.api.resolveCwd('static'), {
        dotfiles: 'allow'
      })
    )
    server.use(
      require('serve-static')(path.join(this.api.theme, 'static'), {
        dotfiles: 'allow'
      })
    )

    server.use(devMiddleware)
    server.use(hotMiddleware)

    server.get('*', async (req, res) => {
      if (!req.headers.accept || !req.headers.accept.includes('text/html')) {
        res.statusCode = 404
        return res.end('404')
      }

      const render = () => {
        const context = {
          url: req.url
        }

        const initialDocumentData = require('./get-initial-document-data')(
          context
        )
        context.documentData = this.api.hooks.getDocumentData.call(
          initialDocumentData
        )
        const initialDocument = require('./get-initial-document')(
          context.documentData
        )
        const html = `<!DOCTYPE html>${this.api.hooks.getDocument.call(
          initialDocument
        )}`
        res.setHeader('content-type', 'text/html')
        res.end(html)
      }

      if (!this.api.lazy) {
        return render()
      }

      const pathname = removeTrailingSlash(decodeURI(req.path))

      if (this.builtRoutes.has(pathname)) {
        render()
      } else {
        event.once('done', () => {
          this.builtRoutes.add(pathname)
          render()
        })
        this.visitedRoutes.add(pathname)
        await this.writeRoutes()
      }
    })

    return server.handler
  }
}

VueRenderer.defaultTheme = path.join(__dirname, '../app/theme')

module.exports = VueRenderer

function runCompiler(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err)
      resolve(stats)
    })
  })
}

function removeTrailingSlash(input) {
  if (input === '/') {
    return input
  }

  return input.replace(/\/$/, '')
}
