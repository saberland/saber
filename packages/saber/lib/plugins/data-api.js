const path = require('path')
const { fs, slash } = require('saber-utils')

const ID = 'builtin:data-api'

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
  })
}
