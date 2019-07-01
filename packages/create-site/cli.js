#!/usr/bin/env node
const path = require('path')
const { spawnSync } = require('child_process')
const { promisify } = require('util')
const colors = require('kleur')
const downloadGitRepo = require('download-git-repo')
const yargs = require('yargs')
const { ncp } = require('ncp')

const usage = `create-site v${require('./package').version}

Usage: create-site <dir> [options]
`.trim()

const { argv } = yargs
  .usage(usage)
  .scriptName('create-site')
  .alias('t', 'template')
  .nargs('t', 1)
  .describe('t', 'Use a repository as template')
  .help('h')
  .alias('h', 'help')
  .example(
    'create-site my-site',
    'Use default template and install on `my-site` folder'
  )
  .example(
    'create-site my-site -t user/repo',
    'Use user/repo template and install on `my-site` folder'
  )
  .demandCommand()

if (parseInt(process.versions.node, 10) < 8) {
  console.log(
    `Node.js ${process.versions.node} isn't supported, you need Node.js 8 or above.`
  )
  process.exit(1)
}

const dir = path.resolve(argv._[0])

console.log(`Creating a new site...`)

let hasYarn = false
try {
  spawnSync('yarn', ['--version'])
  hasYarn = true
} catch (error) {}

const action = argv.template ? useRepositoryTemplate : useLocalTemplate

action()
  .then(() => {
    console.log(
      colors.green(`Successfully created at ${colors.underline(dir)}`)
    )
    console.log(colors.bold(`To start dev server, run:`))
    console.log(colors.cyan(`$ cd ${path.relative(process.cwd(), dir)}`))
    if (hasYarn) {
      console.log(colors.cyan(`$ yarn`))
      console.log(colors.cyan(`$ yarn dev`))
    } else {
      console.log(colors.cyan(`$ npm install`))
      console.log(colors.cyan(`$ npm run dev`))
    }

    console.log(colors.dim(`For more details, please check out the README.md`))
  })
  .catch(console.error)

function useRepositoryTemplate() {
  return promisify(downloadGitRepo)(argv.template, dir, { clone: false })
}

function useLocalTemplate() {
  return promisify(ncp)(path.join(__dirname, 'template'), dir)
}
