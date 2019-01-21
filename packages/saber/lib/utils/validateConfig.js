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

  const schema = struct({
    siteConfig,
    themeConfig,
    theme: 'string?',
    plugins,
    markdown
  })

  const [err, result] = schema.validate(config)

  if (err) {
    throw err
  }

  return result
}
