const path = require('path')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const { MEASURE_SPEED, NODE_ENV, BUNDLE_ANALYZER_TOKEN } = process.env

exports.getWebpackConfig = (config, { type }) => {
  if (type === 'client' && NODE_ENV === 'production' && BUNDLE_ANALYZER_TOKEN) {
    const BundleAnalyzer = require('@bundle-analyzer/webpack-plugin')

    config.plugins.push(
      new BundleAnalyzer({
        token: BUNDLE_ANALYZER_TOKEN
      })
    )
  }

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
