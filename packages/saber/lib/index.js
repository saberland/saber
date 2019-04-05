const path = require('path')
const http = require('http')
const { fs } = require('saber-utils')
const { log, colors } = require('saber-log')
const resolveFrom = require('resolve-from')
const merge = require('lodash.merge')
const { SyncHook, AsyncSeriesHook, SyncWaterfallHook } = require('tapable')
const Pages = require('./Pages')
const BrowserApi = require('./BrowserApi')
const Transformers = require('./Transformers')
const configLoader = require('./utils/configLoader')
const resolvePackage = require('./utils/resolvePackage')

class Saber {
  constructor(opts = {}, config = {}) {
    this.opts = opts
    this.opts.cwd = path.resolve(opts.cwd || '.')
    this.initialConfig = config
    this.pages = new Pages(this)
    this.browserApi = new BrowserApi(this)
    this.log = log
    this.colors = colors
    this.utils = require('saber-utils')
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
      // Called when all pages are added to our `source`
      onCreatePages: new AsyncSeriesHook(),
      // Emit pages as .saberpage files when necessary
      emitPages: new AsyncSeriesHook(),
      // Call this hook to create a page which will also invoke `onCreatePage` hook
      createPage: new SyncHook(['page']),
      // Called when a new page is added
      onCreatePage: new SyncHook(['page']),
      // Call this hook to manipulate a page
      manipulatePage: new SyncHook(['data']),
      emitRoutes: new AsyncSeriesHook(),
      // Called after running webpack
      afterBuild: new AsyncSeriesHook(),
      // Called after generate static HTML files
      afterGenerate: new AsyncSeriesHook(),
      getDocument: new SyncWaterfallHook(['html', 'document']),
      defineVariables: new SyncWaterfallHook(['variables'])
    }
    this.transformers = new Transformers()
    this.requestHandlers = {}

    for (const hook of Object.keys(this.hooks)) {
      const debugHooks = ['createPage', 'onCreatePage']
      this.hooks[hook].intercept({
        register(tapInfo) {
          const { fn, name } = tapInfo
          tapInfo.fn = (...args) => {
            const msg = `${hook} ${colors.dim(`(${name})`)}`
            if (debugHooks.includes(hook)) {
              log.debug(msg)
            } else {
              log.info(msg)
            }
            return fn(...args)
          }
          return tapInfo
        }
      })
    }

    if (opts.debug) {
      process.env.SABER_DEBUG = true
    }

    this.prepare()
  }

  get mode() {
    return this.opts.mode
  }

  prepare() {
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

    this.setConfig(config, configPath)

    this.RendererClass = this.config.renderer
      ? resolvePackage(this.config.renderer, {
          cwd: this.configDir,
          prefix: 'saber-renderer-'
        })
      : require('./renderer')
    this.renderer = new this.RendererClass(this)

    // Load theme
    if (this.config.theme) {
      this.theme = resolvePackage(this.config.theme, {
        cwd: this.configDir,
        prefix: 'saber-theme-'
      })
      // When a theme is loaded from `node_modules` and `$theme/dist` directory exists
      // We use the `dist` directory instead
      if (/node_modules/.test(this.theme)) {
        const distDir = path.join(this.theme, 'dist')
        if (fs.existsSync(distDir)) {
          this.theme = distDir
        }
      }
    } else {
      this.theme = this.RendererClass.defaultTheme
    }
    log.info(`Using theme: ${this.theme}`)

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
  }

  setConfig(config, configPath = this.configPath) {
    this.configPath = configPath
    if (configPath) {
      this.configDir = path.dirname(configPath)
    } else {
      this.configDir = null
    }

    this.config = merge({}, config, this.initialConfig)
    // Validate config, apply default values, normalize some values
    this.config = require('./utils/validateConfig')(this.config, {
      mode: this.mode
    })
  }

  getPlugins() {
    const builtinPlugins = [
      { resolve: require.resolve('./plugins/source-pages') },
      { resolve: require.resolve('./plugins/extend-browser-api') },
      { resolve: require.resolve('./plugins/extend-node-api') },
      { resolve: require.resolve('./plugins/transformer-markdown') },
      { resolve: require.resolve('./plugins/transformer-default') },
      { resolve: require.resolve('./plugins/transformer-components') },
      { resolve: require.resolve('./plugins/config-css') },
      { resolve: require.resolve('./plugins/config-image') },
      { resolve: require.resolve('./plugins/config-font') },
      { resolve: require.resolve('./plugins/config-other-loaders') },
      { resolve: require.resolve('./plugins/watch-config') },
      { resolve: require.resolve('./plugins/layouts') },
      { resolve: require.resolve('./plugins/emit-saber-variables') }
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

  resolveOwnDir(...args) {
    return path.join(__dirname, '../', ...args)
  }

  createWebpackChain(opts) {
    opts = Object.assign({ type: 'client' }, opts)
    const config = require('./webpack/webpack.config')(this, opts)
    this.hooks.chainWebpack.call(config, opts)
    return config
  }

  getDocument(context) {
    const initialHTML = this.RendererClass.getDocument(context)
    return this.hooks.getDocument.call(initialHTML, context)
  }

  async run({ watch } = {}) {
    await this.hooks.beforeRun.promise({ watch })

    await this.hooks.emitRoutes.promise()
  }

  // Build your app
  async build() {
    await this.run()
    await this.renderer.build()
    await this.hooks.afterBuild.promise()
  }

  // Build your app and generate static HTML files for each path
  async generate({ skipBuild } = {}) {
    await this.run()
    if (!skipBuild) {
      await this.renderer.build()
      await this.hooks.afterBuild.promise()
    }
    await this.renderer.generate()
    await this.hooks.afterGenerate.promise()
  }

  async dev() {
    await this.run({ watch: true })

    const server = http.createServer(
      this.renderer.getRequestHandler({ ssr: this.config.server.ssr })
    )

    server.listen(this.config.server.port, this.config.server.host)
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

module.exports = (opts, config) => new Saber(opts, config)
