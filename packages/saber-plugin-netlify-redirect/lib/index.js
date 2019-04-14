const path = require('path')
const urlJoin = require('url-join')

const ID = 'netlify-redirect'

exports.name = ID

exports.apply = api => {
  api.hooks.afterGenerate.tapPromise(ID, async () => {
    const { log } = api
    const { fs } = api.utils

    const outputDir = api.resolveCache('public')

    const getFileNameFromLink = link => {
      const filename = link.replace('.html', '/index.html')
      return path.join(outputDir, filename)
    }

    const getPageContent = toPath => {
      return `<!DOCTYPE html><meta http-equiv="refresh" content="0;url=${urlJoin(
        api.config.build.publicUrl,
        toPath
      )}" />`
    }

    const writePage = async route => {
      const fileName = getFileNameFromLink(route)
      log.info(`Generating ${path.relative(outputDir, fileName)}`)
      await fs.outputFile(fileName, getPageContent(route), 'utf8')
    }

    const routes = [...api.pages.values()].map(
      page => page.attributes.permalink
    )
    const filteredRoutes = routes.filter(
      x =>
        !x.endsWith('/') &&
        !routes.some(
          a => a.endsWith('/') && x.split('.')[0] === a.replace(/\/$/, '')
        )
    )

    await Promise.all(filteredRoutes.map(route => writePage(route)))
  })
}
