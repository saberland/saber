const RE = /\s*{([^}]+)}/

const parseOptions = str => {
  const [, options] = RE.exec(str)
  const fn = new Function(`return {${options}}`) // eslint-disable-line no-new-func
  return fn()
}

module.exports = (md, { highlightedLineBackground } = {}) => {
  const renderPreWrapper = (
    preWrapperAttrs,
    preAttrs,
    codeAttrs,
    code,
    codeMask = ''
  ) =>
    `<div${preWrapperAttrs}>${codeMask}<pre${preAttrs}><code${codeAttrs}>${code.trim()}</code></pre></div>`

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options, , self] = args
    const token = tokens[idx]

    const langName = token.info.replace(RE, '').trim()

    const code = options.highlight
      ? options.highlight(token.content, langName)
      : md.utils.escapeHtml(token.content)

    const renderAttrs = attrs => self.renderAttrs({ attrs })

    const langClass = langName ? `language-${langName}` : ''
    const preAttrs = renderAttrs([
      ...(token.attrs || []),
      ['class', ['saber-highlight-code', langClass].filter(Boolean).join(' ')]
    ])
    const codeAttrs = renderAttrs([
      ...(token.attrs || []),
      ['class', langClass]
    ])
    const preWrapperAttrs = renderAttrs([
      ['class', 'saber-highlight'],
      ['v-pre', ''],
      ['data-lang', langName]
    ])

    if (!token.info || !RE.test(token.info)) {
      return renderPreWrapper(preWrapperAttrs, preAttrs, codeAttrs, code)
    }

    const fenceOptions = parseOptions(token.info)
    const highlightLines =
      fenceOptions.highlightLines &&
      fenceOptions.highlightLines.map(v =>
        `${v}`.split('-').map(v => parseInt(v, 10))
      )
    token.info = langName

    const codeMask =
      `<div class="saber-highlight-mask${langClass ? ` ${langClass}` : ''}">` +
      md.utils
        .escapeHtml(token.content)
        .split('\n')
        .map((split, index) => {
          split = split || '&#8203;'
          const lineNumber = index + 1
          const inRange = highlightLines.some(([start, end]) => {
            if (start && end) {
              return lineNumber >= start && lineNumber <= end
            }
            return lineNumber === start
          })
          if (inRange) {
            const style = highlightedLineBackground
              ? ` style="background-color: ${highlightedLineBackground}"`
              : ''
            return `<div class="code-line highlighted"${style}>${split}</div>`
          }
          return `<div class="code-line">${split}</div>`
        })
        .join('') +
      '</div>'

    return renderPreWrapper(
      preWrapperAttrs,
      preAttrs,
      codeAttrs,
      code,
      codeMask
    )
  }
}
