const path = require('path')

const ID = 'google-analytics'

const allowsTracking = () => {
  const dnt = window.doNotTrack ||
    navigator.doNotTrack ||
    navigator.msDoNotTrack

  if (dnt === 1 || dnt === '1' || dnt === 'yes') return false

  if ('msTrackingProtectionEnabled' in window.external) {
    return !window.external.msTrackingProtectionEnabled()
  }

  return true
}

exports.name = ID

exports.apply = (api, { trackId = false, anonymizeIp = false } = {}) => {
  if (!allowsTracking()) return

  api.hooks.chainWebpack.tap(ID, config => {
    config.plugin('constants').tap(([options]) => [
      Object.assign(options, {
        __GA_TRACK_ID__: JSON.stringify(trackId),
        __GA_ANONYMIZE_IP: JSON.stringify(anonymizeIp)
      })
    ])
  })

  api.browserApi.add(path.join(__dirname, 'saber-browser.js'))
}
