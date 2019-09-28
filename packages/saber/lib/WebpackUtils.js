const path = require('path')

module.exports = class WebpackUtils {
  constructor(api) {
    this.api = api
  }

  getCacheOptions(loader, obj) {
    return {
      cacheDirectory: this.api.resolveCache(path.join('cache', loader)),
      cacheIdentifier: obj && JSON.stringify(obj)
    }
  }

  addCacheSupport(rule, loader, obj) {
    rule
      .use('cache-loader')
      .loader(require.resolve('cache-loader'))
      .options(this.getCacheOptions(loader, obj))
  }
}
