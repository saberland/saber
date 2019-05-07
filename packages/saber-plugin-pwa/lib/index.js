const path = require('path')
const generateManifest = require('./generate-manifest')

const ID = 'pwa'

exports.name = ID

exports.apply = (
  api,
  { notifyUpdates = true, generateSWOptions = {}, ...manifestOptions } = {}
) => {
  if (api.dev) {
    // Uninstall server-worker.js in dev mode
    api.hooks.onCreateServer.tap(ID, server => {
      server.use(require('./noop-sw-middleware')())
    })
  } else {
    api.browserApi.add(path.join(__dirname, 'saber-browser.js'))

    api.hooks.chainWebpack.tap(ID, config => {
      config.plugin('constants').tap(([options]) => [
        Object.assign(options, {
          __PWA_OPTIONS__: JSON.stringify({
            notifyUpdates
          })
        })
      ])
    })

    api.hooks.afterGenerate.tapPromise(ID, async () => {
      const { generateSW } = require('workbox-build')
      await generateSW({
        ...generateSWOptions,
        swDest: api.resolveOutDir('service-worker.js'),
        importWorkboxFrom: 'local',
        globDirectory: api.resolveOutDir(),
        globPatterns: [
          '**/*.{js,css,html,png,jpg,jpeg,gif,svg,woff,woff2,eot,ttf,otf}'
        ].concat(generateSWOptions.globPatterns || [])
      })

      await generateManifest(api, manifestOptions)
    })
  }
}
