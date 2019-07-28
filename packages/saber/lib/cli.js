#!/usr/bin/env node
const cac = require('cac')

const cli = cac()
require('./cli-commands')(cli)

cli.option('-V, --verbose', 'Output verbose logs')
cli.option('--no-progress', 'Disable progress bar')

cli.version(require('../package').version)

cli.help()

cli.parse()

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
