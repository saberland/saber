const path = require('path')
const { spawn, execSync } = require('child_process')
const notifier = require('node-notifier')
const { fs } = require('saber-utils')
const { log } = require('saber-log')
const deepEqual = require('fast-deep-equal')
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
          themeConfig: config.themeConfig || {},
          locales: config.locales || {}
        }),
        'utf8'
      )

    const checkIfConfigChanged = (newConfig, prevConfig) => {
      const dropUnnecessary = config =>
        Object.assign({}, config, {
          siteConfig: undefined,
          themeConfig: undefined,
          locales: undefined
        })
      if (!deepEqual(dropUnnecessary(newConfig), dropUnnecessary(prevConfig))) {
        log.warn(`saber-config.js was changed, you need to restart the server.`)
        notifier.notify({
          title: 'Saber',
          icon: path.join('../assets', 'icon-saber.png'),
          message:
            'saber-config.js was changed, you need to restart the server.',
          wait: true,
          closeLabel: 'close',
          actions: 'restart'
        })

        notifier.on('click', () => {
          execSync(
            `pkill -f ${path.join(process.cwd(), 'node_modules/.bin/saber')}`
          )
          const command = spawn(process.env.npm_execpath, ['run', 'dev'])
          command.stdout.on('data', data => {
            console.log(`${data}`)
          })
        })
      }
    }

    // Emit config.json anyways
    await emit(api.config)

    if (api.dev) {
      const cwd = api.configDir || api.resolveCwd()
      const watcher = require('chokidar').watch(CONFIG_FILES, {
        ignoreInitial: true,
        cwd
      })
      watcher.on('all', async (type, filename) => {
        const filepath = path.join(cwd, filename)
        const { data = {}, path: configPath } = await load({
          files: [filepath]
        })

        const prevConfig = api.config
        await api.setConfig(data, configPath)
        checkIfConfigChanged(api.config, prevConfig)
        await api.hooks.onUpdateConfigFile.promise()
        await emit(api.config)
      })
    }
  })
}
