const path = require('path')
const loadConfig = require('./loadConfig')

module.exports = dir => {
  const { data, path: file } = loadConfig.loadSync(
    ['.postcssrc', '.postcssrc.js', 'postcss.config.js', 'package.json'],
    dir
  )

  if (path.basename(file) === 'package.json') {
    return data.postcss && file
  }

  return file
}
