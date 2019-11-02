// @ts-check
const path = require('path')
const os = require('os')
const { fs } = require('saber-utils')

const ID = Math.round(Math.random() * 1000)

/**
 * Inspect webpack config in your default editor
 * @param {import('webpack-chain')} config Webpack-chain instance
 * @param {string} type
 */
module.exports = async (config, type) => {
  const tempFile = path.join(
    os.tmpdir(),
    `saber-webpack-config-${type}-${ID}.js`
  )
  await fs.writeFile(tempFile, `var config = ${config.toString()}`, 'utf8')
  await require('open')(tempFile)
}
