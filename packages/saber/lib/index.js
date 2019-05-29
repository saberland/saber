const path = require('path')
const http = require('http')
const { fs } = require('saber-utils')
const { log, colors } = require('saber-log')
const resolveFrom = require('resolve-from')
const merge = require('lodash.merge')
const { SyncHook, AsyncSeriesHook, SyncWaterfallHook } = require('tapable')
const getPort = require('get-port')
const Pages = require('./Pages')
const BrowserApi = require('./BrowserApi')
const Transformers = require('./Transformers')
const configLoader = require('./utils/configLoader')
const resolvePackage = require('./utils/resolvePackage')
const builtinPlugins = require('./plugins')

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
      // Before all user plugins have been applied
      beforePlugins: new AsyncSeriesHook(),
      filterPlugins: new SyncWaterfallHook(['plugins']),
      // After all user plugins have been applied
      afterPlugins: new AsyncSeriesHook(),
      // Before running the build process
      beforeRun: new AsyncSeriesHook(),
      onUpdateConfigFile: new AsyncSeriesHook(),
      // Extend webpack config
      chainWebpack: new SyncHook(['config', 'opts']),
      // Extend markdown-it config
      chainMarkdown: new SyncHook(['config']),
      emitRoutes: new AsyncSeriesHook(),
      // Called after running webpack
      afterBuild: new AsyncSeriesHook(),
      // Called after generate static HTML files
      afterGenerate: new AsyncSeriesHook(),
      getDocumentData: new SyncWaterfallHook(['documentData', 'ssrContext']),
      getDocument: new SyncWaterfallHook(['document', 'ssrContext']),
      defineVariables: new SyncWaterfallHook(['variables']),
      // Called before creating pages for the first time
      initPages: new AsyncSeriesHook(),
      // Called when a new page is added
      onCreatePage: new AsyncSeriesHook(['page']),
      // Called when all pages are added to our `source`
      onCreatePages: new AsyncSeriesHook(),
      // Emit pages as .saberpage files when necessary
      emitPages: new AsyncSeriesHook(),
      // Call this hook to manipulate a page, it's usually used by file watcher
      manipulatePage: new AsyncSeriesHook(['data']),
      // Called before exporting a page as static HTML file
      beforeExportPage: new AsyncSeriesHook(['context', 'exportedPage']),
      // Called after exporting a page
      afterExportPage: new AsyncSeriesHook(['context', 'exportedPage']),
      // Called after creating the server
      onCreateServer: new SyncHook(['server'])
    }

    this.transformers = new Transformers()
    this.runtimePolyfills = new Set()

    for (const hook of Object.keys(this.hooks)) {
      const ignoreNames = ['theme-node-api', 'user-node-api']
      this.hooks[hook].intercept({
        register(tapInfo) {
          const { fn, name } = tapInfo
          tapInfo.fn = (...args) => {
            if (!ignoreNames.includes(name)) {
              const msg = `${hook} ${colors.dim(`(${name})`)}`
              log.verbose(msg)
            }

            return fn(...args)
          }

          return tapInfo
        }
      })
    }

    if (opts.verbose) {
      process.env.SABER_LOG_LEVEL = 4
    }
  }

  get dev() {
    return Boolean(this.opts.dev)
  }

  get lazy() {
    return this.dev && this.config.build.lazy
  }

  async prepare() {
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

    await this.setConfig(config, configPath)

    if (this.configPath) {
      log.info(
        `Using config file: ${colors.dim(
          path.relative(process.cwd(), configPath)
        )}`
      )
    }

    this.RendererClass = this.config.renderer
      ? resolvePackage(this.config.renderer, {
          cwd: this.configDir,
          prefix: 'saber-renderer-'
        })
      : require('../vue-renderer/lib')
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

      log.info(`Using theme: ${colors.dim(this.config.theme)}`)
      log.verbose(() => `Theme directory: ${colors.dim(this.theme)}`)
    } else {
      this.theme = this.RendererClass.defaultTheme
    }

    // Load built-in plugins
    for (const plugin of builtinPlugins) {
      this.applyPlugin(require(plugin.resolve), plugin.options)
    }

    // Load user plugins
    await this.hooks.beforePlugins.promise()

    const userPlugins = this.getUserPlugins()
    if (userPlugins.length > 0) {
      log.info(
        `Using ${userPlugins.length} plugin${
          userPlugins.length > 1 ? 's' : ''
        } from config file`
      )
    }

    for (const plugin of userPlugins) {
      this.applyPlugin(plugin, plugin.options, plugin.location)
    }

    await this.hooks.afterPlugins.promise()
  }

  async setConfig(config, configPath = this.configPath) {
    this.configPath = configPath
    if (configPath) {
      this.configDir = path.dirname(configPath)
    } else {
      this.configDir = null
    }

    const initialRun = !this.config
    this.config = merge({}, config, this.initialConfig)
    // Validate config, apply default values, normalize some values
    this.config = require('./utils/validateConfig')(this.config, {
      dev: this.dev
    })

    // Make sure the port is available
    const { port } = this.config.server
    this.config.server._originalPort = port
    if (initialRun) {
      this.config.server.port = await getPort({
        port: getPort.makeRange(port, port + 1000),
        host: this.config.server.host
      })
    }
  }

  applyPlugin(plugin, options, pluginLocation) {
    plugin.apply(this, options)
    if (!plugin.name.startsWith('builtin:')) {
      log.verbose(
        () =>
          `Using plugin "${colors.bold(plugin.name)}" ${
            pluginLocation ? colors.dim(pluginLocation) : ''
          }`
      )
    }
  }

  getUserPlugins() {
    // Plugins that are specified in user config, a.k.a. saber-config.js etc
    const plugins =
      this.configDir && this.config.plugins
        ? this.config.plugins.map(p => {
            if (typeof p === 'string') {
              p = { resolve: p }
            }

            const location = resolveFrom(this.configDir, p.resolve)

            const plugin = require(location)
            plugin.location = location
            plugin.options = p.options

            return plugin
          })
        : []

    const applyFilterPlugins = plugins => {
      const handlers = new Set()

      for (const plugin of plugins) {
        const { filterPlugins, options } = plugin
        if (filterPlugins) {
          delete plugin.filterPlugins
          handlers.add(plugins => filterPlugins(plugins, options))
        }
      }

      if (handlers.size > 0) {
        for (const handler of handlers) {
          plugins = handler(plugins)
        }

        return applyFilterPlugins(plugins)
      }

      return plugins
    }

    return applyFilterPlugins(this.hooks.filterPlugins.call(plugins))
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

  resolveOutDir(...args) {
    return this.resolveCwd(this.config.build.outDir, ...args)
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

  async run() {
    // Throw an error if both `public` and `.saber/public` exist
    // Because they are replaced by `static` and `public`
    // TODO: remove this error before v1.0
    const hasOldPublicFolder = await Promise.all([
      fs.pathExists(this.resolveCache('public')),
      fs.pathExists(this.resolveCwd('public')),
      fs.pathExists(this.resolveCwd('public/index.html'))
    ]).then(
      ([hasOldOutDir, hasPublicDir, hasNewPublicDir]) =>
        hasOldOutDir && hasPublicDir && !hasNewPublicDir
    )
    if (hasOldPublicFolder) {
      // Prevent from deleting public folder
      throw new Error(
        [
          `It seems you are using the ${colors.underline(
            colors.cyan('public')
          )} folder to store static files,`,
          ` this behavior has changed and now we use ${colors.underline(
            colors.cyan('static')
          )} folder for static files`,
          ` while ${colors.underline(
            colors.cyan('public')
          )} folder is used to output generated files,`,
          ` to prevent from unexpectedly deleting your ${colors.underline(
            colors.cyan('public')
          )} folder, please rename it to ${colors.underline(
            colors.cyan('static')
          )} and delete ${colors.underline(
            colors.cyan('.saber/public')
          )} folder as well`
        ].join('')
      )
    }

    await this.hooks.beforeRun.promise()

    await this.hooks.emitRoutes.promise()
  }

  // Build app in production mode
  async build({ skipCompilation }) {
    await this.prepare()
    await this.run()
    if (!skipCompilation) {
      await this.renderer.build()
      await this.hooks.afterBuild.promise()
    }

    await this.renderer.generate()
    await this.hooks.afterGenerate.promise()
  }

  async serve() {
    await this.prepare()
    await this.run()

    const server = http.createServer(this.renderer.getRequestHandler())

    server.listen(this.config.server.port, this.config.server.host)
  }

  async serveOutDir() {
    await this.prepare()
    return require('./utils/serveDir')({
      dir: this.resolveOutDir(),
      host: this.config.server.host,
      port: this.config.server.port
    })
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
