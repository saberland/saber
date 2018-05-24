const fs = require('fs')
const base = require('./webpack.base')

module.exports = api => {
  const config = base(api, 'client')

  config.output.path(api.resolveOutDir('dist/client'))

  const { staticDir } = api.options
  if (fs.existsSync(staticDir)) {
    config.plugin('copy-static').use(require('copy-webpack-plugin'), [
      [
        {
          from: staticDir,
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
