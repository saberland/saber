#!/usr/bin/env node
const cac = require('cac').default

const cli = cac()

cli
  .command('dev', 'Start dev server', (input, flags) => {
    if (flags.debug) {
      process.env.DEBUG = 'saber'
    }
    return require('..')(input[0], flags).develop()
  })
  .option('port', {
    desc: 'Server port'
  })
  .option('host', {
    desc: 'Server host'
  })

cli.command('build', 'Build and generate static website', (input, flags) => {
  if (flags.debug) {
    process.env.DEBUG = 'saber'
  }
  return require('..')(input[0], flags).build()
})

cli
  .option('debug', {
    desc: 'Show debug output',
    type: 'boolean'
  })
  .option('debug-webpack', {
    desc: 'Debug webpack config',
    type: 'boolean'
  })
  .option('progress', {
    desc: 'Toggle progress bar',
    default: true,
    type: 'boolean'
  })

cli.parse()
