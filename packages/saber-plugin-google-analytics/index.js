const path = require('upath')

const ID = 'google-analytics'

exports.name = ID

exports.apply = (api, pluginOptions = {}) => {
  // Plugin options
  pluginOptions = Object.assign(
    {
      type: 'default',
      trackId: false
    },
    pluginOptions
  )

  api.hooks.chainWebpack.tap(ID, config => {
    config.plugin('constants').tap(([options]) => [
      Object.assign(options, {
        __GA_TRACK_TYPE__: JSON.stringify(pluginOptions.type),
        __GA_TRACK_ID__: JSON.stringify(pluginOptions.trackId)
      })
    ])
  })

  api.browserApi.add(path.join(__dirname, 'saber-browser.js'))
}
