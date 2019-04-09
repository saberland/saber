#!/usr/bin/env node
const cac = require('cac')

const cli = cac()

cli
  .command('[app]', 'Run the application in dev mode', {
    ignoreOptionDefaultValue: true
  })
  .alias('dev')
  .option('--port <port>', 'Server port', { default: 3000 })
  .option('--host <host>', 'Server host', { default: '0.0.0' })
  .action((cwd = '.', options) => {
    setNodeEnv('development')

    const { host, port } = options
    delete options.host
    delete options.port
    return require('..')(Object.assign({ cwd, dev: true }, options), {
      server: {
        host,
        port
      }
    })
      .serve()
      .catch(handleError)
  })

cli
  .command('build [app]', 'Compile the application')
  .action((cwd = '.', options) => {
    setNodeEnv('production')

    return require('..')(Object.assign({ cwd, dev: false }, options))
      .build()
      .catch(handleError)
  })

cli
  .command(
    'generate [app]',
    'Compile the application and generate static HTML files'
  )
  .option(
    '--skip-build',
    'Skip compiling the application if you already ran `saber build`'
  )
  .action((cwd = '.', options) => {
    setNodeEnv('production')

    const { skipBuild } = options
    delete options.skipBuild
    return require('..')(Object.assign({ cwd, dev: false }, options))
      .generate({ skipBuild })
      .catch(handleError)
  })

cli
  .command('serve [app]', 'Serve the already generated application')
  .option('--host <host>', 'Server host', { default: '0.0.0.0' })
  .option('--port <host>', 'Server port', { default: 3000 })
  .action((cwd = '.', options) => {
    return require('./serve')(Object.assign({ cwd }, options))
  })

cli.option('--debug', 'Show debug logs')
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
