const path = require('path')
const http = require('http')
const { log, colors } = require('saber-log')
const resolveFrom = require('resolve-from')
const { SyncHook, AsyncSeriesHook, SyncWaterfallHook } = require('tapable')
const Source = require('./Source')
const VueRenderer = require('./renderer')
const BrowserApi = require('./BrowserApi')
const Transformers = require('./Transformers')
const configLoader = require('./utils/configLoader')
const resolvePackage = require('./utils/resolvePackage')

class Saber {
  constructor(opts = {}) {
    this.opts = opts
    this.opts.cwd = path.resolve(opts.cwd || '.')
    this.source = new Source(this)
    this.browserApi = new BrowserApi(this)
    this.hooks = {
      // Extend webpack config
      chainWebpack: new SyncHook(['config', 'opts']),
      // Before running the build process
      beforeRun: new AsyncSeriesHook(['opts']),
      filterPlugins: new SyncWaterfallHook(['plugins']),
      // After all plugins have been applied
      afterPlugins: new SyncHook(),
      // Called before creating pages for the first time
      initPages: new AsyncSeriesHook(),
      // After all pages haven't added to our `source`
      afterPages: new AsyncSeriesHook(),
      // Emit pages as .saberpage files when necessary
      emitPages: new AsyncSeriesHook(),
      // Call this hook to create a page which will also invoke `onCreatePage` hook
      createPage: new SyncHook(['page']),
      // Called when a new page is added
      onCreatePage: new SyncHook(['page']),
      // Call this hook to manipulate a page
      manipulatePage: new SyncHook(['data']),
      emitRoutes: new AsyncSeriesHook()
    }
    this.transformers = new Transformers()

    if (opts.debug) {
      process.env.SABER_DEBUG = true
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
      this.theme = resolvePackage(this.config.theme, {
        cwd: this.configDir,
        prefix: 'saber-theme-'
      })
    } else {
      this.theme = VueRenderer.defaultTheme
    }
    log.debug(`Using theme: ${this.theme}`)
  }

  getPlugins() {
    const builtinPlugins = [
      { resolve: require.resolve('./plugins/extend-browser-api') },
      { resolve: require.resolve('./plugins/extend-node-api') },
      { resolve: require.resolve('./plugins/transformer-markdown') },
      { resolve: require.resolve('./plugins/transformer-default') },
      { resolve: require.resolve('./plugins/transformer-components') },
      { resolve: require.resolve('./plugins/config-css') },
      { resolve: require.resolve('./plugins/config-image') },
      { resolve: require.resolve('./plugins/config-font') },
      { resolve: require.resolve('./plugins/config-other-loaders') },
      { resolve: require.resolve('./plugins/emit-config') },
      { resolve: require.resolve('./plugins/source-pages') },
      { resolve: require.resolve('./plugins/blog'), options: this.config.blog }
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

    const plugins = this.hooks.filterPlugins.call([
      ...builtinPlugins,
      ...configPlugins
    ])

    return plugins.map(p => {
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
    opts = Object.assign({ type: 'client' }, opts)
    const config = require('./webpack/webpack.config')(this, opts)
    this.hooks.chainWebpack.call(config, opts)
    return config
  }

  async run({ watch } = {}) {
    await this.hooks.beforeRun.promise({ watch })

    await this.hooks.emitRoutes.promise()
  }

  // Build your app
  async build() {
    await this.run()
    await this.renderer.build()
  }

  // Build your app and generate static HTML files for each path
  async generate({ skipBuild } = {}) {
    await this.run()
    if (!skipBuild) {
      await this.renderer.build()
    }
    await this.renderer.generate()
  }

  async dev({ ssr } = {}) {
    await this.run({ watch: true })

    const server = http.createServer(this.renderer.getRequestHandler({ ssr }))

    server.listen(3000)
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

  localResolve(name) {
    return require('resolve-from').silent(this.opts.cwd, name)
  }

  localRequire(name) {
    const resolved = this.localResolve(name)
    return resolved && require(resolved)
  }
}

module.exports = opts => new Saber(opts)
