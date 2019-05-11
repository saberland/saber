// @ts-check

const { join } = require('path')
const { slash } = require('saber-utils')

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
 * @param {string} cwd
 */
const prefixAssets = (assets, cwd) => {
  /** @type {{[key: string]: string}} */
  const result = {}
  for (const key of Object.keys(assets)) {
    const value = assets[key]
    if (!isExternal(value) && !value.startsWith(MARK)) {
      const path = value.startsWith('@')
        ? value
        : value.startsWith('module:')
        ? value.slice(7)
        : slash(join(cwd, value))
      result[key] = `${MARK}${path}`
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
