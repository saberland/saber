const path = require('path')
const { fs } = require('saber-utils')
const { log, colors } = require('saber-log')
const resolveFrom = require('resolve-from')
const { SyncHook, AsyncSeriesHook } = require('tapable')
const Source = require('./Source')
const VueRenderer = require('./renderer')
const configLoader = require('./utils/configLoader')

class Saber {
  constructor(opts = {}) {
    this.opts = opts
    this.opts.cwd = path.resolve(opts.cwd || '.')
    this.source = new Source(this)
    this.hooks = {
      // Extend webpack config
      chainWebpack: new SyncHook(['config', 'opts']),
      // Before running the build process
      beforeRun: new AsyncSeriesHook(['opts']),
      // After all plugins have been applied
      afterPlugins: new SyncHook(),
      // After all pages haven't added to our `source`
      afterPages: new SyncHook(),
      // Emit pages as .pson files when necessary
      emitPages: new AsyncSeriesHook(),
      // Called when a page is added, changed or removed
      page: new SyncHook(['data']),
      emitRoutes: new AsyncSeriesHook()
    }
    this.transformers = new Map()

    if (opts.debug) {
      log.setOptions({ debug: true })
    }

    this.prepare()
  }

  get mode() {
    return this.opts.mode
  }

  prepare() {
    this.renderer = new VueRenderer(this)

    // Load package.json data
    this.pkg = configLoader.load({
      files: ['package.json'],
      cwd: this.opts.cwd
    })
    this.pkg.data = this.pkg.data || {}

    // Load Saber config
    const { data: config, path: configPath } = configLoader.load({
      files: configLoader.CONFIG_FILES,
      cwd: this.opts.cwd
    })
    if (configPath) {
      this.configPath = configPath
      this.configDir = path.dirname(configPath)
      this.config = config
    } else {
      this.config = {}
    }

    // Validate config, apply default values, normalize some values
    this.config = require('./utils/validateConfig')(this.config, {
      configDir: this.configDir
    })

    // Load plugins
    for (const plugin of this.getPlugins()) {
      plugin.plugin.apply(this, plugin.options)
      log.debug(
        `Using plugin "${colors.bold(plugin.plugin.name)}" ${colors.dim(
          plugin.resolve
        )}`
      )
    }

    this.hooks.afterPlugins.call()

    // Load theme
    if (this.config.theme) {
      this.theme = /^[./]|(^[a-zA-Z]:)/.test(this.config.theme)
        ? path.resolve(this.configDir, this.config.theme)
        : path.dirname(
            require('resolve-from')(
              this.configDir,
              this.config.theme.replace(/^(saber-theme-)?/, 'saber-theme-'),
              'package.json'
            )
          )
    } else {
      this.theme = VueRenderer.defaultTheme
    }
    log.debug(`Using theme: ${this.theme}`)
  }

  getPlugins() {
    const builtinPlugins = [
      { resolve: require.resolve('./plugins/extend-browser-api') },
      { resolve: require.resolve('./plugins/transformer-markdown') },
      { resolve: require.resolve('./plugins/transformer-js') },
      { resolve: require.resolve('./plugins/transformer-vue') },
      { resolve: require.resolve('./plugins/config-css') },
      { resolve: require.resolve('./plugins/config-image') },
      { resolve: require.resolve('./plugins/config-font') },
      { resolve: require.resolve('./plugins/config-other-loaders') },
      { resolve: require.resolve('./plugins/emit-config') },
      { resolve: require.resolve('./plugins/source-pages') },
      { resolve: require.resolve('./plugins/inject-posts') }
    ]

    // Plugins that are specified in user config, a.k.a. saber-config.js etc
    const configPlugins =
      this.configDir && this.config.plugins
        ? this.config.plugins.map(p => {
            if (typeof p === 'string') {
              p = { resolve: p }
            }
            p.resolve = resolveFrom(this.configDir, p.resolve)
            return p
          })
        : []

    // Auto-load the plugins from package.json
    // Basically any dependency starting with `saber-plugin-`
    const pkgPlugins = this.getDependencies()
      .filter(name => name.startsWith('saber-plugin-'))
      .map(name => {
        return {
          resolve: resolveFrom(path.dirname(this.pkg.path), name)
        }
      })
      .filter(pkgPlugin => {
        // If a plugin exists in both pkgPlugins and configPlugins
        // Remove it from pkgPlugins
        return configPlugins.every(
          configPlugin => configPlugin.resolve !== pkgPlugin.resolve
        )
      })

    return [...builtinPlugins, ...pkgPlugins, ...configPlugins].map(p => {
      p.plugin = require(p.resolve)
      return p
    })
  }

  resolveCache(...args) {
    return this.resolveCwd('.saber', ...args)
  }

  resolveCwd(...args) {
    return path.resolve(this.opts.cwd, ...args)
  }

  createWebpackChain(opts) {
    opts = Object.assign({ type: 'browser' }, opts)
    const config = require('./webpack/webpack.config')(this, opts)
    this.hooks.chainWebpack.call(config, opts)
    return config
  }

  registerTransformer(ext, transform) {
    this.transformers.set(ext, transform)
  }

  getTransformer(file) {
    for (const ext of this.transformers.keys()) {
      if (file.absolute.endsWith(`.${ext}`)) {
        return this.transformers.get(ext)
      }
    }
  }

  async run({ watch } = {}) {
    await this.hooks.beforeRun.promise({ watch })

    await this.hooks.emitRoutes.promise()
  }

  async build() {
    await this.run()
    await this.renderer.$build()
    await this.renderer.$generate()
  }

  async dev() {
    await this.run({ watch: true })

    const webpack = require('webpack')
    const server = require('polka')()
    const config = this.createWebpackChain({ type: 'browser' }).toConfig()

    config.entry.browser.unshift(
      require.resolve('webpack-hot-middleware/client')
    )
    config.plugins.push(new webpack.HotModuleReplacementPlugin())

    const compiler = webpack(config)

    server.use(
      require('webpack-dev-middleware')(compiler, {
        logLevel: 'silent'
      })
    )
    server.use(
      require('webpack-hot-middleware')(compiler, {
        log: false
      })
    )

    const htmlTemplate = await fs.readFile(VueRenderer.htmlTemplate, 'utf8')

    server.get('*', (req, res) => {
      if (req.headers.accept.includes('text/html')) {
        res.setHeader('content-type', 'text/html')
        res.end(
          htmlTemplate.replace(
            '<div id="_saber"></div>',
            `$&
        <script src="/_saber/js/browser.js"></script>`
          )
        )
      } else {
        res.statusCode = 404
        res.end()
      }
    })

    server.listen(2020)
  }

  hasDependency(name) {
    return this.getDependencies().includes(name)
  }

  getDependencies() {
    return [
      ...Object.keys(this.pkg.data.dependencies || {}),
      ...Object.keys(this.pkg.data.devDependencies || {})
    ]
  }

  localRequire(name) {
    const resolved = require('resolve-from').silent(this.opts.cwd, name)
    return resolved && require(resolved)
  }
}

module.exports = opts => new Saber(opts)
