const { fs } = require('saber-utils')

const ID = 'builtin:emit-saber-variables'

exports.name = ID

exports.apply = api => {
  api.hooks.beforeRun.tapPromise(ID, async () => {
    const variables = {}
    api.hooks.defineVariables.call(variables)
    await fs.outputFile(
      api.resolveCache('variables.json'),
      JSON.stringify(variables),
      'utf8'
    )
  })
}
