// @ts-check
const { struct } = require('superstruct')

/**
 * Validate saber config
 * @param {any} config
 */
module.exports = config => {
  const siteConfig = struct.interface(
    {
      title: 'string?',
      description: 'string?'
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
      port: 'number?'
    },
    {
      host: '0.0.0.0',
      port: 3000
    }
  )

  const build = struct(
    {
      publicUrl: 'string?',
      extractCSS: 'boolean?',
      loaderOptions: 'object?',
      cssSourceMap: 'boolean?',
      lazy: 'boolean?'
    },
    {
      publicUrl: '/',
      extractCSS: false,
      loaderOptions: {},
      cssSourceMap: false,
      lazy: false
    }
  )

  const schema = struct({
    build,
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

  // Ensure that build.publicUrl ends with slash
  result.build.publicUrl = result.build.publicUrl.replace(/\/?$/, '/')

  return result
}
