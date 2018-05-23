const fs = require('fs')
const base = require('./webpack.base')

module.exports = api => {
  const config = base(api, 'client')

  config.output.path(api.resolveOutDir('dist/client'))

  const publicDir = api.options.publicDir
  if (fs.existsSync(publicDir)) {
    config.plugin('copy-public').use(require('copy-webpack-plugin'), [
      [
        {
          from: publicDir,
          to: '.'
        }
      ]
    ])
  }

  if (api.dev) {
    // prettier-ignore
    config.plugin('html')
      .use(require('html-webpack-plugin'), [{
        template: api.resolveAppDir('index.dev.html')
      }])
  }

  return config
}
