// @ts-check
const path = require('path')
const resolveFrom = require('resolve-from')

const LOCAL_PATH_RE = /^[./]|(^[a-zA-Z]:)/

/**
 * Add prefix to package name
 * @param {string} input
 * @param {string=} prefix
 */
const addPrefix = (input, prefix) => {
  if (!prefix) return input

  if (input.startsWith('@')) {
    return input.replace(new RegExp(`^@(\\w+)/(${prefix})?`), `@$1/${prefix}`)
  }

  return input.startsWith(prefix) ? input : `${prefix}${input}`
}

/**
 * @param {string} input
 * @param {Object} options
 * @param {string|false} [options.cwd=process.cwd()]
 * @param {string=} options.prefix
 */
module.exports = (input, { cwd = process.cwd(), prefix } = {}) => {
  if (LOCAL_PATH_RE.test(input)) {
    return cwd === false ? input : path.resolve(cwd, input)
  }

  input = addPrefix(input, prefix)

  if (cwd === false) {
    return input
  }

  return path.dirname(resolveFrom(cwd, `${input}/package.json`))
}
