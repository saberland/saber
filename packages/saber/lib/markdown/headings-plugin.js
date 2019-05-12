const slugo = require('slugo')

const uniqueSlug = (slug, slugs) => {
  let i = 2
  let unique = slug
  while (slugs.includes(unique)) unique = `${slug}-${i++}`
  slugs.push(unique)
  return unique
}

const permalinkRenderer = (
  slug,
  {
    permalinkBefore,
    permalinkClass,
    permalinkSymbol,
    permalinkHref,
    permalinkComponent
  }, // options
  { Token }, // markdown state
  { children } // heading
) => {
  const space = new Token('text', '', 0)
  space.content = ' '

  const linkTokens = [
    Object.assign(new Token('link_open', permalinkComponent, 1), {
      attrs: [
        ['class', permalinkClass],
        ['to', permalinkHref(slug)],
        ['aria-hidden', 'true']
      ]
    }),
    Object.assign(new Token('html_block', '', 0), {
      content: permalinkSymbol
    }),
    new Token('link_close', permalinkComponent, -1)
  ]

  // append or prepend according to position option.
  // Space is at the opposite side.
  if (permalinkBefore) {
    linkTokens.push(space)
    children.unshift(...linkTokens)
  } else {
    linkTokens.unshift(space)
    children.push(...linkTokens)
  }
}

const defaultOptions = {
  levels: 6,
  permalink: false,
  permalinkClass: 'header-anchor',
  permalinkSymbol: '#',
  permalinkBefore: true,
  permalinkComponent: 'saber-link',
  permalinkRenderer,
  permalinkHref: slug => `#${slug}`,
  injectMarkdownHeadings: true,
  slugify: slugo
}

module.exports = (md, options = {}) => {
  options = Object.assign(defaultOptions, options)
  const slugify = options.slugify || slugo

  md.core.ruler.push('headings', state => {
    const { tokens, env } = state
    const headings = []
    const slugs = []

    const { injectMarkdownHeadings } = env.page.attributes

    const anchorLevels = Array.isArray(options.levels)
      ? options.levels
      : Array.from({ length: options.levels }, (v, i) => i + 1)

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'heading_close') {
        continue
      }

      const heading = tokens[i - 1]
      const headingOpen = tokens[i - 2]
      const level =
        headingOpen.type === 'heading_open' && headingOpen.markup.length // number of '#' defines level

      if (heading.type === 'inline') {
        const text = heading.children
          .filter(
            token => token.type === 'text' || token.type === 'code_inline'
          )
          .reduce((acc, t) => acc + t.content, '')

        let slug = headingOpen.attrGet('id')

        if (slug && slugs.includes(slug)) {
          slug = uniqueSlug(slug, slugs)
        } else if (!slug) {
          slug = uniqueSlug(slugify(md.utils.escapeHtml(text)), slugs)
        }

        headingOpen.attrSet('id', slug)

        if (options.permalink && anchorLevels.includes(level)) {
          options.permalinkRenderer(slug, options, state, heading)
        }

        if (
          injectMarkdownHeadings ||
          (injectMarkdownHeadings !== false && options.injectMarkdownHeadings)
        ) {
          headings.push({
            text,
            slug,
            level
          })
        }
      }
    }

    state.env.page.markdownHeadings = headings
  })
}
