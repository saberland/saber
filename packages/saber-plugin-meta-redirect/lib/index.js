const path = require('path')
const urlJoin = require('url-join')

const ID = 'meta-redirect'

exports.name = ID

exports.apply = api => {
  api.hooks.afterGenerate.tapPromise(ID, async () => {
    const { log } = api
    const { fs } = api.utils

    const outDir = api.resolveOutDir()

    const getFileNameFromLink = link => {
      const filename = link.endsWith('.html')
        ? link
        : link.replace(/\/?$/, '/index.html')
      return path.join(outDir, filename)
    }

    const getPageContent = toPath => {
      return `<!DOCTYPE html><meta http-equiv="refresh" content="0;url=${urlJoin(
        api.config.build.publicUrl,
        toPath
      )}" />`
    }

    const writePage = async config => {
      const fileName = getFileNameFromLink(config.fromPath)
      log.info(`Generating ${path.relative(outDir, fileName)}`)
      await fs.outputFile(fileName, getPageContent(config.toPath), 'utf8')
    }

    const configs = [...api.pages.redirectRoutes.values()]
    await Promise.all(configs.map(config => writePage(config)))
  })
}
