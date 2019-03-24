const path = require('path')
const Config = require('webpack-chain')

module.exports = (api, { type }) => {
  const config = new Config()

  config.mode(api.mode)
  config.devtool(api.mode === 'production' ? false : 'cheap-module-source-map')

  const fileNames = require('../utils/getFileNames')(api.mode === 'production')

  config.output
    .publicPath(`${api.config.build.publicUrl}_saber/`)
    .filename(fileNames.js)

  // Disable performance hints
  config.performance.hints(false)

  if (type === 'server') {
    config.output.libraryTarget('commonjs2')
    config.target('node')
  }

  config.resolve.alias.set('#pages', api.resolveCwd('pages'))
  config.resolve.alias.set('#cache', api.resolveCwd('.saber'))
  config.resolve.alias.set('#theme', api.theme)
  config.resolve.alias.set('saber-config$', api.resolveCache('config.json'))
  config.resolve.alias.set('saber/config$', api.resolveCache('config.json'))
  config.resolve.alias.set(
    'saber/variables$',
    api.resolveCache('variables.json')
  )

  const ownModulesDir = path.join(
    path.dirname(require.resolve('vue/package')),
    '..'
  )
  config.resolve.modules.add('node_modules').add(ownModulesDir)
  config.resolveLoader.modules.add('node_modules').add(ownModulesDir)

  const rendererAppPath = path.join(__dirname, '../renderer/app')
  config.module
    .rule('js')
    .test(/\.js$/)
    .include.add(filepath => {
      if (filepath.includes(rendererAppPath)) {
        return true
      }

      if (/node_modules/.test(filepath)) {
        return false
      }

      return true
    })
    .end()
    .oneOf('normal')
    .use('babel-loader')
    .loader(require.resolve('./babel-loader'))

  config.module
    .rule('request-loader')
    .type('json')
    .include.add(path.join(__dirname, 'request-loader-placeholder'))
    .end()
    .use('request-loader')
    .loader(require.resolve('./request-loader'))
    .options({
      api
    })

  config.plugin('timefix').use(require('time-fix-plugin'))

  config.plugin('envs').use(require('webpack').DefinePlugin, [
    {
      'process.env.NODE_ENV': JSON.stringify(
        api.mode === 'production' ? 'production' : 'development'
      )
    }
  ])

  config.plugin('constants').use(require('webpack').DefinePlugin, [
    {
      'process.browser': type === 'client',
      'process.client': type === 'client',
      'process.server': type === 'server',
      __DEV__: api.mode !== 'production'
    }
  ])

  config.plugin('print-status').use(require('./PrintStatusPlugin'), [
    {
      api,
      type
    }
  ])

  return config
}
