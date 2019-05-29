const RE = /\s*{([^}]+)}/

const parseOptions = str => {
  const [, options] = RE.exec(str)
  const fn = new Function(`return {${options}}`) // eslint-disable-line no-new-func
  return fn()
}

const generateLineNumbers = code =>
  '<code class="saber-highlight-line-numbers">' +
  code
    .trim()
    .split('\n')
    .map((lineHtml, i) => `<span class="token">${i + 1}</span>`)
    .join('\n') +
  '</code>'

module.exports = (
  md,
  { highlightedLineBackground, lineNumbers = false } = {}
) => {
  const renderPreWrapper = ({
    preWrapperAttrs,
    preAttrs,
    codeAttrs,
    code,
    codeMask = '',
    lines = ''
  }) =>
    `<div${preWrapperAttrs}>${codeMask}<pre${preAttrs}>${lines}<code${codeAttrs}>${code.trim()}</code></pre></div>`

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options, env, self] = args
    const token = tokens[idx]

    const langName = token.info.replace(RE, '').trim()

    const code = options.highlight
      ? options.highlight(token.content, langName, env)
      : md.utils.escapeHtml(token.content)

    const renderAttrs = attrs => self.renderAttrs({ attrs })

    const langClass = `language-${langName || 'text'}`
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
      // Generate lines if global markdown.lineNumbers is true
      const lines = lineNumbers ? generateLineNumbers(code) : ''

      return renderPreWrapper({
        preWrapperAttrs,
        preAttrs,
        codeAttrs,
        code,
        lines
      })
    }

    const fenceOptions = parseOptions(token.info)
    const highlightLines = fenceOptions.highlightLines
      ? fenceOptions.highlightLines.map(v =>
          `${v}`.split('-').map(v => parseInt(v, 10))
        )
      : []

    token.info = langName

    const shouldGenerateLineNumbers =
      // It might be false so check for undefined
      fenceOptions.lineNumbers === undefined
        ? // Defaults to global config
          lineNumbers
        : // If it's set to false, even if the global config says true, ignore
          fenceOptions.lineNumbers
    const lines = shouldGenerateLineNumbers ? generateLineNumbers(code) : ''

    const codeMask =
      highlightLines.length === 0
        ? ''
        : `<div class="saber-highlight-mask${
            langClass ? ` ${langClass}` : ''
          }">` +
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

    return renderPreWrapper({
      preWrapperAttrs,
      preAttrs,
      codeAttrs,
      code,
      codeMask,
      lines
    })
  }
}
