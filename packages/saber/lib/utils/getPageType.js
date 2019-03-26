// @ts-check
/**
 * @param {string} relative - The relative path of a file
 * @param {string} slug - The page slug
 */
module.exports = (relative, slug) => {
  if (relative.startsWith('_posts/')) {
    return 'post'
  }

  if (slug === 'index') {
    return 'index'
  }

  return 'page'
}
