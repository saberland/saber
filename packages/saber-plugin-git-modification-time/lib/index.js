const execa = require('execa')

const ID = 'git-modification-time'

exports.name = ID

exports.apply = api => {
  api.hooks.onCreatePage.tapPromise(ID, async page => {
    if (page.internal.absolute) {
      const { stdout } = await execa('git', [
        'log',
        '-1',
        '--pretty=format:%aI',
        '--',
        page.internal.absolute
      ])
      if (stdout) {
        page.updatedAt = new Date(stdout)
      }
    }
  })
}
