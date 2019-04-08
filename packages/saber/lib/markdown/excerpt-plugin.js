const hasExcerptMark = value => /<!--\s*more\s*-->/.test(value.trim())

module.exports = (md, { paragraphOnly = true } = {}) => {
  // eslint-disable-next-line camelcase
  md.renderer.rules.paragraph_close = (...args) => {
    const [tokens, idx, options, env, self] = args

    if (env) {
      const autoExcerpt = !tokens.some(token => {
        return token.type === 'html_block' && hasExcerptMark(token.content)
      })

      if (autoExcerpt && !env.__excerpted && !env.getAttribute('excerpt')) {
        env.__excerpted = true
        let startIndex = 0
        if (paragraphOnly) {
          for (const [index, token] of tokens.entries()) {
            // eslint-disable-next-line max-depth
            if (token.type === 'paragraph_open') {
              startIndex = index
              break
            }
          }
        }
        env.setAttribute(
          'excerpt',
          self.render(tokens.slice(startIndex, idx + 1), options, env)
        )
      }
    }

    return self.renderToken(tokens, idx, options)
  }

  // eslint-disable-next-line camelcase
  const htmlRule = md.renderer.rules.html_block
  // eslint-disable-next-line camelcase
  md.renderer.rules.html_block = (...args) => {
    const [tokens, idx, options, env, self] = args
    const token = tokens[idx]

    if (
      hasExcerptMark(token.content) &&
      !env.__excerpted &&
      !env.getAttribute('excerpt')
    ) {
      env.setAttribute(
        'excerpt',
        self.render(tokens.slice(0, idx), options, env)
      )
      env.__excerpted = true
    }

    return htmlRule(...args)
  }
}
