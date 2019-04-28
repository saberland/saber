const { fs, slash } = require('saber-utils')

const ID = 'builtin:emit-runtime-polyfills'

exports.name = ID

exports.apply = api => {
  api.hooks.beforeRun.tapPromise(ID, async () => {
    await fs.outputFile(
      api.resolveCache('runtime-polyfills.js'),
      [...api.runtimePolyfills]
        .map(file => `import '${slash(file)}'`)
        .join('\n'),
      'utf8'
    )
  })
}
