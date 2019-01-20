module.exports = (file, page) => {
  if (page.attributes.type) return page.attributes.type

  if (file.relative.startsWith('_posts/')) {
    return 'post'
  }

  if (page.attributes.slug === 'index') {
    return 'index'
  }

  return 'page'
}
