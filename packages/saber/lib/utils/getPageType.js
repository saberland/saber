module.exports = (relative, slug) => {
  if (relative.startsWith('_posts/')) {
    return 'post'
  }

  if (slug === 'index') {
    return 'index'
  }

  return 'page'
}
