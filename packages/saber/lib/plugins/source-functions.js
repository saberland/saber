const path = require('path')
const { glob } = require('saber-utils')
const webpack = require('webpack')

const ID = 'builtin:source-functions'

exports.name = ID

exports.apply = api => {
  api.hooks.beforeRun.tapPromise(ID, async () => {
    const functionsDir = api.resolveCwd('functions')
    const filePatterns = [
      `**/*`,
      '!**/{node_modules,dist,vendor}/**',
      '!**/_*' // Ignore path starting with underscore `_`
    ]
    const files = await glob(filePatterns, {
      cwd: functionsDir
    })

    if (files.length === 0) return

    const webpackConfig = api.getWebpackConfig({ type: 'functions' })
    webpackConfig.entry = files.reduce((res, file) => {
      const name = path.basename(file, path.extname(file))
      res[name] = path.join(functionsDir, file)
      return res
    }, {})
    webpackConfig.output.filename = '[name].js'
    const compiler = webpack(webpackConfig)
    compiler.hooks.done.tap(ID, stats => {
      const hasErrors = stats.hasErrors()
      for (const file of files) {
        const name = path.basename(file, path.extname(file))
        if (hasErrors) {
          api.functions.delete(`/${name}`)
          continue
        }

        const functionPath = path.join(
          api.resolveCache(`dist-functions`),
          `${name}.js`
        )
        delete require.cache[functionPath]
        const fn = require(functionPath)
        api.functions.set(`/${name}`, {
          handler: fn.default || fn,
          emit: fn.emit
        })
      }
    })
    compiler.watch({}, () => {})
  })

  api.hooks.chainWebpack.tap(ID, (config, { type }) => {
    if (type !== 'functions') return
    config.plugins.delete('vue-ssr')
  })

  api.hooks.onCreateServer.tap(ID, server => {
    server.use(async (req, res, next) => {
      const fn = api.functions.get(req.path)
      if (!fn || !fn.emit) {
        return next()
      }

      const result = await api.functions.run(req.path, req.query)
      res.end(JSON.stringify(result))
    })
  })
}
