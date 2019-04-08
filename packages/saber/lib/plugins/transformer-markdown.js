const MarkdownChain = require('../markdown-chain')
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
    filePath: page.internal.absolute,
    pagesDir: api.resolveCwd('pages'),
    setAttribute(name, value) {
      page.attributes[name] = value
    },
    getAttribute(name) {
      return page.attributes[name]
    },
    setInternal(name, value) {
      page.internal[name] = value
    },
    getInternal(name) {
      return page.internal[name]
    }
  }

  const chain = new MarkdownChain()

  chain.options.merge(
    Object.assign(
      {
        html: true,
        linkify: true,
        highlight: markdown.highlighter
      },
      markdown.options
    )
  )

  const pluginList = [
    {
      name: 'hoist-tags',
      resolve: require.resolve('../markdown/hoist-tags-plugin')
    },
    {
      name: 'anchor',
      resolve: require.resolve('../markdown/anchor-plugin'),
      options: markdown.slugify && {
        slugify: require(resolvePackage(markdown.slugify, { cwd: configDir }))
      }
    },
    {
      name: 'excerpt',
      resolve: require.resolve('../markdown/excerpt-plugin')
    },
    {
      name: 'escape-interpolations',
      resolve: require.resolve('../markdown/escape-interpolations-plugin')
    },
    {
      name: 'highlight',
      resolve: require.resolve('../markdown/highlight-plugin')
    },
    {
      name: 'link',
      resolve: require.resolve('../markdown/link-plugin')
    },
    {
      name: 'task-list',
      resolve: require.resolve('../markdown/task-list-plugin')
    },
    ...(markdown.plugins
      ? markdown.plugins.map(p => {
          if (typeof p === 'string') {
            p = { resolve: p }
          }
          p.name = p.name || p.resolve
          p.resolve = resolvePackage(p.resolve, { cwd: configDir })
          return p
        })
      : [])
  ]

  for (const plugin of pluginList) {
    chain
      .plugin(plugin.name)
      .use(
        typeof plugin.resolve === 'string'
          ? require(plugin.resolve)
          : plugin.resolve,
        Array.isArray(plugin.options) ? plugin.options : [plugin.options]
      )
  }

  api.hooks.chainMarkdown.call(chain)

  const { options, plugins } = chain.toConfig()

  if (typeof options.highlight === 'string') {
    options.highlight = require(resolvePackage(options.highlight, {
      cwd: configDir,
      prefix: 'saber-highlighter-'
    }))
  }

  const md = require('saber-markdown')(options)

  for (const plugin of plugins) {
    md.use(plugin.plugin, ...plugin.args)
  }

  page.content = md.render(page.content, env)
}
