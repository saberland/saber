const qs = require('querystring')

module.exports = function(source) {
  const { saberPage } =
    this.resourceQuery && qs.parse(this.resourceQuery.slice(1))
  const { api } = this.query

  if (!saberPage && !this.resourcePath.endsWith('.saberpage')) return source

  const page = Object.assign({}, api.source.pages.get(saberPage))
  const { internal, content } = page
  delete page.internal
  delete page.content
  this.addDependency(api.resolveCache(`pages/${internal.id}.saberpage`))

  const transformer = api.transformers.get(page.contentType)

  return transformer.getPageComponent(page, content, internal)
}
