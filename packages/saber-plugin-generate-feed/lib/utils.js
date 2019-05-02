// @ts-check
const { URL } = require('url')

/**
 * Get feed path
 * @param {string|boolean|undefined} feedPath
 * @param {string} defaultPath
 */
exports.getFeedPath = (feedPath, defaultPath) => {
  if (feedPath === true) {
    return defaultPath
  }

  if (typeof feedPath === 'string') {
    return feedPath
  }

  return null
}

/**
 * @param {string} base
 * @param {string} pathname
 * @returns {string}
 */
exports.resolveURL = (base, pathname) => {
  return new URL(pathname, base).href
}
