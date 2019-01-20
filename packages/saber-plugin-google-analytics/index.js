const path = require('upath')

exports.name = 'google-analytics'

exports.apply = (api, { trackId = false } = {}) => {
  api.hooks.chainWebpack.tap('plugin-google-analytics', config => {
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
