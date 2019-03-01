// Default:
// about.md => /about.html
// about/index.md => /about
// index.md => /

module.exports = (attributes, permalinks) => {
  if (attributes.slug === 'index') return '/'

  permalinks = Object.assign(
    {
      page: '/:slug.html',
      post: '/posts/:slug.html'
    },
    permalinks
  )

  const permalinkTemplate = permalinks[attributes.type] || permalinks.page
  const date = new Date(attributes.date || attributes.createdAt)
  return permalinkTemplate
    .replace(/:slug/, attributes.slug)
    .replace(/:year/, () => date.getFullYear())
    .replace(/:month/, () => padZero(date.getMonth() + 1))
    .replace(/:i_month/, () => date.getMonth() + 1)
    .replace(/:day/, () => padZero(date.getDate()))
    .replace(/:i_day/, () => date.getDate())
    .replace(/^\/index.html$/, '/')
    .replace(/\/index\.html$/, '/')
}

function padZero(input) {
  return input < 10 ? `0${input}` : input
}
