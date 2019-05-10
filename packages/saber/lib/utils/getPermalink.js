// @ts-check

// Default:
// about.md => /about.html
// about/index.md => /about
// index.md => /

/**
 * Get the permalink of a page
 * @param {string[]} localeNames
 * @param {object} fields - Node fields
 * @param {string} fields.slug - The page slug
 * @param {string} fields.type - The page type
 * @param {Date}  fields.createdAt - The creation time
 * @param {import('saber').Permalinks} permalinks - The `permalinks` config option
 */
module.exports = (localeNames, fields, permalinks) => {
  if (fields.slug === 'index') return '/'

  permalinks = Object.assign(
    {
      page: '/:slug.html',
      post: '/posts/:slug.html'
    },
    permalinks
  )

  const permalinkTemplate = permalinks[fields.type] || permalinks.page
  const date = new Date(fields.createdAt)

  let prefix = ''
  let { slug } = fields
  for (const localeName of localeNames) {
    const RE = new RegExp(`^${localeName}(/|$)`)
    if (RE.test(slug)) {
      slug = slug.replace(RE, '')
      prefix = `/${localeName}`
    }
  }

  return `${prefix}${permalinkTemplate}`
    .replace(/:slug/, slug)
    .replace(/:year/, () => `${date.getFullYear()}`)
    .replace(/:month/, () => `${padZero(date.getMonth() + 1)}`)
    .replace(/:i_month/, () => `${date.getMonth() + 1}`)
    .replace(/:day/, () => `${padZero(date.getDate())}`)
    .replace(/:i_day/, () => `${date.getDate()}`)
    .replace(/^\/index.html$/, '/')
    .replace(/\/index\.html$/, '/')
}

/**
 * Left-pad '0' to number that is smaller than 10
 * @param {number} input
 */
function padZero(input) {
  return input < 10 ? `0${input}` : input
}
