// Default:
// about.md => /about.html
// about/index.md => /about
// index.md => /
const permalinks = {
  page: '/:slug.html',
  post: '/posts/:slug.html'
}

module.exports = page => {
  if (page.attributes.permalink) return page.attributes.permalink

  const permalinkTemplate = permalinks[page.attributes.type] || permalinks.page
  return permalinkTemplate
    .replace(/:slug/, page.attributes.slug)
    .replace(/^\/index.html$/, '/')
    .replace(/\/index\.html$/, '')
}
