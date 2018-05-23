const path = require('path')
const { loadPartialConfig, createConfigItem } = require('@babel/core')

module.exports = dir => {
  const presetItem = createConfigItem(require('../babel/preset'), {
    type: 'preset'
  })

  const mainBabelOptions = {
    cacheDirectory: true,
    presets: []
  }

  const filename = path.join(dir, 'filename.js')
  const externalBabelConfig = loadPartialConfig({ babelrc: true, filename })
  if (externalBabelConfig && externalBabelConfig.babelrc) {
    mainBabelOptions.babelrc = true
  } else {
    mainBabelOptions.babelrc = false
  }

  // Add our default preset if the no "babelrc" found.
  if (!mainBabelOptions.babelrc) {
    mainBabelOptions.presets.push(presetItem)
  }

  return mainBabelOptions
}
