const path = require('path')
const Config = require('webpack-chain')

module.exports = (api, { type }) => {
  const config = new Config()

  const isServer = type !== 'client'

  config.mode(api.dev ? 'development' : 'production')
  config.devtool(
    isServer ? 'source-map' : api.dev ? 'cheap-module-source-map' : false
  )

  const fileNames = require('../utils/getFileNames')(!api.dev)

  config.output
    .publicPath(`${api.config.build.publicUrl}_saber/`)
    .filename(fileNames.js)

  config.resolve.extensions.merge(['.mjs', '.js', '.json', '.wasm'])

  // Disable performance hints
  config.performance.hints(false)

  if (isServer) {
    config.output.libraryTarget('commonjs2')
    config.target('node')
    config.node.merge({
      __dirname: true,
      __filename: true
    })
  }

  config.resolve.alias.set('#pages', api.resolveCwd('pages'))
  config.resolve.alias.set('#cache', api.resolveCwd('.saber'))
  config.resolve.alias.set('#theme', api.theme)
  config.resolve.alias.set('@', api.opts.cwd)
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

  config.module
    .rule('js')
    .test(/\.js$/)
    .include.add(filepath => {
      if (api.browserApi.has(filepath)) {
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
    .rule('saber-functions')
    .type('json')
    .include.add(path.join(__dirname, 'function-placeholder'))
    .end()
    .use('function-loader')
    .loader(require.resolve('./function-loader'))
    .options({
      api
    })

  config.plugin('timefix').use(require('time-fix-plugin'))

  config.plugin('envs').use(require('webpack').DefinePlugin, [
    {
      'process.env.NODE_ENV': JSON.stringify(config.get('mode'))
    }
  ])

  config.plugin('constants').use(require('webpack').DefinePlugin, [
    {
      'process.browser': type === 'client',
      'process.client': type === 'client',
      'process.server': isServer,
      __DEV__: api.dev,
      __PUBLIC_URL__: JSON.stringify(api.config.build.publicUrl),
      __LAZY__: api.config.build.lazy && api.dev,
      __SABER_VERSION__: JSON.stringify(require('../../package').version)
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
