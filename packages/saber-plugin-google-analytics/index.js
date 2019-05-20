const path = require('path')

const ID = 'google-analytics'

exports.name = ID

exports.apply = (api, { trackId = false, respectDoNotTrack = true } = {}) => {
  api.hooks.chainWebpack.tap(ID, config => {
    config.plugin('constants').tap(([options]) => [
      Object.assign(options, {
        __GA_TRACK_ID__: JSON.stringify(trackId),
        respectDoNotTrack
      })
    ])
  })

  api.browserApi.add(path.join(__dirname, 'saber-browser.js'))
}
