const path = require('path')
const hash = require('hash-sum')
const getPermalink = require('./utils/getPermalink')
const getPageType = require('./utils/getPageType')

class Pages extends Map {
  constructor() {
    super()
    this.pageProps = new Map()
  }

  createPage(page) {
    if (!page.internal || !page.internal.id) {
      throw new Error(`Page must have an internal id.`)
    }
    // Ensure this page is not saved
    // So that it will be emitted to disk later in `emitPages` hook
    page.internal.saved = false
    this.pageProps.set(page.internal.id, {})
    this.set(page.internal.id, page)
  }

  removeWhere(getCondition) {
    for (const page of this.values()) {
      const condition = getCondition(page)
      if (condition) {
        this.delete(page.internal.id)
        this.pageProps.delete(page.internal.id)
      }
    }
  }

  getPageProp(id) {
    return Object.assign(
      {},
      this.pageProps.get(id),
      this.getPagePublicFields(id)
    )
  }

  extendPageProp(id, page) {
    this.pageProps.set(id, Object.assign({}, this.pageProps.get(id), page))
    // Mark this page as unsaved when the page prop changes
    this.get(id).internal.saved = false
  }

  getPagePublicFields(page) {
    page = typeof page === 'string' ? this.get(page) : page
    if (!page) {
      return page
    }
    return Object.assign({}, page, { content: undefined, internal: undefined })
  }
}

module.exports = class Source {
  constructor(api) {
    this.api = api
    this.pages = new Pages()
  }

  getPage(file) {
    // A regex parsing RFC3339 date followed by {_,-}, and ended by some characters
    const pageFilenameRegex = /^(((\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|(\+|-)([01][0-9]|2[0-3]):([0-5][0-9])))?)(_|-))?(.+$)/

    const { api } = this
    const slug = pageFilenameRegex.exec(
      file.relative
      // Remove leading _posts/
      .replace(/^_posts\//, '')
      // Remove extension
      .replace(/\.[a-z]+$/i, ''))[16]

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

    // Get page attributes from the page content
    if (transformer.parse) {
      transformer.parse(page)
    }

    // Transform page content
    if (page.content && transformer.transform) {
      transformer.transform(page)
    }

    // These attributes depend on other attributes
    // And transformers can update the attributes
    // So we set them after the transformers

    // Set createdAt attribute if there is datetime in filename
    const createdAt = pageFilenameRegex.exec(
      file.relative
      // Remove leading _posts/
      .replace(/^_posts\//, '')
      // Remove extension
      .replace(/\.[a-z]+$/i, ''))[2]
    if (createdAt) {
      page.attributes.createdAt = createdAt
    }

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
