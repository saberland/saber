const path = require('path')
const Config = require('webpack-chain')

module.exports = (api, { type }) => {
  const config = new Config()

  config.mode(api.dev ? 'development' : 'production')
  config.devtool(
    type === 'server'
      ? 'source-map'
      : api.dev
      ? 'cheap-module-source-map'
      : false
  )

  const fileNames = require('../utils/getFileNames')(!api.dev)

  config.output
    .publicPath(`${api.config.build.publicUrl}_saber/`)
    .filename(fileNames.js)

  config.resolve.extensions.merge(['.mjs', '.js', '.json', '.wasm'])

  // Disable performance hints
  config.performance.hints(false)

  if (type === 'server') {
    config.output.libraryTarget('commonjs2')
    config.target('node')
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
    .options({
      customLoaderOptions: {
        distDir: api.resolveCache(),
        cwd: api.resolveCwd(),
        shouldCache: api.webpackUtils.shouldCache,
        type
      }
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
      'process.server': type === 'server',
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

  if (type === 'client') {
    config.optimization.splitChunks({
      cacheGroups: {
        default: false,
        vendors: false,
        // Extract all modules used by Saber and Saber itself
        framework: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/](vue|vue-router|vue-meta|vue-router-prefetch|object-assign|saber)[\\/]/,
          priority: 40
        },
        // Extract third-party libraries
        lib: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: 30,
          minChunks: 2,
          reuseExistingChunk: true
        },
        // Other shared modules across files
        shared: {
          chunks: 'all',
          priority: 10,
          minChunks: 2,
          reuseExistingChunk: true
        }
      }
    })
    config.optimization.runtimeChunk(true)
  }

  if (api.compilers[type]) {
    api.compilers[type].injectToWebpack(config)
  }

  return config
}
