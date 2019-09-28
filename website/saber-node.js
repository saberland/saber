const path = require('path')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const { MEASURE_SPEED } = process.env

exports.getWebpackConfig = (config, { type }) => {
  if (MEASURE_SPEED !== undefined) {
    // This plugin will disable hot reloading
    const smp = new SpeedMeasurePlugin({
      outputFormat: 'json',
      outputTarget: path.join(__dirname, `.saber/speed-measure-${type}.json`)
    })
    return smp.wrap(config)
  }
  return config
}
