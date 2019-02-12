const path = require('path')
const Config = require('webpack-chain')

module.exports = (api, { type }) => {
  const config = new Config()

  config.mode(api.mode)

  const fileNames = require('../utils/getFileNames')(api.mode === 'production')

  config.output.publicPath('/_saber/').filename(fileNames.js)

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
      return !/node_modules/.test(filepath)
    })
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      presets: [require.resolve('../babel/preset')]
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
      'process.browser': type === 'browser',
      'process.client': type === 'browser',
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
