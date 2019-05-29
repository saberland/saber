// @ts-check
const { struct } = require('superstruct')

/**
 * Validate saber config
 * @param {any} config
 * @param {object} options
 * @param {boolean} options.dev
 */
module.exports = (config, { dev }) => {
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
      headings: 'object?',
      highlighter: 'string?',
      lineNumbers: 'boolean?',
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
      lazy: 'boolean?',
      outDir: 'string?'
    },
    {
      publicUrl: '/',
      extractCSS: false,
      loaderOptions: {},
      cssSourceMap: false,
      lazy: false,
      outDir: 'public'
    }
  )

  const locales = struct('object?')

  const schema = struct({
    build,
    siteConfig,
    themeConfig,
    locales,
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

  if (dev) {
    // Always use  / in dev mode
    result.build.publicUrl = '/'
  } else {
    // Ensure that build.publicUrl ends with slash
    result.build.publicUrl = result.build.publicUrl.replace(/\/?$/, '/')
  }

  return result
}
