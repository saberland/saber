const { setNodeEnv, handleError } = require('./utils')

module.exports = function(cli) {
  cli
    .command('serve [app-path]', 'Serve the output directory')
    .option('--host <host>', 'Server host', { default: '0.0.0.0' })
    .option('--port <port>', 'Server port', { default: 3000 })
    .action((cwd = '.', options) => {
      setNodeEnv('production')

      const { host, port } = options
      delete options.host
      delete options.port
      return require('..')
        .createSaber(Object.assign({ cwd, dev: true }, options), {
          server: {
            host,
            port
          }
        })
        .serveOutDir()
        .catch(handleError)
    })
}
