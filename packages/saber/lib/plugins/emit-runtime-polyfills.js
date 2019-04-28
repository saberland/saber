const { fs, slash } = require('saber-utils')

const ID = 'builtin:emit-runtime-polyfills'

let previousPolyfills

exports.name = ID

exports.apply = api => {
  api.hooks.afterPlugins.tap(ID, () => {
    api.hooks.emitRoutes.tapPromise(ID, async () => {
      const polyfills = [...api.runtimePolyfills]
        .map(file => `import '${slash(file)}'`)
        .join('\n')
      if (polyfills !== previousPolyfills) {
        await fs.outputFile(
          api.resolveCache('runtime-polyfills.js'),
          polyfills,
          'utf8'
        )
        previousPolyfills = polyfills
      }
    })
  })
}
