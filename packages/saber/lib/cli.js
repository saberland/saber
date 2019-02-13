#!/usr/bin/env node
const cac = require('cac')

const cli = cac()

cli
  .command('[app]', 'Run the application in dev mode')
  .alias('dev')
  .action((cwd = '.', options) => {
    return require('..')(Object.assign({ cwd, mode: 'development' }, options))
      .dev()
      .catch(handleError)
  })

cli
  .command('build [app]', 'Compile the application')
  .action((cwd = '.', options) => {
    return require('..')(Object.assign({ cwd, mode: 'production' }, options))
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
    return require('..')(Object.assign({ cwd, mode: 'production' }, options))
      .generate({ skipBuild: options.skipBuild })
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
