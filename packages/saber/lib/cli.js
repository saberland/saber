#!/usr/bin/env node
const cac = require('cac')

const cli = cac()

cli.command('build [dir]', 'Build website').action((cwd = '.', options) => {
  return require('..')(Object.assign({ cwd, mode: 'production' }, options))
    .build()
    .catch(handleError)
})

cli
  .command('[dir]', 'Run website in dev mode')
  .alias('dev')
  .action((cwd = '.', options) => {
    return require('..')(Object.assign({ cwd, mode: 'development' }, options))
      .dev()
      .catch(handleError)
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
