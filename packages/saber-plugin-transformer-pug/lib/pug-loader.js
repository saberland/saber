module.exports = function(source) {
  if (this.resourceQuery.saberPage) {
    return source
  }

  return `export default !${slash(require.resolve('pug-plain-loader'))}!${slash(
    this.resourcePath
  )}`
}

function slash(input) {
  return input.replace(/\\/g, '/')
}
