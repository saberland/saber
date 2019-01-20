const path = require('path')
const chokidar = require('chokidar')
const { fs } = require('saber-utils')
const configLoader = require('../utils/configLoader')

const ID = 'builtin:extend-browser-api'

exports.name = ID

exports.apply = api => {
  const USER_BROWSER_API_FILES = ['saber-browser.js', 'saber-browser.ts']

  class BrowserApi extends Set {
    async reload() {
      const files = [...this.values()].map((file, i) => {
        const name = `_${path.basename(file).replace(/[^a-z0-9_]/gi, '_')}_${i}`
        return {
          name,
          path: file.replace(/\\/g, '/')
        }
      })

      const output = `
        ${files
          .map(file => `import ${file.name} from "${file.path}"`)
        .join('\n')}

        var themeBrowserApi
        var rTheme = require.context('#theme', false, /\.[jt]s$/)
        rTheme.keys().forEach(function (k) {
          themeBrowserApi = rTheme(k).default
        })

        export default function (context) {
          ${files.map(file => `${file.name}(context)`).join('\n')}
          if (themeBrowserApi) {
            themeBrowserApi(context)
          }
        }`

      await fs.outputFile(
        api.resolveCache('extend-browser-api.js'),
        output,
        'utf8'
      )
    }
  }

  api.browserApi = new BrowserApi()

  api.hooks.afterPlugins.tap(ID, () => {
    const browserApiFile = configLoader.resolve({
      files: USER_BROWSER_API_FILES,
      cwd: api.resolveCwd()
    })
    if (browserApiFile) {
      api.browserApi.add(browserApiFile)
    }
  })

  api.hooks.beforeRun.tapPromise(ID, async () => {
    await api.browserApi.reload()

    if (api.mode === 'development') {
      const watcher = chokidar.watch(USER_BROWSER_API_FILES, {
        cwd: api.resolveCwd(),
        ignoreInitial: true
      })
      watcher
        .on('add', async filename => {
          api.browserApi.add(api.resolveCwd(filename))
          await api.browserApi.reload()
        })
        .on('unlink', async filename => {
          api.browserApi.delete(api.resolveCwd(filename))
          await api.browserApi.reload()
        })
    }
  })
}
