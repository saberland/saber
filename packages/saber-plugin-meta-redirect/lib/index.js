const path = require('path')

const ID = 'meta-redirect'

exports.name = ID

exports.apply = api => {
  api.hooks.afterGenerate.tapPromise(ID, async () => {
    const { log } = api
    const { fs } = api.utils

    const createPage = to => {
      return `
	    <html>
	      <head>
	        <meta http-equiv="refresh" content="0;url=${to}" />
	      </head>
	      <body>
	      </body>
	    </html>
	  `
    }

    const writePage = async (fileName, to) => {
      log.info(`Generating ${fileName}/index.html`)
      await fs.outputFile(
        path.join(api.resolveCache('public'), `${fileName}/index.html`),
        createPage(to),
        'utf8'
      )
    }

    api.redirectRoutes.forEach((to, from) => {
      writePage(from, to)
    })
  })
}
