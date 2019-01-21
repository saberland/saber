const path = require('upath')

const ID = 'google-analytics'

exports.name = ID

exports.apply = (api, { trackId = false } = {}) => {
  api.hooks.chainWebpack.tap(ID, config => {
    config.plugin('constants').tap(([options]) => [
      Object.assign(options, {
        __GA_TRACK_ID__: JSON.stringify(trackId)
      })
    ])
  })

  api.hooks.afterPlugins.tap(ID, () => {
    api.browserApi.add(path.join(__dirname, 'saber-browser.js'))
  })
}
