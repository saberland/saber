const getFileNames = require('../utils/getFileNames')

const ID = 'builtin:config-font'

exports.name = ID

exports.apply = api => {
  api.hooks.chainWebpack.tap(ID, config => {
    const filename = getFileNames(!api.dev).font
    config.module
      .rule('font')
      .test(/\.(eot|otf|ttf|woff|woff2)(\?.*)?$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'))
      .options({
        name: filename
      })
  })
}
