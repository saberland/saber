const fs = require('fs')
const path = require('path')

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
    const [tokens, idx, options, env, self] = args
    const token = tokens[idx]
    const tokenInfo = token.info || ''

    const langName = tokenInfo.replace(RE, '').trim()
    const withValidTokenInfo = RE.test(tokenInfo)

    let fenceOptions = {}
    if (withValidTokenInfo) {
      fenceOptions = parseOptions(tokenInfo)
    }

    const { external: useExternal = false } = fenceOptions

    let { content = '' } = token

    if (useExternal) {
      try {
        const basedir = path.dirname(env.filePath)
        const relPath = content.trim()
        const _p = path.isAbsolute(relPath)
          ? relPath
          : path.resolve(basedir, relPath)

        if (fs.existsSync(_p)) {
          content = fs.readFileSync(_p, { encoding: 'utf-8', flag: 'r' }) || ''
        }
      } catch (error) {} // eslint-disable-line no-empty
    }

    const code = options.highlight
      ? options.highlight(content, langName, env)
      : md.utils.escapeHtml(content)

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

    if (!withValidTokenInfo) {
      return renderPreWrapper(preWrapperAttrs, preAttrs, codeAttrs, code)
    }

    const highlightLines = fenceOptions.highlightLines
      ? fenceOptions.highlightLines.map(v =>
          `${v}`.split('-').map(v => parseInt(v, 10))
        )
      : []
    token.info = langName

    const codeMask =
      `<div class="saber-highlight-mask${langClass ? ` ${langClass}` : ''}">` +
      md.utils
        .escapeHtml(content)
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
