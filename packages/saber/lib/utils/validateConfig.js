const { struct } = require('superstruct')

module.exports = config => {
  const siteConfig = struct.interface(
    {
      title: 'string?',
      description: 'string?',
      feed: 'boolean?'
    },
    {}
  )

  // Type of Saber plugins
  const plugins = struct.union(
    [
      ['string'],
      [
        {
          resolve: 'string',
          options: 'object?'
        }
      ]
    ],
    []
  )

  const markdown = struct(
    {
      slugify: 'string?',
      options: 'object?',
      highlighter: 'string?',
      // Same as the type of Saber plugins
      plugins
    },
    {
      plugins: []
    }
  )

  const themeConfig = struct.interface({}, {})

  const permalinks = struct.union(['object', 'function'], {})

  const server = struct(
    {
      host: 'string?',
      port: 'number?',
      ssr: 'boolean?'
    },
    {
      host: '0.0.0.0',
      port: 3000
    }
  )

  const schema = struct({
    siteConfig,
    themeConfig,
    theme: 'string?',
    plugins,
    markdown,
    permalinks,
    server
  })

  const [err, result] = schema.validate(config)

  if (err) {
    throw err
  }

  return result
}
