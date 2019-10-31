// @ts-check
const colors = require('./colors')

const chars = {
  info: colors.cyan('info'),
  success: colors.green('success'),
  warning: colors.yellow('warning'),
  error: colors.red('error')
}

/**
 * @typedef {Object} ILogConstructorOptions
 * @property {number=} logLevel
 */

/**
 * Check if a value is `undefined`
 * @param {any} n
 * @returns {boolean}
 */
const defined = n => typeof n !== 'undefined'

class Log {
  constructor() {
    /** @type {ILogConstructorOptions} */
    this.options = {}
  }

  /**
   * @param {ILogConstructorOptions} options
   */
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

  /**
   * Log anything using `console.log`
   * @param  {...any} args
   */
  log(...args) {
    console.log(...args)
  }

  /**
   * Verbose logs
   * @param  {...any} args
   */
  verbose(...args) {
    if (this.logLevel < 4) return

    const messages = args.map(arg => (typeof arg === 'function' ? arg() : arg))
    this.log(colors.dim('[verbose]'), ...messages)
  }

  /**
   * Info logs
   * @param  {...any} args
   */
  info(...args) {
    if (this.logLevel < 3) return

    this.log(`[${chars.info}]`, ...args)
  }

  /**
   * Warning logs
   * @param  {...any} args
   */
  warn(...args) {
    if (this.logLevel < 2) return

    this.log(`[${chars.warning}]`, ...args)
  }

  /**
   * Error logs
   * @param  {...any} args
   */
  error(...args) {
    if (this.logLevel < 1) return

    this.log(`[${chars.error}]`, ...args)
  }

  /**
   * Success logs
   * @param  {...any} args
   */
  success(...args) {
    if (this.logLevel < 3) return

    this.log(`[${chars.success}]`, ...args)
  }
}

module.exports = {
  log: new Log(),
  colors,
  chars
}
