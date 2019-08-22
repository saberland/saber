#!/usr/bin/env node

// Publish a canary release from a Pull Request
const { spawnSync } = require('child_process')
const { prompt } = require('enquirer')

async function main() {
  let { NPM_TOKEN, GH_TOKEN } = process.env

  if (!NPM_TOKEN) {
    NPM_TOKEN = await prompt({
      name: 'token',
      type: 'input',
      message: 'NPM access token',
      validate: v => Boolean(v)
    }).then(res => res.token)
  }

  if (!GH_TOKEN) {
    GH_TOKEN = await prompt({
      name: 'token',
      type: 'input',
      message: 'GitHub access token',
      validate: v => Boolean(v)
    }).then(res => res.token)
  }

  const PR_NUMBER = await prompt({
    name: 'pr',
    type: 'input',
    message: 'Which PR number do you want to publish',
    validate: v => Boolean(v)
  }).then(res => res.pr)

  const { status } = spawnSync('auto', ['canary', '--pr', PR_NUMBER, '-w'], {
    stdio: 'inherit',
    env: Object.assign({}, process.env, {
      GH_TOKEN,
      NPM_TOKEN
    })
  })

  if (status !== 0) {
    throw new Error(`Command failed.`)
  }
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
