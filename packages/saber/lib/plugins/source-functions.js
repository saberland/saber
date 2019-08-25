const path = require('path')
const { glob } = require('saber-utils')
const { log } = require('saber-log')
const webpack = require('webpack')
const chokidar = require('chokidar')

const ID = 'builtin:source-functions'

exports.name = ID

exports.apply = api => {
  const removeExtension = input => input.replace(/\.[a-z]+$/, '')

  api.hooks.beforeRun.tapPromise(ID, async () => {
    const functionsDir = api.resolveCwd('functions')
    const filePatterns = [
      `*`,
      '!**/_*' // Ignore path starting with underscore `_`
    ]
    const files = await glob(filePatterns, {
      cwd: functionsDir
    })

    let watching

    const runCompiler = () => {
      const webpackConfig = api.getWebpackConfig({ type: 'functions' })
      webpackConfig.entry = files.reduce((res, file) => {
        const name = removeExtension(file)
        res[name] = path.join(functionsDir, file)
        return res
      }, {})
      webpackConfig.output.filename = '[name].js'
      const compiler = webpack(webpackConfig)
      compiler.hooks.done.tap(ID, stats => {
        if (stats.hasErrors()) return

        for (const [name, fn] of api.functions) {
          if (fn.__from_file__) {
            api.functions.delete(name)
          }
        }

        for (const file of files) {
          const name = removeExtension(file)
          const functionPath = path.join(
            api.resolveCache(`dist-functions`),
            `${name}.js`
          )
          delete require.cache[functionPath]
          const fn = require(functionPath)
          api.functions.set(name, {
            handler: fn.default || fn,
            __from_file__: true
          })
          log.verbose(() => `Added function "${name}" from "${file}"`)
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
}
