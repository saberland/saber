const colors = require('./colors')

const chars = {
  info: colors.blue('info'),
  success: colors.green('success'),
  warning: colors.yellow('warning'),
  error: colors.red('error')
}

const defined = n => typeof n !== 'undefined'

class Log {
  constructor() {
    this.setOptions()
  }

  setOptions(options) {
    this.options = Object.assign({}, this.options, options)
  }

  // 4: error, warning, info/success, verbose
  // 3: error, warning, info/success
  // 2: error and wanring
  // 1: error
  // 0: nothing
  get logLevel() {
    const logLevel = defined(this.options.logLevel)
      ? this.options.logLevel
      : defined(process.env.SABER_LOG_LEVEL)
      ? process.env.SABER_LOG_LEVEL
      : 3
    return Number(logLevel)
  }

  log(...args) {
    console.log(...args)
  }

  verbose(...args) {
    if (this.logLevel < 4) return

    const messages = args.map(arg => (typeof arg === 'function' ? arg() : arg))
    this.log(colors.dim('verbose'), ...messages)
  }

  info(...args) {
    if (this.logLevel < 3) return

    this.log(chars.info, ...args)
  }

  warn(...args) {
    if (this.logLevel < 2) return

    this.log(chars.warning, ...args)
  }

  error(...args) {
    if (this.logLevel < 1) return

    this.log(chars.error, ...args)
  }

  success(...args) {
    if (this.logLevel < 3) return

    this.log(chars.success, ...args)
  }
}

module.exports = {
  log: new Log(),
  colors,
  chars
}
