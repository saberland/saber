const os = require('os')
const { log, colors } = require('saber-log')
const prettyTime = require('pretty-ms')
const prettyBytes = require('../utils/prettyBytes')

module.exports = class PrintStatusPlugin {
  constructor({ api, type }) {
    this.api = api
    this.type = type
  }

  apply(compiler) {
    compiler.hooks.invalid.tap('show-rebuild-reason', file => {
      const d = new Date()
      log.info(
        colors.dim(
          `(${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}) Rebuilding ${
            this.type
          } due to changes in ${file.replace(os.homedir(), '~')}`
        )
      )
    })

    if (
      this.api.opts.progress !== false &&
      !process.env.CI &&
      process.stdout.isTTY
    ) {
      const { ProgressPlugin } = require('webpack')
      const bar = new ProgressPlugin((per, message, ...args) => {
        const spinner = require('../utils/spinner')

        const msg = `${(per * 100).toFixed(2)}% ${message} ${args
          .map(arg => {
            const message = arg.replace(os.homedir(), '~')
            return message.length > 40
              ? `...${message.substr(message.length - 39)}`
              : message
          })
          .join(' ')}`

        if (per === 1) {
          spinner.stop()
        } else {
          spinner.start(msg)
        }
      })
      bar.apply(compiler)
    }

    compiler.hooks.done.tap('print-status', stats => {
      require('../utils/spinner').stop() // Just in case

      const logFiles = stateful => {
        stats
          .toString({
            colors: true,
            chunks: false,
            modules: false,
            children: false,
            version: false,
            assets: false,
            timings: false,
            hash: false
          })
          .split('\n')
          .forEach(line => {
            if (stateful) {
              log.info(line)
            } else {
              log.log(line)
            }
          })
      }

      if (stats.hasErrors() || stats.hasWarnings()) {
        logFiles()
      } else {
        if (log.logLevel > 3) {
          logFiles(true)
        }
        log.success(
          `Compiled ${this.type} successfully in ${prettyTime(
            Date.now() - stats.startTime
          )}!`
        )
        // Only show URL for client build
        if (this.api.dev && this.type === 'client') {
          const host =
            this.api.config.server.host === '0.0.0.0'
              ? 'localhost'
              : this.api.config.server.host
          log.info(
            `Available at ${colors.underline(
              `http://${host}:${this.api.config.server.port}`
            )}`
          )
          log.info(
            colors.dim(
              `${prettyBytes(process.memoryUsage().heapUsed)} memory used`
            )
          )
        }
      }
    })
  }
}
