const path = require('path')

const ID = 'copy-code'

exports.name = ID

exports.apply = (api, options) => {
  api.browserApi.add(path.join(__dirname, 'saber-browser.js'))
  api.hooks.chainWebpack.tap(ID, config => {
    config.plugin('constants').tap(([constants]) => [
      Object.assign(constants, {
        __CODE_COPY_OPTIONS__: JSON.stringify(options)
      })
    ])
  })
}
