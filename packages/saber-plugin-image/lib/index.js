const { join } = require('path')

const ID = 'images'

exports.name = ID

exports.apply = (api, options = {}) => {
  options = Object.assign(
    {
      lazyLoad: true,
      placeholder: true,
      blendIn: true
    },
    options
  )

  api.browserApi.add(join(__dirname, 'saber-browser.js'))

  api.hooks.chainWebpack.tap(ID, config => {
    config.plugin('constants').tap(([constants]) => [
      Object.assign(constants, {
        __SABER_IMAGE_OPTIONS__: options
      })
    ])

    config.module.rule('image').exclude.add(/\.(jpe?g|png)$/i)

    config.module
      .rule('js')
      .oneOf('saber-page')
      .use('vue-loader')
      .tap(options =>
        Object.assign(options, {
          transformAssetUrls: Object.assign(options.transformAssetUrls || {}, {
            'saber-image': ['src']
          })
        })
      )

    config.module
      .rule(ID)
      .test(/\.(jpe?g|png)$/i)
      .use('responsive-loader')
      .loader(require.resolve('responsive-loader'))
      .options({
        ...options,
        adapter: require('responsive-loader/sharp')
      })
  })
}
