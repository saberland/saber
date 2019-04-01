const fs = require('fs')
const path = require('path')
const { log } = require('saber-log')

const ID = 'builtin:extend-node-api'

exports.name = ID

exports.apply = api => {
  const handleNodeApiFile = (nodeApiFile, nodeApiId) => {
    let nodeApi = {}

    const updateNodeApi = () => {
      if (fs.existsSync(nodeApiFile)) {
        delete require.cache[nodeApiFile]
        nodeApi = require(nodeApiFile)
      } else {
        nodeApi = {}
      }
    }

    updateNodeApi()

    const getHookHandler = hookName => nodeApi[hookName]

    api.hooks.afterPlugins.tap(nodeApiId, () => {
      api.hooks.initPages.tap(nodeApiId, () => {
        for (const hookName of Object.keys(api.hooks)) {
          const hookHandler = getHookHandler(hookName)
          if (hookHandler) {
            const hook = api.hooks[hookName]
            if (hook.call) {
              // SyncHook
              hook.tap(nodeApiId, hookHandler.bind(api))
            } else {
              // AsyncHook
              hook.tapPromise(nodeApiId, async (...args) =>
                hookHandler.call(api, ...args)
              )
            }
          }
        }
      })
    })

    if (api.mode === 'development' && !/node_modules/.test(nodeApiFile)) {
      require('chokidar')
        .watch(nodeApiFile, {
          ignoreInitial: true
        })
        .on('all', async action => {
          // Disabled half-baked auto-rerun solution
          // await updateNodeApi()
          // Remove all child pages
          // api.pages.removeWhere(page => page.internal.parent)
          // for (const page of api.pages.values()) {
          //   api.hooks.createPage.call(page)
          // }
          // await api.hooks.onCreatePages.promise()
          // await api.hooks.emitPages.promise()
          // await api.hooks.emitRoutes.promise()
          log.warn(
            `${action[0].toUpperCase()}${action.substring(1)} ${nodeApiFile}`
          )
          log.warn(`Please restart the server to take effect.`)
        })
    }
  }

  handleNodeApiFile(path.join(api.theme, 'saber-node.js'), 'theme-node-api')
  handleNodeApiFile(api.resolveCwd('saber-node.js'), 'user-node-api')
}
