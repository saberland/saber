const { setNodeEnv, handleError } = require('./utils')

module.exports = function(cli) {
  cli
    .command('[app]', 'Run the application in dev mode', {
      ignoreOptionDefaultValue: true
    })
    .alias('dev')
    .option('--lazy', 'Enable lazy page compilation')
    .option('--port <port>', 'Server port', { default: 3000 })
    .option('--host <host>', 'Server host', { default: '0.0.0.0' })
    .option('--ssr', 'Enable server-side rendering')
    .option('--inspect-webpack', 'Inspect webpack config in your editor')
    .action((cwd = '.', options) => {
      setNodeEnv('development')

      const { host, port, lazy, ssr } = options
      delete options.host
      delete options.port
      delete options.lazy
      delete options.ssr
      return require('..')(Object.assign({ cwd, dev: true }, options), {
        server: {
          host,
          port,
          ssr
        },
        build: {
          lazy
        }
      })
        .serve()
        .catch(handleError)
    })
}
