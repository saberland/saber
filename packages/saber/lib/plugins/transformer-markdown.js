const resolvePackage = require('../utils/resolvePackage')

exports.name = 'builtin:transformer-markdown'

exports.apply = api => {
  api.transformers.add('markdown', {
    extensions: ['md'],
    parse(page) {
      const { frontmatter, body } = require('../utils/parseFrontmatter')(
        page.content,
        page.internal.absolute
      )
      Object.assign(page.attributes, frontmatter)
      page.content = body
    },
    transform(page) {
      transformMarkdown(api, page)
    },
    getPageComponent(page) {
      return `
        <template>
          <layout-manager :page="$page">
            ${page.content || ''}
          </layout-manager>
        </template>
      `
    }
  })
}

function transformMarkdown(api, page) {
  const { configDir } = api
  const { markdown = {} } = api.config
  const env = {
    Token: require('saber-markdown').Token,
    hoistedTags: [],
    filePath: page.internal.absolute,
    pagesDir: api.resolveCwd('pages')
  }
  const md = require('saber-markdown')(
    Object.assign(
      {
        html: true,
        linkify: true,
        highlight:
          markdown.highlighter &&
          require(resolvePackage(markdown.highlighter, {
            cwd: configDir,
            prefix: 'saber-highlighter-'
          }))
      },
      markdown.options
    )
  )
  const plugins = [
    {
      resolve: require.resolve('../markdown/hoist-tags-plugin')
    },
    {
      resolve: require.resolve('../markdown/anchor-plugin'),
      options: markdown.slugify && {
        slugify: require(resolvePackage(markdown.slugify, { cwd: configDir }))
      }
    },
    {
      resolve: require.resolve('../markdown/excerpt-plugin')
    },
    {
      resolve: require.resolve('../markdown/escape-interpolations-plugin')
    },
    {
      resolve: require.resolve('../markdown/highlight-plugin')
    },
    {
      resolve: require.resolve('../markdown/link-plugin')
    },
    {
      resolve: require.resolve('../markdown/task-list-plugin')
    },
    ...(markdown.plugins
      ? markdown.plugins.map(p => {
          if (typeof p === 'string') {
            p = { resolve: p }
          }
          p.resolve = resolvePackage(p.resolve, { cwd: configDir })
          return p
        })
      : [])
  ]
  plugins.forEach(plugin => {
    md.use(require(plugin.resolve), plugin.options)
  })
  page.content = md.render(page.content, env)
  page.internal.hoistedTags = env.hoistedTags
  page.attributes.excerpt = env.excerpt
}
