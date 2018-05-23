const path = require('path')

module.exports = enabled => {
  return {
    name: 'builtin:pwa',

    apply(api) {
      api.chainWebpack(config => {
        config.plugin('constants').tap(([options]) => [
          Object.assign(options, {
            __PWA_ENABLED__: JSON.stringify(enabled !== false)
          })
        ])
      })

      api.enhanceAppFiles.add(path.join(__dirname, 'inject.js'))

      api.configureServer(app => {
        app.use(require('./noop-sw-middleware')())
      })

      api.on('generated', async () => {
        const { generateSW } = require('workbox-build')
        await generateSW({
          swDest: api.resolveOutDir('website', 'sw.js'),
          globDirectory: api.resolveOutDir('website'),
          globPatterns: [
            '**/*.{js,css,html,png,jpg,jpeg,gif,svg,woff,woff2,eot,ttf,otf}'
          ]
        })
      })
    }
  }
}
