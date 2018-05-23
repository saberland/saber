const nodeExternals = require('webpack-node-externals')
const base = require('./webpack.base')

module.exports = api => {
  const config = base(api, 'server')

  config.devtool('source-map')
  config.target('node')

  config.output
    .path(api.resolveOutDir('dist/server'))
    .libraryTarget('commonjs2')

  config.externals([
    nodeExternals({
      // do not externalize dependencies that need to be processed by webpack.
      // you can add more file types here e.g. raw *.vue files
      // you should also whitelist deps that modifies `global` (e.g. polyfills)
      // Anything not ending with .js .json (supports query)
      whitelist: [/\.(?!(?:js|json)$).{1,5}(\?.+)?$/i]
    })
  ])

  return config
}
