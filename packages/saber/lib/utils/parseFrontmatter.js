const { log } = require('saber-log')

const RE_STARTING = /^(?:\r?\n)*---([a-z]+)?(?:\r?\n)+/

const parsers = {
  yaml: str => require('./yaml.min').safeLoad(str),
  yml: str => require('./yaml.min').safeLoad(str),
  toml: str => require('./toml.min').parse(str)
}

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

  const parse = parsers[starting[1] || 'yaml']
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
