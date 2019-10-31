import path from 'path'
import { Rule } from 'webpack-chain'

export class WebpackUtils {
  api: TODO

  constructor(api: TODO) {
    this.api = api
  }

  get shouldCache() {
    return this.api.config.build.cache !== false
  }

  getCacheOptions(loader: string, obj: object) {
    return this.shouldCache
      ? {
          cacheDirectory: this.api.resolveCache(path.join('cache', loader)),
          cacheIdentifier:
            obj && JSON.stringify(typeof obj === 'function' ? obj() : obj)
        }
      : {}
  }

  addCacheSupport(rule: Rule, loader: string, obj: object) {
    if (this.shouldCache) {
      rule
        .use('cache-loader')
        .loader(require.resolve('cache-loader'))
        .options(this.getCacheOptions(loader, obj))
    }
  }
}
