const babelLoader = require('babel-loader')
const { log } = require('saber-log')
const logUpdate = require('log-update')

module.exports = babelLoader.custom(babel => {
  const configs = new Set()
  const requiredPreset = babel.createConfigItem(
    require('../babel/required-preset'),
    {
      type: 'preset'
    }
  )
  const optionalPreset = babel.createConfigItem(
    require('../babel/optional-preset'),
    {
      type: 'preset'
    }
  )

  return {
    customOptions(opts) {
      const custom = opts.customLoaderOptions
      delete opts.customLoaderOptions

      return { loader: opts, custom }
    },
    config(cfg) {
      const options = Object.assign({}, cfg.options)

      options.presets.push(requiredPreset)

      if (cfg.hasFilesystemConfig()) {
        for (const file of [cfg.babelrc, cfg.config]) {
          if (file && !configs.has(file)) {
            configs.add(file)
            if (log.logLevel > 3) {
              logUpdate.clear()
              log.verbose(`Applying Babel config file ${file}`)
            }
          }
        }
      } else {
        // Add our optional preset if the no "babelrc" found.
        options.presets.push(optionalPreset)
      }

      return options
    }
  }
})
