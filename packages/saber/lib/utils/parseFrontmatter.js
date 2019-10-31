// @ts-check
const { log } = require('saber-log')

const RE_STARTING = /^(?:\r?\n)*---([a-z]+)?(?:\r?\n)+/

/**
 * @typedef {(str: string) => Object} Parser
 * @typedef {{[k: string]: Parser}} IParsers
 */

/**
 * @type {IParsers}
 */
const parsers = {
  yaml: str => require('./yaml.min').safeLoad(str),
  yml: str => require('./yaml.min').safeLoad(str),
  toml: str => require('./toml.min').parse(str)
}

/**
 * Extract front matter from a page
 * @param {string} content
 * @param {string} filepath
 * @returns {{frontmatter: {[k:string]: any}, body: string}}
 */
module.exports = (content, filepath) => {
  const getEmpty = () => ({
    frontmatter: {},
    body: content && content.trim()
  })

  if (!content) {
    return getEmpty()
  }

  const starting = RE_STARTING.exec(content)
  if (!starting) {
    return getEmpty()
  }

  const parseType = starting[1] || 'yaml'
  const parse = parsers[parseType]
  if (!parse) {
    throw new Error(`Unsupported front matter type: ${parseType}`)
  }

  const rest = content.replace(RE_STARTING, '')
  const index = rest.indexOf('\n---')
  const head = rest.slice(0, index)
  const body = rest.slice(index + 4)
  let frontmatter
  try {
    frontmatter = parse(head)
  } catch (error) {
    if (filepath) {
      log.error(`Error parsing front matter in ${filepath}`)
    }

    throw error
  }

  return {
    frontmatter,
    body: body && body.trim()
  }
}
