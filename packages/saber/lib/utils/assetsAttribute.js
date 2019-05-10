// @ts-check

/**
 * Check if it's external resource
 * @param {string} str
 */
const isExternal = str => /^https?:\/\//.test(str) || /^\//.test(str)

const MARK = '@@!!SABER_ASSET_MARK_e5968b9a!!@@'

const MARK_GLOBAL_RE = new RegExp(`"${MARK}([^"]+)"`, 'g')

/**
 * Prefix MARK to asset path
 * @param {{[key: string]: string}} assets
 */
const prefixAssets = assets => {
  /** @type {{[key: string]: string}} */
  const result = {}
  for (const key of Object.keys(assets)) {
    const value = assets[key]
    if (!isExternal(value) && !value.startsWith(MARK)) {
      result[key] = `${MARK}${value}`
    } else {
      result[key] = value
    }
  }

  return result
}

/**
 * Replace strings starting with the MARK to `require` call
 * @param {string} str
 */
const requireAssets = str =>
  str.replace(MARK_GLOBAL_RE, (_, p1) => {
    return `require("${p1}")`
  })

module.exports = {
  prefixAssets,
  requireAssets
}
