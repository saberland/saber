const { setNodeEnv, handleError } = require('./utils')

module.exports = function(cli) {
  cli
    .command(
      'build [app-path]',
      'Compile the application and generate static HTML files',
      {
        ignoreOptionDefaultValue: true
      }
    )
    .alias('generate')
    .option('--skip-compilation', 'Skip the webpack compilation process')
    .option('--inspect-webpack', 'Inspect webpack config in your editor')
    .option('--no-cache', 'Disable cache')
    .action((cwd = '.', options) => {
      setNodeEnv('production')

      if (cli.matchedCommandName === 'generate') {
        require('saber-log').log.warn(
          `The "generate" command is now deprecated, please use "build" instead.`
        )
      }

      const { skipCompilation, cache } = options
      delete options.skipCompilation
      delete options.cache

      return require('..')
        .createSaber(Object.assign({ cwd, dev: false }, options), {
          build: {
            cache
          }
        })
        .build({ skipCompilation })
        .catch(handleError)
    })
}
