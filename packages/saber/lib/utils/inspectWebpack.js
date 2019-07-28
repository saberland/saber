const path = require('path')
const os = require('os')
const { fs } = require('saber-utils')
const Chain = require('webpack-chain')

const ID = Math.round(Math.random() * 1000)

module.exports = async (config, type) => {
  const tempFile = path.join(
    os.tmpdir(),
    `saber-webpack-config-${type}-${ID}.js`
  )
  await fs.writeFile(tempFile, `var config = ${Chain.toString(config)}`, 'utf8')
  await require('open')(tempFile)
}
