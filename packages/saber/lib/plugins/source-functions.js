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
      api.functions.set(`/${name}`, (...args) => {
        const functionPath = path.join(
          api.resolveCache(`dist-functions`),
          `${name}.js`
        )

        delete require.cache[functionPath]
        const fn = require(functionPath).default || require(functionPath)
        return fn(...args)
      })
      return res
    }, {})
    webpackConfig.output.filename = '[name].js'
    const compiler = webpack(webpackConfig)
    compiler.watch({}, () => {})
  })

  api.hooks.chainWebpack.tap(ID, (config, { type }) => {
    if (type !== 'functions') return
    config.plugins.delete('vue-ssr')
  })

  api.hooks.onCreateServer.tap(ID, server => {
    // Just used to check if a function works
    server.get('/_saber/functions/*', async (req, res) => {
      const name = req.path.slice('/_saber/functions'.length)
      if (!api.functions.has(name)) {
        res.statusCode = 404
        return res.end('404')
      }

      const result = await api.functions.run(name)
      res.end(JSON.stringify(result))
    })
  })
}
