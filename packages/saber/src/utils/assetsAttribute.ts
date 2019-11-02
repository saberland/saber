import { join } from 'path'
import { slash, isAbsoluteUrl } from 'saber-utils'

/**
 * It's considered external resource
 * When it's an absolute url or starting with `/`
 * `/path` is used to reference files in static folder
 */
const isExternal = (str: string) => isAbsoluteUrl(str) || str.startsWith('/')

const MARK = '@@!!SABER_ASSET_MARK_e5968b9a!!@@'

const MARK_GLOBAL_RE = new RegExp(`"${MARK}([^"]+)"`, 'g')

/**
 * Prefix MARK to asset path
 */
const prefixAssets = (assets: { [key: string]: string }, cwd: string) => {
  const result: { [key: string]: string } = {}
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
 */
const requireAssets = (str: string) =>
  str.replace(MARK_GLOBAL_RE, (_, p1) => {
    return `require("${p1}")`
  })

export { prefixAssets, requireAssets }
