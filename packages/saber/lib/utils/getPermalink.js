// Default:
// about.md => /about.html
// about/index.md => /about
// index.md => /

module.exports = (page, permalinks) => {
  if (page.attributes.permalink) return page.attributes.permalink

  if (page.attributes.slug === 'index') return '/'

  if (typeof permalinks === 'function') {
    permalinks = permalinks(page)
  }

  permalinks = Object.assign(
    {
      page: '/:slug.html',
      post: '/posts/:slug.html'
    },
    permalinks
  )

  const permalinkTemplate = permalinks[page.attributes.type] || permalinks.page
  const date = new Date(page.attributes.date || page.attributes.createdAt)
  return permalinkTemplate
    .replace(/:slug/, page.attributes.slug)
    .replace(/:year/, () => date.getFullYear())
    .replace(/:month/, () => padZero(date.getMonth() + 1))
    .replace(/:i_month/, () => date.getMonth() + 1)
    .replace(/:day/, () => padZero(date.getDate()))
    .replace(/:i_day/, () => date.getDate())
    .replace(/^\/index.html$/, '/')
    .replace(/\/index\.html$/, '')
}

function padZero(input) {
  return input < 10 ? `0${input}` : input
}
