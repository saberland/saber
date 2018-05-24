const fs = require('fs')
const base = require('./webpack.base')

module.exports = api => {
  const config = base(api, 'client')

  config.output.path(api.resolveOutDir('dist/client'))

  const { staticDir } = api.options
  if (fs.existsSync(staticDir)) {
    const CopyPlugin = require('copy-webpack-plugin')
    CopyPlugin.__expression = `require('copy-webpack-plugin')`
    config.plugin('copy-static').use(CopyPlugin, [
      [
        {
          from: staticDir,
          to: '.'
        }
      ]
    ])
  }

  if (api.dev) {
    const HtmlPlugin = require('html-webpack-plugin')
    HtmlPlugin.__expression = `require('html-webpack-plugin')`
    // prettier-ignore
    config.plugin('html')
      .use(HtmlPlugin, [{
        template: api.resolveAppDir('index.dev.html')
      }])
  }

  return config
}
