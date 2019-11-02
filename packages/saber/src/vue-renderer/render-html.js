const getInitialDocumentData = require('./get-initial-document-data')
const getInitialDocument = require('./get-initial-document')

module.exports = async (renderer, { url, hooks, isProd }) => {
  const context = { url }
  context.markup = await renderer.renderToString(context)

  // Get document data that is used to document string
  const documentData = hooks.getDocumentData.call(
    getInitialDocumentData(context),
    context
  )

  // Get document string
  let document = hooks.getDocument.call(
    getInitialDocument(documentData),
    context
  )

  if (isProd) {
    // Remove whitespaces
    document = document.replace(/^\s+/gm, '').replace(/\n+</g, '<')
  }

  return {
    html: `<!DOCTYPE html>${document}`.replace(
      '<div id="_saber"></div>',
      context.markup
    ),
    context
  }
}
