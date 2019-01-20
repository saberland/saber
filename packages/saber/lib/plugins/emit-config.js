const path = require('path')
const { fs } = require('saber-utils')
const { load, CONFIG_FILES } = require('../utils/configLoader')

const ID = 'builtin:emit-config'

exports.name = ID

exports.apply = api => {
  api.hooks.beforeRun.tapPromise(ID, async () => {
    const outPath = api.resolveCache('config.json')

    const emit = config =>
      fs.outputFile(
        outPath,
        JSON.stringify({
          siteConfig: config.siteConfig || {},
          themeConfig: config.themeConfig || {}
        }),
        'utf8'
      )

    // Emit config.json anyways
    await emit(api.config)

    if (api.mode === 'development') {
      const cwd = api.configDir || api.resolveCwd()
      const watcher = require('chokidar').watch(CONFIG_FILES, {
        ignoreInitial: true,
        cwd
      })
      watcher.on('all', async (type, filename) => {
        const filepath = path.join(cwd, filename)
        const { path: configPath, data } = await load({ files: [filepath] })
        if (configPath && data) {
          await emit(data)
        }
      })
    }
  })
}
