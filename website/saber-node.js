const path = require('path')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")

exports.getWebpackConfig = (config, {type}) => {
  const smp = new SpeedMeasurePlugin({
    outputFormat: 'json',
    outputTarget: path.join(__dirname, `.saber/speed-measure-${type}.json`)
  })
  return smp.wrap(config)
}
