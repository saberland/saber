module.exports = function(md) {
  // eslint-disable-next-line camelcase
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const hrefIndex = token.attrIndex('href')
    const link = token.attrs[hrefIndex]

    if (link[1].startsWith('#')) {
      token.tag = 'router-link'
      link[0] = ':to'
      link[1] = `{hash: ${JSON.stringify(link[1].slice(1))}}`
    } else if (link[1].startsWith('/')) {
      token.tag = 'router-link'
      link[0] = 'to'
    } else if (/^https?:\/\//.test(link[1])) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    }

    return self.renderToken(tokens, idx, options)
  }

  // eslint-disable-next-line camelcase
  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    const openToken = tokens[idx - 2]
    const token = tokens[idx]
    const prefix = ''
    if (openToken) {
      if (openToken.tag === 'router-link') {
        token.tag = 'router-link'
      }
    }
    return prefix + self.renderToken(tokens, idx, options)
  }
}
