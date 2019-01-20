const RE_STARTING = /^\n*---([a-z]+)?\n+/

const parsers = {
  yaml: str => require('./yaml.min').safeLoad(str),
  yml: str => require('./yaml.min').safeLoad(str),
  toml: str => require('./toml.min').parse(str)
}

module.exports = content => {
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
  return {
    frontmatter: parse(head),
    body: body && body.trim()
  }
}
