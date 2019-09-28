module.exports = class WebpackUtils {
  constructor(api) {
    this.api = api
  }

  getCacheOptions(dir, obj) {
    return {
      cacheDirectory: this.api.resolveCache(dir),
      cacheIdentifier: obj && JSON.stringify(obj)
    }
  }

  addCacheSupport(rule, dir, obj) {
    rule
      .use('cache-loader')
      .loader(require.resolve('cache-loader'))
      .options(this.getCacheOptions(dir, obj))
  }
}
