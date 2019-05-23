const path = require('path')
const { fs } = require('saber-utils')
const { log, colors } = require('saber-log')

const ID = 'builtin:extend-data-api'

exports.name = ID

exports.apply = api => {
  api.hooks.beforeRun.tapPromise(ID, async () => {
    const content = `
      const saberData = Object.assign(
        ${
          (await fs.pathExists(api.resolveCwd('saber-data.js')))
            ? `require("${api
                .resolveCwd('saber-data.js')
                .replace(/\\/g, '/')}")`
            : '{}'
        },
        ${
          (await fs.pathExists(path.join(api.theme, 'saber-data.js')))
            ? `require("${path
                .join(api.theme, 'saber-data.js')
                .replace(/\\/g, '/')}")`
            : '{}'
        }
      )

      module.exports = name => {
        return saberData[name] && saberData[name]()
      }
    `
    await fs.outputFile(api.resolveCache('data.js'), content, 'utf8')
  })
  const handleDataApiFile = (dataApiFile, dataApiId) => {
    let dataApi = {}

    const updateDataApi = () => {
      if (fs.existsSync(dataApiFile)) {
        delete require.cache[dataApiFile]
        dataApi = require(dataApiFile)
      } else {
        dataApi = {}
      }
    }

    updateDataApi()

    const getHookHandler = hookName => dataApi[hookName] || __noopHandler__

    api.hooks.afterPlugins.tap(dataApiId, () => {
      api.hooks.initPages.tap(dataApiId, () => {
        for (const hookName of Object.keys(api.hooks)) {
          const hook = api.hooks[hookName]
          if (hook) {
            const tapType = hook.call ? 'tap' : 'tapPromise'
            hook[tapType](dataApiId, (...args) => {
              const hookHandler = getHookHandler(hookName)
              const result = hookHandler.call(api, ...args)

              if (hookHandler.name !== '__noopHandler__') {
                log.verbose(() => `${hookName} ${colors.dim(`(${dataApiId})`)}`)
              }

              if (tapType === 'tapPromise') {
                return Promise.resolve(result)
              }

              return result
            })
          }
        }
      })
    })

    if (api.dev && !/node_modules/.test(dataApiFile)) {
      require('chokidar')
        .watch(dataApiFile, {
          ignoreInitial: true
        })
        .on('all', async action => {
          await updateDataApi()
          // Remove all child pages
          api.pages.removeWhere(page => page.internal.parent)
          await Promise.all(
            [...api.pages.values()].map(async page => {
              // Recreate the page
              api.pages.createPage(page)
              // A page has been created
              await api.hooks.onCreatePage.promise(page)
            })
          )
          // All pages are created
          await api.hooks.onCreatePages.promise()
          // Emit pages
          await api.hooks.emitPages.promise()
          // Emit route file
          await api.hooks.emitRoutes.promise()
          log.warn(
            `${action[0].toUpperCase()}${action.substring(1)} ${dataApiFile}`
          )
          // Because you might also update webpack config in saber-data.js
          // Which we can't (?) automatically reload
          log.warn(`You probably need to restart the server.`)
        })
    }
  }

  handleDataApiFile(path.join(api.theme, 'saber-data.js'), 'theme-data-api')
  handleDataApiFile(api.resolveCwd('saber-data.js'), 'user-data-api')
}

function __noopHandler__(arg) {
  return arg
}
