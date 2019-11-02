const qs = require('querystring')

module.exports = function(source) {
  const pageId =
    this.resourceQuery && qs.parse(this.resourceQuery.slice(1)).saberPage

  if (!pageId) return source

  const { getPageById, getTransformerByContentType, resolveCache } = this.query
  const page = Object.assign({}, getPageById(pageId))

  this.addDependency(resolveCache(`pages/${pageId}.saberpage`))

  const transformer = getTransformerByContentType(page.contentType)

  return `
  ${transformer.getPageComponent(page)}

  <page-prop>${pageId}</page-prop>

  ${page.internal.hoistedTags ? page.internal.hoistedTags.join('\n') : ''}
  `
}
