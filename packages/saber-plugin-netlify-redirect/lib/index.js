const path = require('path')
const urlJoin = require('url-join')

const ID = 'netlify-redirect'

exports.name = ID

exports.apply = api => {
  api.hooks.afterGenerate.tapPromise(ID, async () => {
    const { log } = api
    const { fs } = api.utils

    const outputDir = api.resolveCache('public')
    const publicDir = api.resolveCwd('public')

    var oldContent = ''
    try {
      oldContent = await fs.readFile(publicDir + '/_redirects')
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
    oldContent = oldContent.toString()

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
      return oldContent + newContent
    }

    const generateRedirects = async links => {
      const _redirects = path.join(outputDir, '/_redirects')
      log.info(`Generating ${path.relative(outputDir, _redirects)}`)
      await fs.outputFile(_redirects, getPageContent(links, [...api.pages.redirectRoutes.values()]), 'utf8')
    }

    let routes = [...api.pages.values()].map(page => page.attributes.permalink)
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
