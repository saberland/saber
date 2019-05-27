#!/usr/bin/env node
const cac = require('cac')

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
