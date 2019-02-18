const fs = require('fs')

const ID = 'builtin:extend-node-api'

exports.name = ID

exports.apply = api => {
  const nodeApiFile = api.resolveCwd('saber-node.js')
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

  const nodeApiId = 'saber-node.js'
  const getHook = hookName => nodeApi[hookName] || (() => {})

  api.hooks.afterPlugins.tap(nodeApiId, () => {
    api.hooks.beforeRun.tap(nodeApiId, () => {
      for (const hookName of Object.keys(api.hooks)) {
        api.hooks[hookName].tap(nodeApiId, (...args) => {
          return getHook(hookName).call(api, ...args)
        })
      }
    })
  })

  if (api.mode === 'development') {
    require('chokidar')
      .watch(nodeApiFile, {
        ignoreInitial: true
      })
      .on('all', async () => {
        await updateNodeApi()
        // Remove all child pages
        api.source.pages.removeWhere(page => page.internal.parent)
        for (const page of api.source.pages.values()) {
          api.hooks.createPage.call(page)
        }
        await api.hooks.onCreatePages.promise()
        await api.hooks.emitPages.promise()
        await api.hooks.emitRoutes.promise()
      })
  }
}
