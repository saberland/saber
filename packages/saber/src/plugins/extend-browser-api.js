const chokidar = require('chokidar')
const configLoader = require('../utils/configLoader')

const ID = 'builtin:extend-browser-api'

exports.name = ID

exports.apply = api => {
  const USER_BROWSER_API_FILES = ['saber-browser.js', 'saber-browser.ts']

  const browserApiFile = configLoader.resolve({
    files: USER_BROWSER_API_FILES,
    cwd: api.resolveCwd()
  })
  if (browserApiFile) {
    api.browserApi.add(browserApiFile)
  }

  api.hooks.beforeRun.tapPromise(ID, async () => {
    await api.browserApi.reload()

    if (api.dev) {
      const watcher = chokidar.watch(USER_BROWSER_API_FILES, {
        cwd: api.resolveCwd(),
        ignoreInitial: true
      })
      const onAdd = async filename => {
        api.browserApi.add(api.resolveCwd(filename))
        await api.browserApi.reload()
      }
      const onRemove = async filename => {
        api.browserApi.delete(api.resolveCwd(filename))
        await api.browserApi.reload()
      }
      watcher
        .on('add', filename => {
          onAdd(filename)
        })
        .on('unlink', filename => {
          onRemove(filename)
        })
    }
  })
}
