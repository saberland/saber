module.exports = function(source, map) {
  if (
    this.resourcePath.endsWith('.vue') &&
    /\?vue&type=template/.test(this.resourceQuery)
  ) {
    // Transform <template lang="pug"> in .vue files
    return require('pug-plain-loader').call(this, source, map)
  }

  return source
}
