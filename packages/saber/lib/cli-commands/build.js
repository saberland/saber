const { setNodeEnv, handleError } = require('./utils')

module.exports = function(cli) {
  cli
    .command(
      'build [app-path]',
      'Compile the application and generate static HTML files'
    )
    .alias('generate')
    .option('--skip-compilation', 'Skip the webpack compilation process')
    .option('--inspect-webpack', 'Inspect webpack config in your editor')
    .action((cwd = '.', options) => {
      setNodeEnv('production')

      if (cli.matchedCommandName === 'generate') {
        require('saber-log').log.warn(
          `The "generate" command is now deprecated, please use "build" instead.`
        )
      }

      const { skipCompilation } = options
      delete options.skipCompilation
      return require('..')(Object.assign({ cwd, dev: false }, options))
        .build({ skipCompilation })
        .catch(handleError)
    })
}
