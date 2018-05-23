const path = require('path')

module.exports = options => {
  const ga = typeof options === 'string' ? { id: options } : options || {}

  return {
    name: 'builtin:google-analytics',
    apply(api) {
      api.chainWebpack(config => {
        config.plugin('constants').tap(([options]) => [
          Object.assign(options, {
            __GA_ID__: ga.id ? JSON.stringify(ga.id) : false
          })
        ])
      })

      api.enhanceAppFiles.add(path.join(__dirname, 'inject.js'))
    }
  }
}
