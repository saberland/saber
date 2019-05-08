const path = require('path')

const ID = 'amp'

exports.name = ID

exports.apply = api => {
  let exportedHTMLPage = false

  api.hooks.beforeExportPage.tapPromise(ID, async () => {
    exportedHTMLPage = false // Set is to false so that we doesn't make changes to the data in getDocumentData.tap (export a the page as page.html)
  })

  api.hooks.getDocumentData.tap(ID, (data, context) => {
    if (exportedHTMLPage) {
      data.htmlAttrs += ' amp'
      data.link += `<link rel="canonical" href="${context.url}">`
      data.style =
        data.style.replace('<style', '<style amp-custom') +
        `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>`
      data.noscript += `<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`
      data.headScript += `<script async src="https://cdn.ampproject.org/v0.js"></script>`
      // amp-script is experimental for now
      // this should change when it becomes available for production
      data.bodyScript = ``
    }
  })

  api.hooks.afterExportPage.tapPromise(ID, async (context, exportedPage) => {
    if (context.amp) {
      exportedHTMLPage = true // Set it to true so that we can make changes to the data in getDocumentData.tap
      const { log } = api
      const { fs } = api.utils
      const outputDir = api.resolveCache('public')

      context.documentData = api.getDocumentData(context) // will trigger getDocumentData.tap check packages/saber/lib/index.js line 262 in the PR
      const html = `<!DOCTYPE html>${api.getDocument(
        context.documentData,
        context
      )}`
        .replace(/^\s+/gm, '')
        .replace(/\n+</g, '<')
        .replace('<div id="_saber"></div>', exportedPage.markup)

      const outputFilePath = exportedPage.path.replace('.html', '.amp.html')
      log.info('Generating', path.relative(outputDir, outputFilePath))
      await fs.outputFile(outputFilePath, html, 'utf8')
    }
  })
}
