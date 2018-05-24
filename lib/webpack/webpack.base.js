const path = require('path')
const Config = require('webpack-chain')
const chalk = require('chalk').default
const loadBabelConfig = require('../utils/loadBabelConfig')
const loadPostcssConfig = require('../utils/loadPostcssConfig')

module.exports = (api, type) => {
  const config = new Config()

  config.merge({
    mode: api.dev ? 'development' : 'production',
    entry: {
      main: [api.resolveAppDir(`${type}-entry.js`)]
    },
    performance: {
      hints: false
    },
    optimization: {
      minimize: false
    }
  })

  // No need to minimize in server or dev mode
  if (type === 'client' && !api.dev && api.options.minimize !== false) {
    config.merge({
      optimization: {
        minimize: true,
        minimizer: [
          {
            apply(compiler) {
              // eslint-disable-next-line import/no-extraneous-dependencies
              const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
              new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                  output: {
                    comments: false,
                    beautify: false
                  },
                  ie8: false
                }
              }).apply(compiler)
            }
          }
        ]
      }
    })
  }

  config.output
    .filename(
      api.dev
        ? '__saber/assets/js/[name].js'
        : '__saber/assets/js/[name].[chunkhash:6].js'
    )
    .publicPath(api.options.root)

  config.resolve.extensions.add('.js').add('.json')

  const addModules = target => {
    target.add(path.join(__dirname, '../../node_modules')).add('node_modules')

    if (require('yarn-global').inDirectory(__dirname)) {
      target.add(path.join(__dirname, '../../../'))
    }
  }

  addModules(config.resolve.modules)
  addModules(config.resolveLoader.modules)

  config.resolve.alias
    .set('#out', api.options.outDir)
    .set('#base', api.baseDir)
    .set('#pages', api.resolvePagesDir())
    .set('#app', api.resolveAppDir())

  const babelOptions = loadBabelConfig(api.baseDir)

  config.module
    .rule('js')
    .test(/\.js$/)
    .include.add(filepath => {
      if (
        filepath.startsWith(api.options.outDir) ||
        filepath.startsWith(api.resolveAppDir()) ||
        api.enhanceAppFiles.has(filepath)
      ) {
        return true
      }
      return !/node_modules/.test(filepath)
    })
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(babelOptions)

  config.module
    .rule('vue-data')
    .resourceQuery(/blockType=saber/)
    .use('saber-loader')
    .loader(require.resolve('./saber-loader'))
    .options({
      api
    })
    .end()
    .use('babel-loader')
    .loader('babel-loader')
    .options(
      Object.assign(
        {
          plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')]
        },
        babelOptions
      )
    )

  config.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(require.resolve('vue-loader'))

  config.plugin('vue').use(require('vue-loader').VueLoaderPlugin)

  config.module
    .rule('pug')
    .test(/\.pug$/)
    .use('pug-plain-loader')
    .loader('pug-plain-loader')

  const inlineLimit = 10000

  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: `__saber/assets/img/[name].[hash:8].[ext]`
    })

  // do not base64-inline SVGs.
  // https://github.com/facebookincubator/create-react-app/pull/1180
  config.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: `__saber/assets/img/[name].[hash:8].[ext]`
    })

  config.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: `__saber/assets/media/[name].[hash:8].[ext]`
    })

  config.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: inlineLimit,
      name: `__saber/assets/fonts/[name].[hash:8].[ext]`
    })

  const isProd = !api.dev

  const postcssConfigFile = loadPostcssConfig(api.baseDir)

  function createCSSRule(lang, test, loader, options) {
    const baseRule = config.module.rule(lang).test(test)
    const modulesRule = baseRule.oneOf('modules').resourceQuery(/module/)
    const normalRule = baseRule.oneOf('normal')

    applyLoaders(modulesRule, true)
    applyLoaders(normalRule, false)

    function applyLoaders(rule, modules) {
      const sourceMap = !isProd

      rule.use('vue-style-loader').loader('vue-style-loader')

      rule
        .use('css-loader')
        .loader('css-loader')
        .options({
          modules,
          sourceMap,
          localIdentName: `[local]_[hash:base64:8]`,
          importLoaders: 1,
          minimize: isProd
        })

      if (postcssConfigFile) {
        rule
          .use('postcss-loader')
          .loader('postcss-loader')
          .options(
            Object.assign({
              sourceMap: !isProd,
              config: {
                path: postcssConfigFile
              }
            })
          )
      }

      if (loader) {
        rule
          .use(loader)
          .loader(loader)
          .options(
            Object.assign(
              {
                sourceMap
              },
              options
            )
          )
      }
    }
  }

  createCSSRule('css', /\.css$/)
  createCSSRule('scss', /\.scss$/, 'sass-loader')
  createCSSRule('sass', /\.sass$/, 'sass-loader', { indentedSyntax: true })
  createCSSRule('less', /\.less$/, 'less-loader')
  createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', {
    preferPathResolver: 'webpack'
  })

  if (api.dev) {
    config.plugin('timefix').use(require('time-fix-plugin'))
  }

  if (api.options.progress !== false) {
    config.plugin('progress-bar').use(require('webpackbar'), [
      {
        name: type,
        color: type === 'client' ? 'cyanBright' : 'magentaBright',
        profile: api.options.profile
      }
    ])
  }

  config.plugin('reporter').use(
    class ReporterPlugin {
      apply(compiler) {
        compiler.hooks.invalid.tap('report-invalid', (filename, changeTime) => {
          console.log(
            chalk.dim(
              `> Rebuilding due to changes made in ${chalk.cyan(
                path.relative(process.cwd(), filename)
              )} at ${new Date(changeTime)}`
            )
          )
        })
        compiler.hooks.done.tap('report-status', stats => {
          const json = stats.toJson({
            colors: true,
            version: false,
            builtAt: false,
            chunks: false,
            modules: false,
            children: false,
            hash: false
          })

          if (json.errors.length > 0) {
            console.log(json.errors.join('\n'))
            process.exitCode = 1
          } else if (json.warnings.length > 0) {
            console.log(json.warnings.join('\n'))
            process.exitCode = 0
          } else {
            process.exitCode = 0
          }
          if (api.dev) {
            console.log(`> Open http://localhost:${api.options.port}`)
          }
        })
      }
    }
  )

  config.plugin('constants').use(require('webpack').DefinePlugin, [
    {
      'process.env.NODE_ENV': JSON.stringify(config.get('mode')),
      'process.browser': JSON.stringify(type === 'client'),
      'process.server': JSON.stringify(type === 'server'),
      __PUBLIC_PATH__: JSON.stringify(api.options.root)
    }
  ])

  if (!api.dev) {
    // prettier-ignore
    config.plugin('vue-ssr')
      .use(require(`vue-server-renderer/${type}-plugin`), [{
        filename: `saber-${type}.json`
      }])
  }

  return config
}
