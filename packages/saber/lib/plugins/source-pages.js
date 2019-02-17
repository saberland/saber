const path = require('path')
const { fs, glob } = require('saber-utils')
const chokidar = require('chokidar')
const { log } = require('saber-log')
const hash = require('hash-sum')

const ID = 'builtin:source-pages'

exports.name = ID

exports.apply = api => {
  api.hooks.beforeRun.tapPromise(ID, async ({ watch }) => {
    const pagesDir = api.resolveCwd('pages')
    const exts = api.transformers.supportedExtensions
    const filePatterns = [
      `**/*.${exts.length === 1 ? exts[0] : `{${exts.join(',')}}`}`,
      '!**/{node_modules,dist,vendor}/**',
      '!**/_!(posts)/**'
    ]

    const files = await glob(filePatterns, {
      cwd: pagesDir,
      dot: false,
      stats: true
    }).then(files =>
      Promise.all(
        files
          .sort((a, b) => (a.path > b.path ? 1 : -1))
          .map(async file => {
            file.relative = file.path
            file.absolute = path.join(pagesDir, file.relative)
            file.content = await fs.readFile(file.absolute, 'utf8')
            log.debug(`Found page`, file.absolute)
            return file
          })
      )
    )

    api.hooks.createPage.tap('create-page', page => {
      api.source.pages.createPage(page)
      api.hooks.onCreatePage.call(page)
    })

    api.hooks.manipulatePage.tap('manipulate-page', ({ action, id, page }) => {
      // Remove all child pages
      api.source.pages.removeWhere(page => page.internal.parent)

      if (action === 'remove') {
        // Remove itself
        api.source.pages.removeWhere(page => {
          return page.internal.id === id
        })
      } else if (action) {
        api.hooks.createPage.call(page)
      }
    })

    // Write all pages
    // This is triggered by all file actions: change, add, remove
    api.hooks.emitPages.tapPromise('pages', async () => {
      const pages = [...api.source.pages.values()]
      log.debug('Emitting pages')
      await Promise.all(
        pages.map(async page => {
          if (page.internal.saved) return

          const outPath = api.resolveCache(
            'pages',
            `${page.internal.id}.saberpage`
          )
          log.debug(`Emitting page ${outPath}`)
          page.internal.saved = true
          await fs.outputFile(outPath, JSON.stringify(page), 'utf8')
        })
      )
    })

    await api.hooks.initPages.promise()

    for (const file of files) {
      const page = api.source.getPage(file)
      api.hooks.createPage.call(page)
    }

    await api.hooks.afterPages.promise()
    await api.hooks.emitPages.promise()

    if (watch) {
      const watcher = chokidar.watch(filePatterns, {
        cwd: pagesDir,
        ignoreInitial: true
      })
      const handler = type => async filename => {
        const filepath = path.join(pagesDir, filename)

        if (type === 'remove') {
          api.hooks.manipulatePage.call({
            action: 'remove',
            id: hash(filepath)
          })
        } else {
          const file = await fs.stat(filepath)
          file.relative = filename
          file.absolute = filepath
          file.content = await fs.readFile(file.absolute, 'utf8')
          const page = api.source.getPage(file)
          api.hooks.manipulatePage.call({ action: 'create', page })
        }

        await api.hooks.afterPages.promise()
        await api.hooks.emitPages.promise()
        await api.hooks.emitRoutes.promise()
      }
      watcher.on('add', handler('add'))
      watcher.on('unlink', handler('remove'))
      watcher.on('change', handler('change'))
    }
  })
}
