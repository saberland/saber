// @ts-check
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
