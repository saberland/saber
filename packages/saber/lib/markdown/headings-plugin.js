const slugify = require('slugo')

module.exports = (md, options = {}) => {
  options = Object.assign(
    {
      injectMarkdownHeadings: false,
      slugify
    },
    options
  )
  const slugFn = options.slugify || slugify

  md.core.ruler.push('md_headings', state => {
    const { tokens, env } = state
    const injectMarkdownHeadings = env.getAttribute('injectMarkdownHeadings')
    const headings = []

    const inject =
      injectMarkdownHeadings ||
      (injectMarkdownHeadings !== false && options.injectMarkdownHeadings)
    const injectLevels = Array.isArray(inject) ? inject : [2, 3, 4, 5]

    if (inject) {
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== 'heading_close') {
          continue
        }

        const headingOpen = tokens[i - 2]
        const level =
          headingOpen.type === 'heading_open' && headingOpen.markup.length // number of '#' defines level

        if (!injectLevels.includes(level)) {
          continue
        }

        const heading = tokens[i - 1]

        if (heading.type === 'inline') {
          let text

          if (
            heading.children &&
            heading.children.length > 0 &&
            heading.children[0].type === 'link_open'
          ) {
            // headings that contain links have to be processed
            // differently since nested links aren't allowed in markdown
            text = heading.children[1].content
          } else {
            text = heading.content
          }

          const slug = slugFn(text)

          headings.push({
            text,
            slug,
            level
          })
        }
      }
    }

    state.env.setAttribute('markdownHeadings', headings)
  })
}
