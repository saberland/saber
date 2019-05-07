const path = require('path')
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

    const {
      iconPaths,
      name,
      themeColor,
      assetsVersion,
      msTileColor,
      appleMobileWebAppCapable,
      appleMobileWebAppStatusBarStyle
    } = getAppConfig(
      Object.assign({ name: api.config.siteConfig.title }, appConfig)
    )

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
        iconPaths,
        name,
        themeColor
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
        }),
        // Add to home screen for Safari on iOS
        iconPaths.appleTouchIcon &&
          createElement('meta', {
            name: 'apple-mobile-web-app-capable',
            content: appleMobileWebAppCapable
          }),
        iconPaths.appleTouchIcon &&
          createElement('meta', {
            name: 'apple-mobile-web-app-status-bar-style',
            content: appleMobileWebAppStatusBarStyle
          }),
        iconPaths.appleTouchIcon &&
          createElement('meta', {
            name: 'apple-mobile-web-app-title',
            content: name
          }),
        iconPaths.appleTouchIcon &&
          createElement('link', {
            rel: 'apple-touch-icon',
            href: `${publicUrl}${iconPaths.appleTouchIcon}${assetsVersionStr}`
          }),
        iconPaths.appleTouchIcon &&
          createElement('link', {
            rel: 'mask-icon',
            href: `${publicUrl}${iconPaths.safariMaskIcon}${assetsVersionStr}`,
            color: themeColor
          }),

        // Add to home screen for Windows
        iconPaths.msTileImage &&
          createElement('meta', {
            name: 'msapplication-TileImage',
            content: `${publicUrl}${iconPaths.msTileImage}${assetsVersionStr}`
          }),
        iconPaths.msTileImage &&
          createElement('meta', {
            name: 'msapplication-TileColor',
            content: msTileColor
          })
      ]
        .filter(Boolean)
        .join('')
      return data
    })
  }
}
