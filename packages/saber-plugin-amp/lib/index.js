const path = require('path')

const ID = 'amp'

exports.name = ID

exports.apply = api => {
  api.hooks.afterExportPage.tapPromise(ID, async (context, exportedPage) => {
    if (context.amp) {
      const { log } = api
      const { fs } = api.utils
      const outputDir = api.resolveCache('public')

      context.documentData = api.getDocumentData(context)
      context.documentData.htmlAttrs += ' amp'
      context.documentData.link += `<link rel="canonical" href="${
        context.url
      }">`
      context.documentData.style =
        context.documentData.style.replace('<style', '<style amp-custom') +
        `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>`
      context.documentData.noscript += `<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`
      context.documentData.headScript += `<script async src="https://cdn.ampproject.org/v0.js"></script>`
      // amp-script is experimental for now
      // this should change when it becomes available for production
      context.documentData.bodyScript = ``

      const html = `<!DOCTYPE html>${api.getDocument(context.documentData)}`
        .replace(/^\s+/gm, '')
        .replace(/\n+</g, '<')
        .replace('<div id="_saber"></div>', exportedPage.markup)

      const outputFilePath = exportedPage.path.replace('.html', '.amp.html')
      log.info('Generating', path.relative(outputDir, outputFilePath))
      await fs.outputFile(outputFilePath, html, 'utf8')
    }
  })
}
