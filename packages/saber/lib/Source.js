const path = require('path')
const hash = require('hash-sum')
const getPermalink = require('./utils/getPermalink')
const getPageType = require('./utils/getPageType')

class Pages extends Map {
  createPage(page) {
    if (!page.internal || !page.internal.id) {
      throw new Error(`Page must have an internal id.`)
    }
    // Ensure this page is not saved
    // So that it will be emitted to disk later in `emitPages` hook
    page.internal.saved = false
    this.set(page.internal.id, page)
  }

  removeWhere(getCondition) {
    for (const page of this.values()) {
      const condition = getCondition(page)
      if (condition) {
        this.delete(page.internal.id)
      }
    }
  }

  getByAbsolutePath(absolute) {
    const id = hash(absolute)
    return this.get(id)
  }
}

module.exports = class Source {
  constructor(api) {
    this.api = api
    this.pages = new Pages()
  }

  getPage(file) {
    const { api } = this
    const slug = file.relative
      // Remove leading _posts/
      .replace(/^_posts\//, '')
      // Remove extension
      .replace(/\.[a-z]+$/i, '')

    const page = {
      attributes: {
        slug,
        updatedAt: file.mtime
      },
      internal: {
        id: hash(file.absolute),
        absolute: file.absolute,
        relative: file.relative,
        isFile: true
      },
      contentType: api.transformers.getContentTypeByExtension(
        path.extname(file.relative).slice(1)
      ),
      content: file.content
    }

    const transformer = api.transformers.get(page.contentType)
    transformer.transform(page)

    // These attributes depend on other attributes
    // And transformers can update the attributes
    // So we set them after the transformers
    page.attributes.createdAt = new Date(
      page.attributes.createdAt || page.attributes.date || file.birthtime
    )

    page.attributes.type =
      page.attributes.type || getPageType(file.relative, page.attributes.slug)

    page.attributes.permalink =
      page.attributes.permalink ||
      getPermalink(
        page.attributes,
        typeof api.config.permalinks === 'function'
          ? api.config.permalinks(page)
          : api.config.permalinks
      )

    return page
  }
}
