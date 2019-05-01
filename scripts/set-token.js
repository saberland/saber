#!/usr/bin/env node
const config = require('./config')

const args = process.argv.slice(2)

const token = args[0]

if (!token) {
  throw new Error(`Usage: yarn set-token <token>`)
}

config.set('GH_TOKEN', token)
console.log('Done!')
