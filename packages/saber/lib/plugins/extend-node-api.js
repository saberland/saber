const fs = require('fs')
const path = require('path')
const { log, colors } = require('saber-log')

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

    const getHookHandler = hookName => nodeApi[hookName] || __noopHandler__
    const addHook = hookName => {
      const hook = api.hooks[hookName]
      if (hook) {
        const tapType = hook.call ? 'tap' : 'tapPromise'
        hook[tapType](nodeApiId, (...args) => {
          const hookHandler = getHookHandler(hookName)
          if (hookHandler.name !== '__noopHandler__') {
            log.verbose(() => `${hookName} ${colors.dim(`(${nodeApiId})`)}`)
          }

          if (tapType === 'tap') {
            return hookHandler.call(api, ...args)
          }

          return Promise.resolve(hookHandler.call(api, ...args))
        })
      }
    }

    // Hooks that should be added before `afterPlugins` hook
    const preHooks = ['beforePlugins', 'filterPlugins']

    for (const preHook of preHooks) {
      addHook(preHook)
    }

    api.hooks.afterPlugins.tap(nodeApiId, () => {
      for (const hookName of Object.keys(api.hooks)) {
        if (preHooks.includes(hookName)) {
          continue
        }

        addHook(hookName)
      }
    })

    if (api.dev && !/node_modules/.test(nodeApiFile)) {
      require('chokidar')
        .watch(nodeApiFile, {
          ignoreInitial: true
        })
        .on('all', async action => {
          await updateNodeApi()
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
            `${action[0].toUpperCase()}${action.substring(1)} ${nodeApiFile}`
          )
          // Because you might also update webpack config in saber-node.js
          // Which we can't (?) automatically reload
          log.warn(`You probably need to restart the server.`)
        })
    }
  }

  handleNodeApiFile(path.join(api.theme, 'saber-node.js'), 'theme-node-api')
  handleNodeApiFile(api.resolveCwd('saber-node.js'), 'user-node-api')
}

function __noopHandler__(arg) {
  return arg
}
