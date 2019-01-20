const resolveFrom = require('resolve-from')

exports.name = 'builtin:transformer-markdown'

exports.apply = api => {
  api.registerTransformer('md', (page, file) => {
    const { frontmatter, body } = require('../utils/parseFrontmatter')(
      file.content
    )
    Object.assign(page.attributes, frontmatter)
    transformMarkdown(
      { page, body, configDir: api.configDir },
      api.config.markdown || {}
    )
  })
}

function transformMarkdown({ page, body, configDir }, markdown) {
  const env = { Token: require('saber-markdown').Token, hoistedTags: [] }
  const md = require('saber-markdown')(
    Object.assign(
      {
        html: true
      },
      markdown.options
    )
  )
  const plugins = [
    require.resolve('../markdown/hoist-tags-plugin'),
    {
      resolve: require.resolve('../markdown/anchor-plugin'),
      options: markdown.slugify && {
        slugify: require(resolveFrom(configDir, markdown.slugify))
      }
    },
    require.resolve('../markdown/escape-interpolations-plugin'),
    ...(markdown.plugins ? markdown.plugins.map(p => resolveFrom(configDir, p)) : [])
  ]
  plugins.forEach(plugin => {
    if (typeof plugin === 'string') {
      plugin = { resolve: plugin }
    }
    md.use(require(plugin.resolve), plugin.options)
  })
  page.content = md.render(body, env)
  page.hoistedTags = env.hoistedTags
}
