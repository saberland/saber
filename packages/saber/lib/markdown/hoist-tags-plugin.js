module.exports = md => {
  const RE = /^<(style|script)(?=(\s|>|$))/i

  md.renderer.rules.html_block = (tokens, idx, options, env) => {
    const { content } = tokens[idx]
    const hoistedTags = env.page.internal.hoistedTags || []
    if (RE.test(content.trim())) {
      hoistedTags.push(content)
      env.page.internal.hoistedTags = hoistedTags
      return ''
    }

    return content
  }
}
