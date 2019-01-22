const os = require('os')
const { log, colors } = require('saber-log')
const prettyTime = require('pretty-ms')
const prettyBytes = require('../utils/prettyBytes')

module.exports = class PrintStatusPlugin {
  constructor({ api }) {
    this.api = api
  }

  apply(compiler) {
    compiler.hooks.invalid.tap('show-rebuild-reason', file => {
      const d = new Date()
      log.info(
        colors.dim(
          `(${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}) Rebuilding due to changes in ${file.replace(
            os.homedir(),
            '~'
          )}`
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

        if (per === 0) {
          spinner.start(msg)
        } else if (per === 1) {
          spinner.stop()
        } else {
          spinner.text = msg
        }
      })
      bar.apply(compiler)
    }

    compiler.hooks.done.tap('print-status', stats => {
      require('../utils/spinner').stop() // Just in case

      const logFiles = () => {
        console.log(
          stats.toString({
            colors: true,
            chunks: false,
            modules: false,
            children: false,
            versions: false,
            assets: false
          })
        )
      }

      if (stats.hasErrors() || stats.hasWarnings()) {
        logFiles()
      } else {
        if (log.isDebug) {
          logFiles()
        }
        log.success(
          `Compiled successfully in ${prettyTime(
            Date.now() - stats.startTime
          )}!`
        )
        if (this.api.mode === 'development') {
          log.info(`Available at ${colors.underline('http://localhost:2020')}`)
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
