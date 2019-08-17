const { join } = require('path')

const ID = 'local-search'

exports.name = ID

let db = {}

function getLocale(locale) {
  return db[locale]
}

exports.apply = (api, options) => {
  api.browserApi.add(join(__dirname, 'saber-browser.js'))

  const index = (options && options.index) || ['title', 'excerpt', 'permalink']
  const { fs } = api.utils

  async function generateLocale(localePath) {
    const pages = []

    await Promise.all(
      [...api.pages.values()].map(async page => {
        if (page.draft) {
          return
        }

        const matchedLocalePath = api.pages.getMatchedLocalePath(page.permalink)
        if (localePath !== matchedLocalePath) {
          return
        }

        const item = {}

        for (const element of index) {
          if (element === 'content') {
            item.content = await api.renderer.renderPageContent(page.permalink)
          } else {
            item[element] = page[element] || page.attributes[element]
          }
        }

        pages.push(item)
      })
    )

    return pages
  }

  async function generateDatabase() {
    const allLocalePaths = ['/'].concat(Object.keys(api.config.locales || {}))

    const results = await Promise.all(
      allLocalePaths.map(localePath => generateLocale(localePath))
    )

    const localDb = {}
    results.forEach((result, i) => {
      const locale = allLocalePaths[i] === '/' ? 'default' : allLocalePaths[i]
      localDb[locale] = result
    })

    return localDb
  }

  if (api.dev) {
    api.hooks.onCreatePages.tapPromise(ID, async () => {
      db = await generateDatabase()
    })

    api.hooks.onCreateServer.tap(ID, server => {
      server.get('/_saber/search/:locale.json', (req, res) => {
        const db = getLocale(req.params.locale)
        if (db) {
          res.writeHead(200, {
            'Content-Type': 'application/json'
          })
          return res.end(JSON.stringify(db))
        }

        res.statusCode = 404
        res.end()
      })
    })
  } else {
    api.hooks.afterGenerate.tapPromise(ID, async () => {
      const db = await generateDatabase()
      for (const locale of Object.keys(db)) {
        const items = db[locale]
        const path = api.resolveOutDir('_saber', 'search', `${locale}.json`)
        await fs.ensureDir(api.resolveOutDir('_saber', 'search'))
        await fs.writeJson(path, items)
      }
    })
  }
}
