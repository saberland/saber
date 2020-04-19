import { resolve } from 'path'
import hash from 'hash-sum'
import { SaberPlugin } from '../../types'

const ID = 'builtin:inject-page-data'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    const cache: Map<string, any> = new Map()
    const dataFileDir = api.resolveCwd('data')

    const getDataFactory = (use: string) => {
      if (api.dataStore.hasData(use)) {
        const data = api.dataStore.getData(use)!
        return { isFile: false, dataFactory: data.factory }
      }
      const dataFilePath = resolve(dataFileDir, use)
      return { isFile: true, dataFactory: require(dataFilePath) }
    }

    api.hooks.afterPlugins.tap(ID, () => {
      api.hooks.onCreatePages.tapPromise(ID, async () => {
        const activeCacheKeys: Set<string> = new Set()

        for (const page of api.pages.values()) {
          if (!page.injectPageData) {
            continue
          }
          for (const injectAs of Object.keys(page.injectPageData)) {
            const config = page.injectPageData[injectAs]
            const cacheKey = `${config.use}::${
              page.internal.id
            }::${injectAs}::${hash(config)}`
            activeCacheKeys.add(cacheKey)
            if (cache.has(cacheKey)) {
              page[injectAs] = cache.get(cacheKey)
            } else {
              const { dataFactory } = getDataFactory(config.use)
              page[injectAs] = await dataFactory(config.options || {})
              cache.set(cacheKey, page[injectAs])
            }
            if (!page[injectAs]) {
              throw new Error(
                `Data "${config.use}" is not returning a JSON object, which is not allowed!`
              )
            }
          }
        }

        // Clean up outdated cache
        for (const key of cache.keys()) {
          if (!activeCacheKeys.has(key)) {
            cache.delete(key)
          }
        }
      })
    })

    if (api.dev) {
      const chokidar: typeof import('chokidar') = require('chokidar')

      const watcher = chokidar.watch(['**/*.js', '!**/_*'], {
        cwd: dataFileDir,
        ignoreInitial: true
      })

      const updateCache = async (file: string) => {
        const absolutePath = resolve(dataFileDir, file)
        delete require.cache[absolutePath]
        const dataFileName = file.replace(/\.js$/, '')
        for (const key of cache.keys()) {
          if (key.startsWith(dataFileName)) {
            cache.delete(key)
          }
        }
        try {
          // Rebuild pages
          await api.hooks.onCreatePages.promise()
          // Emit pages
          await api.hooks.emitPages.promise()
        } catch (err) {
          api.log.error(err)
        }
      }

      watcher
        .on('unlink', file => {
          updateCache(file)
        })
        .on('change', file => {
          updateCache(file)
        })
    }
  }
}

export default plugin
