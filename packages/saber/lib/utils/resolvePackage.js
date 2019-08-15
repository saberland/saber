// @ts-check
const path = require('path')
const resolveFrom = require('resolve-from')

const LOCAL_PATH_RE = /^[./]|(^[a-zA-Z]:)/

/**
 * @param {string} input
 * @param {Object} options
 * @param {string} [options.cwd=process.cwd()]
 * @param {string=} options.prefix
 */
module.exports = (input, { cwd = process.cwd(), prefix } = {}) => {
  if (LOCAL_PATH_RE.test(input)) {
    return path.resolve(cwd, input)
  }

  const packageName = input.startsWith('@')
    ? input
    : !prefix || input.startsWith(prefix)
    ? input
    : `${prefix}${input}`

  return path.dirname(resolveFrom(cwd, `${packageName}/package.json`))
}
