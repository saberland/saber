module.exports = md => {
  const RE = /^<(style|script)(?=(\s|>|$))/i

  // eslint-disable-next-line camelcase
  md.renderer.rules.html_block = (tokens, idx, options, env) => {
    const { content } = tokens[idx]
    const hoistedTags = env.getInternal('hoistedTags') || []
    if (RE.test(content.trim())) {
      hoistedTags.push(content)
      env.setInternal('hoistedTags', hoistedTags)
      return ''
    }
    return content
  }
}
