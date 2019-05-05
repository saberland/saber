const ID = 'images'

exports.name = ID

exports.apply = (api, options = {}) => {
  options = Object.assign({}, options)

  console.log(api)

  api.hooks.chainWebpack.tap(ID, config => {
    config.module.rule('image').exclude.add(/\.(jpe?g|png)$/i)

    config.module
      .rule('js')
      .oneOf('saber-page')
      .use('vue-loader')
      .tap(options =>
        Object.assign(options, {
          transformAssetUrls: Object.assign(options.transformAssetUrls || {}, {
            's-image': ['src']
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
