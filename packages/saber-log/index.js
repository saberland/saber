const colors = require('./colors')

const chars = {
  info: colors.blue('info'),
  success: colors.green('success'),
  warning: colors.yellow('warning'),
  error: colors.red('error')
}

class Log {
  constructor() {
    this.options = {}
  }

  get isDebug() {
    return typeof this.options.debug === 'boolean'
      ? this.options.debug
      : process.env.SABER_DEBUG
  }

  setOptions(options) {
    Object.assign(this.options, options)
  }

  log(...args) {
    console.log(...args)
  }

  debug(...args) {
    if (!this.isDebug) return
    console.log(colors.magenta('debug'), ...args)
  }

  info(...args) {
    console.log(chars.info, ...args)
  }

  warn(...args) {
    console.warn(chars.warning, ...args)
  }

  error(...args) {
    console.error(chars.error, ...args)
  }

  success(...args) {
    console.log(chars.success, ...args)
  }
}

module.exports = {
  log: new Log(),
  colors,
  chars
}
