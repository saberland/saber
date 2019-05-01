#!/usr/bin/env node
const { spawnSync } = require('child_process')
const config = require('./config')

const args = process.argv.slice(2)
const [type, version] = args

const run = (cmd, args, opts) => {
  const { status } = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (status !== 0) {
    process.exit(1)
  }
}

const ghToken = config.get('GH_TOKEN')
if (!ghToken) {
  throw new Error(
    [
      'Publishing a GitHub Release requires your personal GitHub access token.',
      'You can get one on https://github.com/settings/tokens/new',
      'Then set it with `yarn set-token <token>`'
    ].join('\n')
  )
}

process.env.GH_TOKEN = ghToken

if (type === 'canary') {
  run('yarn', [
    'lerna',
    'version',
    version || 'prerelease',
    '--conventional-commits',
    '--github-release',
    '--preid',
    'canary'
  ])
  run('yarn', ['lerna', 'publish', 'from-git', '--dist-tag', 'canary'])
} else if (type === 'stable') {
  run(
    'yarn',
    [
      'lerna',
      'version',
      version,
      '--conventional-commits',
      '--github-release'
    ].filter(Boolean)
  )
  run('yarn', ['lerna', 'publish', 'from-git', '--dist-tag', 'latest'])
}
