const path = require('path')
const { fs, glob } = require('saber-utils')
const chokidar = require('chokidar')
const { log, colors } = require('saber-log')
const hash = require('hash-sum')

const ID = 'builtin:source-pages'

exports.name = ID

exports.apply = api => {
  api.hooks.beforeRun.tapPromise(ID, async () => {
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
            log.verbose(`Found page`, colors.dim(file.absolute))
            return file
          })
      )
    )

    api.hooks.manipulatePage.tapPromise(
      'manipulate-page',
      async ({ action, id, page }) => {
        // Remove all child pages
        api.pages.removeWhere(page => page.internal.parent)

        if (action === 'remove') {
          // Remove itself
          api.pages.removeWhere(page => {
            return page.internal.id === id
          })
        } else if (action) {
          api.pages.createPage(page, { normalize: false })
          await api.hooks.onCreatePage.promise(page)
        }
      }
    )

    // Write all pages
    // This is triggered by all file actions: change, add, remove
    api.hooks.emitPages.tapPromise('pages', async () => {
      const pages = [...api.pages.values()]
      log.verbose('Emitting pages')
      // TODO: maybe write pages with limited concurrency?
      await Promise.all(
        pages.map(async page => {
          if (page.internal.saved) return

          const newContentHash = hash({
            page,
            prop: api.pages.pageProps.get(page.internal.id)
          })
          const outPath = api.resolveCache(
            'pages',
            `${page.internal.id}.saberpage`
          )
          // TODO: is there any better solution to checking if we need to write the page?
          const exists = await fs.pathExists(outPath)
          if (exists) {
            const contentHash = await fs.readFile(outPath, 'utf8')
            if (contentHash === newContentHash) {
              // Skip if content doesn't change
              return
            }
          }

          log.verbose(`Emitting page ${outPath}`)
          await fs.outputFile(outPath, newContentHash, 'utf8')
          page.internal.saved = true
        })
      )
    })

    await api.hooks.initPages.promise()

    await Promise.all(
      files.map(async file => {
        const page = api.pages.normalizePage({}, file)
        api.pages.createPage(page, { normalize: false })
        await api.hooks.onCreatePage.promise(page)
      })
    )

    await api.hooks.onCreatePages.promise()
    await api.hooks.emitPages.promise()

    if (api.dev) {
      const watcher = chokidar.watch(filePatterns, {
        cwd: pagesDir,
        ignoreInitial: true
      })
      const handler = type => async filename => {
        const filepath = path.join(pagesDir, filename)

        if (type === 'remove') {
          await api.hooks.manipulatePage.promise({
            action: 'remove',
            id: hash(filepath)
          })
        } else {
          const file = await fs.stat(filepath)
          file.relative = filename
          file.absolute = filepath
          file.content = await fs.readFile(file.absolute, 'utf8')
          const page = api.pages.normalizePage({}, file)
          await api.hooks.manipulatePage.promise({ action: 'create', page })
        }

        await api.hooks.onCreatePages.promise()
        await api.hooks.emitPages.promise()
        await api.hooks.emitRoutes.promise()
      }

      watcher.on('add', handler('add'))
      watcher.on('unlink', handler('remove'))
      watcher.on('change', handler('change'))
    }
  })
}
