// @ts-check

/**
 * Left-pad '0' to number that is smaller than 10
 * @param {number} input
 */
function padZero(input) {
  return input < 10 ? `0${input}` : input
}

// Default:
// about.md => /about.html
// about/index.md => /about
// index.md => /

/**
 * Get the permalink of a page
 * @param {string[]} localeNames
 * @param {object} page - Page object
 * @param {string} page.slug - The page slug
 * @param {string} page.type - The page type
 * @param {Date=}  page.createdAt - The creation time
 * @param {any} permalinks - The `permalinks` config option
 */
module.exports = (localeNames, page, permalinks) => {
  if (page.slug === 'index') return '/'

  permalinks = Object.assign(
    {
      page: '/:slug.html',
      post: '/posts/:slug.html'
    },
    permalinks
  )

  const permalinkTemplate = permalinks[page.type] || permalinks.page
  const date = page.createdAt && new Date(page.createdAt)

  let prefix = ''
  let { slug } = page
  for (const localeName of localeNames) {
    const RE = new RegExp(`^${localeName}(/|$)`)
    if (RE.test(slug)) {
      slug = slug.replace(RE, '')
      prefix = `/${localeName}`
    }
  }

  let result = `${prefix}${permalinkTemplate}`

  if (date) {
    result = result
      .replace(/:year/, () => `${date.getFullYear()}`)
      .replace(/:month/, () => `${padZero(date.getMonth() + 1)}`)
      .replace(/:i_month/, () => `${date.getMonth() + 1}`)
      .replace(/:day/, () => `${padZero(date.getDate())}`)
      .replace(/:i_day/, () => `${date.getDate()}`)
  }

  return result
    .replace(/:slug/, slug)
    .replace(/^\/index(\.html)?$/, '/')
    .replace(/\/index(\.html)?$/, '')
}
