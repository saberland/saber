#!/usr/bin/env node
const path = require('path')
const { exec } = require('child_process')
const { fs } = require('saber-utils')
const { log } = require('saber-log')
const cac = require('cac')
const configLoader = require('./utils/configLoader')
const resolvePackage = require('./utils/resolvePackage')

const cli = cac()

cli
  .command('[app]', 'Run the application in dev mode', {
    ignoreOptionDefaultValue: true
  })
  .alias('dev')
  .option('--lazy', 'Enable lazy page compilation')
  .option('--port <port>', 'Server port', { default: 3000 })
  .option('--host <host>', 'Server host', { default: '0.0.0.0' })
  .action((cwd = '.', options) => {
    setNodeEnv('development')

    const { host, port, lazy } = options
    delete options.host
    delete options.port
    delete options.lazy
    return require('..')(Object.assign({ cwd, dev: true }, options), {
      server: {
        host,
        port
      },
      build: {
        lazy
      }
    })
      .serve()
      .catch(handleError)
  })

cli
  .command(
    'build [app]',
    'Compile the application and generate static HTML files'
  )
  .alias('generate')
  .option('--skip-compilation', 'Skip the webpack compilation process')
  .action((cwd = '.', options) => {
    setNodeEnv('production')

    if (cli.matchedCommandName === 'generate') {
      require('saber-log').log.warn(
        `The "generate" command is now deprecated, please use "build" instead.`
      )
    }

    const { skipCompilation } = options
    delete options.skipCompilation
    return require('..')(Object.assign({ cwd, dev: false }, options))
      .build({ skipCompilation })
      .catch(handleError)
  })

cli
  .command(
    'eject [app]',
    `Copy the currently used theme's source code to a local folder.`
  )
  .option(
    '--git',
    'Pull code from Git, instead of node_modules, and add the theme as a submodule',
    { default: false }
  )
  .option('--path <path>', 'Ejected theme destination', { default: './theme' })
  .action(async (cwd = '.', options) => {
    cwd = path.join(process.cwd(), cwd)
    const { git } = options

    const config =
      configLoader.load({ cwd, files: configLoader.CONFIG_FILES }).data || {}
    if (!config.theme) {
      log.error('No theme specified in config.')
      process.exit(1)
    }

    const destPath = path.join(cwd, options.path)
    const relativeDest = path.relative(cwd, destPath)
    if (await fs.pathExists(destPath)) {
      log.error(
        `The path ${
          options.path
        } already exists. Please specify a different one using "--path".`
      )
      process.exit(1)
    }

    const themePath = resolvePackage(config.theme, {
      prefix: 'saber-theme-',
      cwd
    })
    if (!themePath) {
      log.error(
        `Theme "${config.theme}" could not be found in your node_modules.`
      )
      process.exit(1)
    }

    if (git) {
      const themePackage = configLoader.load({
        cwd: themePath,
        files: ['package.json']
      }).data

      if (themePackage.repository && themePackage.repository.url) {
        const repo = themePackage.repository.url
        await new Promise(resolve =>
          exec(
            `git submodule add "${repo}" "${relativeDest}"`,
            { cwd },
            (error, stdout, stderr) => {
              if (error) {
                log.error(`Could not add submodule: ${stderr.toString()}`)
                process.exit(1)
              }

              if (options.verbose) {
                log.verbose(stdout)
                if (stderr) log.verbose(stderr)
              }

              log.info('Added theme as submodule.')
              resolve()
            }
          )
        )
      } else {
        log.error(
          'The theme has no git repository specified within its package.json.'
        )
        process.exit(1)
      }
    } else {
      try {
        await fs.copy(themePath, destPath, {
          filter: src => !src.endsWith('/node_modules')
        })

        log.info('Copied theme from node_modules.')
      } catch (error) {
        log.error(`Could not copy files: ${error.toString()}`)
      }
    }

    log.info(
      `Plese change "theme" in your Saber config to "./${relativeDest}".`
    )
  })

cli
  .command('serve [app]', 'Serve the output directory')
  .option('--host <host>', 'Server host', { default: '0.0.0.0' })
  .option('--port <port>', 'Server port', { default: 3000 })
  .action((cwd = '.', options) => {
    setNodeEnv('production')

    const { host, port } = options
    delete options.host
    delete options.port
    return require('..')(Object.assign({ cwd, dev: true }, options), {
      server: {
        host,
        port
      }
    })
      .serveOutDir()
      .catch(handleError)
  })

cli.option('-V, --verbose', 'Output verbose logs')
cli.option('--no-progress', 'Disable progress bar')

cli.version(require('../package').version)

cli.help()

cli.parse()

function handleError(err) {
  require('saber-log').log.error(err.stack)
  process.exit(1)
}

function setNodeEnv(env) {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = env
  }
}

process.on('SIGINT', () => {
  const { log } = require('saber-log')
  log.log('')
  log.info(`See you later, master!`) // <-- Saber says
  process.exit()
})

process.on('unhandledRejection', error => {
  const { log } = require('saber-log')
  log.error(error.stack)
  process.exitCode = 1
})
