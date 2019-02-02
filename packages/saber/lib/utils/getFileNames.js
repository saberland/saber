// @ts-check
/**
 * @param {string} useHash
 */
module.exports = useHash => {
  return {
    js: useHash ? '_saber/js/[name].[chunkhash:8].js' : '_saber/js/[name].js',
    css: useHash
      ? '_saber/css/[name].[chunkhash:8].css'
      : '_saber/css/[name].css',
    font: useHash
      ? '_saber/fonts/[path][name].[hash:8].[ext]'
      : '_saber/fonts/[path][name].[ext]',
    image: useHash
      ? '_saber/images/[path][name].[hash:8].[ext]'
      : '_saber/images/[path][name].[ext]'
  }
}
