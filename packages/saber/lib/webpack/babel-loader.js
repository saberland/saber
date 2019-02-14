const babelLoader = require('babel-loader')
const { log } = require('saber-log')
const spinner = require('../utils/spinner')

module.exports = babelLoader.custom(babel => {
  const configs = new Set()
  const presetItem = babel.createConfigItem(require('../babel/preset'), {
    type: 'preset'
  })

  return {
    customOptions(opts) {
      const custom = opts.customLoaderOptions
      delete opts.customLoaderOptions

      return { loader: opts, custom }
    },
    config(cfg) {
      const options = Object.assign({}, cfg.options)

      if (cfg.hasFilesystemConfig()) {
        for (const file of [cfg.babelrc, cfg.config]) {
          if (file && !configs.has(file)) {
            configs.add(file)
            if (log.isDebug) {
              spinner.stop()
              log.debug(`Applying Babel config file ${file}`)
            }
          }
        }
      } else {
        // Add our default preset if the no "babelrc" found.
        options.presets = [...options.presets, presetItem]
      }

      return options
    }
  }
})
