// @ts-check
/**
 * @param {string} relative - The relative path of a file
 */
module.exports = relative => {
  if (relative.startsWith('_posts/')) {
    return 'post'
  }

  return 'page'
}
