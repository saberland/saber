const path = require('path')
const { fs, slash } = require('saber-utils')
const { log } = require('saber-log')

const ID = 'builtin:extend-data-api'

exports.name = ID

exports.apply = api => {
  api.hooks.beforeRun.tapPromise(ID, async () => {
    const content = `
      const saberData = Object.assign(
        ${
          (await fs.pathExists(api.resolveCwd('saber-data.js')))
            ? `require("${slash(api.resolveCwd('saber-data.js'))}")`
            : '{}'
        },
        ${
          (await fs.pathExists(path.join(api.theme, 'saber-data.js')))
            ? `require("${slash(path.join(api.theme, 'saber-data.js'))}")`
            : '{}'
        }
      )

      module.exports = name => {
        return saberData[name] && saberData[name]()
      }
    `
    await fs.outputFile(api.resolveCache('data.js'), content, 'utf8')

    const dataApiFiles = [
      path.join(api.theme, 'saber-data.js'),
      api.resolveCwd('saber-data.js')
    ]
    if (api.dev) {
      require('chokidar')
        .watch(dataApiFiles, {
          ignoreInitial: true
        })
        .on('all', async (action, path) => {
          // something should be done here maybe
          log.warn(`${action[0].toUpperCase()}${action.substring(1)} ${path}`)
        })
    }
  })
}
