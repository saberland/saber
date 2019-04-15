const path = require('path')
const urlJoin = require('url-join')

const ID = 'netlify-redirect'

exports.name = ID

exports.apply = api => {
  api.hooks.afterGenerate.tapPromise(ID, async () => {
    const { log } = api
    /** @type {{fs: import('fs-extra') }} */
    const { fs } = api.utils

    const outDir = api.resolveCache('public')

    const getRoute = link => urlJoin(api.config.build.publicUrl, link)

    const getPageContent = (htmlRedirectRoutes, createRedirectRoutes) => {
      let newContent = ''
      htmlRedirectRoutes.forEach(route => {
        route = getRoute(route)
        newContent += `${route.replace('.html', '')} ${route} \n`
      })
      createRedirectRoutes.forEach(config => {
        newContent += `${config.fromPath} ${config.toPath} \n`
      })
      return newContent
    }

    const generateRedirects = async links => {
      const redirectFilePath = path.join(outDir, '_redirects')
      const content = getPageContent(links, [
        ...api.pages.redirectRoutes.values()
      ])
      if (await fs.pathExists(redirectFilePath)) {
        log.info(`Generating _redirects (append)`)
        await fs.appendFile(redirectFilePath, content, 'utf8')
      } else {
        log.info(`Generating _redirects`)
        await fs.outputFile(redirectFilePath, content, 'utf8')
      }
    }

    const routes = [...api.pages.values()].map(
      page => page.attributes.permalink
    )
    const filteredRoutes = routes.filter(
      x =>
        !x.endsWith('/') &&
        routes.every(a => {
          if (a === x || a === '/') {
            return true
          }
          if (a.length > x.length) {
            return a.indexOf(x.replace('.html', '')) !== 0
          }
          return true
        })
    )

    await generateRedirects(filteredRoutes)
  })
}
