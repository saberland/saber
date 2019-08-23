const path = require('path')
const { fs, glob } = require('saber-utils')
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
      res[path.basename(file, path.extname(file))] = path.join(
        functionsDir,
        file
      )
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
    server.get('/_saber/functions/*', async (req, res) => {
      const name = req.url.slice('/_saber/functions'.length)
      const functionPath = path.join(
        api.resolveCache(`dist-functions`),
        `${name}.js`
      )

      if (!(await fs.pathExists(functionPath))) {
        res.statusCode = 404
        return res.end('404')
      }

      delete require.cache[functionPath]
      const requiredFunction =
        require(functionPath).default || require(functionPath)
      const result = await requiredFunction({ api })
      res.end(JSON.stringify(result))
    })
  })
}
