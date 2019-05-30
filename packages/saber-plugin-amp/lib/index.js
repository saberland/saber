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
      context.documentData.style = context.documentData.style.replace(
        '<style',
        '<style amp-custom'
      )

      const ampStyle = `<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>`
      const ampNoScript = `<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>`
      const ampScript = `<script async src="https://cdn.ampproject.org/v0.js"></script>`
      const canonicalLink = `<link rel="canonical" href="${context.url}">`

      context.documentData.link += canonicalLink
      // Using fuzzball may be a better choice minified 63KB take 0.5s to download with 3G
      if (context.documentData.style.indexOf(ampStyle) === -1) {
        context.documentData.style += ampStyle
      }

      if (context.documentData.noscript.indexOf(ampNoScript) === -1) {
        context.documentData.noscript += ampNoScript
      }

      if (context.documentData.headScript.indexOf(ampScript) === -1) {
        context.documentData.headScript += ampScript
      }

      const AmpOptimizer = require('amp-toolbox-optimizer')
      const optimizer = AmpOptimizer.create() // no additional config required for valid AMP mode

      if (context.amp === 'hybrid') {
        // output Hybrid page
        const htmlWithScript = `<!DOCTYPE html>${api.getDocument(
          context.documentData
        )}`
          .replace(/^\s+/gm, '')
          .replace(/\n+</g, '<')
          .replace('<div id="_saber"></div>', exportedPage.markup)

        const hybridTransformedHtml = await optimizer.transformHtml(
          htmlWithScript
        )

        const outputFilePath = exportedPage.path
        log.info(
          'Generating hybrid AMP page',
          path.relative(outputDir, outputFilePath)
        )
        await fs.outputFile(outputFilePath, hybridTransformedHtml, 'utf8')
      }

      context.documentData.bodyScript = ``

      const html = `<!DOCTYPE html>${api.getDocument(context.documentData)}`
        .replace(/^\s+/gm, '')
        .replace(/\n+</g, '<')
        .replace('<div id="_saber"></div>', exportedPage.markup)

      const transformedHtml = await optimizer.transformHtml(html)

      const outputFilePath = exportedPage.path.replace(
        '.html',
        '.amp/index.html'
      )
      log.info(
        'Generating valid AMP page',
        path.relative(outputDir, outputFilePath)
      )
      await fs.outputFile(outputFilePath, transformedHtml, 'utf8')
    }
  })
}
