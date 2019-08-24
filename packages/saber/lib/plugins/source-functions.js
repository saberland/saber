const path = require('path')
const { glob } = require('saber-utils')
const webpack = require('webpack')
const chokidar = require('chokidar')

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

    let watching

    const runCompiler = () => {
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
      if (api.dev) {
        watching = compiler.watch({}, () => {})
      } else {
        compiler.run(() => {})
      }
    }

    runCompiler()

    if (api.dev) {
      chokidar
        .watch(filePatterns, {
          cwd: functionsDir,
          ignoreInitial: true
        })
        .on('add', file => {
          files.push(file)
          watching.close(runCompiler)
        })
        .on('unlink', file => {
          files.splice(files.indexOf(file), 1)
          watching.close(runCompiler)
        })
    }
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
      res.end(typeof result === 'string' ? result : JSON.stringify(result))
    })
  })
}
