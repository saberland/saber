const path = require('path')

module.exports = class WebpackUtils {
  constructor(api) {
    this.api = api
  }

  get shouldCache() {
    return this.api.config.build.cache !== false
  }

  getCacheOptions(loader, obj) {
    return this.shouldCache
      ? {
          cacheDirectory: this.api.resolveCache(path.join('cache', loader)),
          cacheIdentifier:
            obj && JSON.stringify(typeof obj === 'function' ? obj() : obj)
        }
      : {}
  }

  addCacheSupport(rule, loader, obj) {
    if (this.shouldCache) {
      rule
        .use('cache-loader')
        .loader(require.resolve('cache-loader'))
        .options(this.getCacheOptions(loader, obj))
    }
  }
}
