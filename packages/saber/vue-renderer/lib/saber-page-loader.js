const qs = require('querystring')

module.exports = function(source) {
  const pageId =
    this.resourceQuery && qs.parse(this.resourceQuery.slice(1)).saberPage

  if (!pageId) return source

  const { api } = this.query
  const page = Object.assign({}, api.pages.get(pageId))

  this.addDependency(api.resolveCache(`pages/${pageId}.saberpage`))

  const transformer = api.transformers.get(page.contentType)

  return `
  ${transformer.getPageComponent(page)}

  <page-prop>${pageId}</page-prop>

  ${page.internal.hoistedTags ? page.internal.hoistedTags.join('\n') : ''}
  `
}
