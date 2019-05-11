const path = require('path')
const fs = require('fs')
const generateManifest = require('./generate-manifest')
const getAppConfig = require('./get-app-config')
const createElement = require('./create-element')

const ID = 'pwa'

exports.name = ID

exports.apply = (
  api,
  { notifyUpdates = true, generateSWOptions = {}, ...appConfig } = {}
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

    const { name, themeColor, assetsVersion } = getAppConfig(
      Object.assign({ name: api.config.siteConfig.title }, appConfig)
    )

    const manifestPath = api.resolveOutDir('manifest.json')
    const hasManifest = fs.existsSync(manifestPath)
    const manifest = hasManifest ? require(manifestPath) : {}

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

      await generateManifest(api, {
        name,
        themeColor,
        manifest,
        manifestPath
      })
    })

    const { publicUrl } = api.config.build
    const assetsVersionStr = assetsVersion ? `?v=${assetsVersion}` : ''

    api.hooks.getDocumentData.tap(ID, data => {
      data.meta += [
        createElement('link', {
          rel: 'manifest',
          href: `${publicUrl}manifest.json${assetsVersionStr}`
        }),
        createElement('meta', {
          name: 'theme-color',
          content: themeColor
        })
      ]
        .concat(
          manifest.icons &&
            manifest.icons.map(icon =>
              createElement('link', {
                rel: 'apple-touch-icon',
                sizes: icon.sizes,
                href: icon.src
              })
            )
        )
        .filter(Boolean)
        .join('')
      return data
    })
  }
}
