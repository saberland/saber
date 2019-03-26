const path = require('path')
const qs = require('querystring')

module.exports = function(source) {
  const endsWithSaberPage = this.resourcePath.endsWith('.saberpage')
  const pageId = endsWithSaberPage
    ? path.basename(this.resourcePath, path.extname(this.resourcePath))
    : this.resourceQuery && qs.parse(this.resourceQuery.slice(1)).saberPage

  if (!pageId) return source

  const { api } = this.query
  const page = Object.assign({}, api.pages.get(pageId))

  this.addDependency(api.resolveCache(`pages/${pageId}.saberpage`))

  const transformer = api.transformers.get(page.contentType)

  return `
  ${transformer.getPageComponent(page)}

  <page-prop>${JSON.stringify(api.pages.getPageProp(pageId))}</page-prop>

  ${page.internal.hoistedTags ? page.internal.hoistedTags.join('\n') : ''}
  `
}
