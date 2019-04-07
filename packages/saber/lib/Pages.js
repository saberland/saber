const path = require('path')
const hash = require('hash-sum')
const { slash } = require('saber-utils')
const getPermalink = require('./utils/getPermalink')
const getPageType = require('./utils/getPageType')

module.exports = class Pages extends Map {
  constructor(api) {
    super()
    this.api = api
    this.pageProps = new Map()
  }

  /**
   * Parse a file object and return a page object
   * @param {*} file
   */
  parseFile(file) {
    const { api } = this

    const relativePath = slash(file.relative)
    const absolutePath = slash(file.absolute)
    // A regex parsing RFC3339 date followed by {_,-}, and ended by some characters
    const fileNameRegex = /^(((\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(T([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(\.\d+)?(Z|(\+|-)([01]\d|2[0-3]):([0-5]\d)))?)(_|-))?(.+$)/
    const parsedFileName = fileNameRegex.exec(
      relativePath
        // Remove leading _posts/
        .replace(/^_posts\//, '')
        // Remove extension
        .replace(/\.[a-z]+$/i, '')
    )
    const slug = parsedFileName[16]

    const page = {
      attributes: {
        slug
      },
      internal: {
        id: hash(absolutePath),
        absolute: absolutePath,
        relative: relativePath,
        isFile: true
      },
      contentType: api.transformers.getContentTypeByExtension(
        path.extname(relativePath).slice(1)
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

    // Read createdAt from page attribute
    // Or fallback to `page.attributes.date` (Hexo compatibility)
    // Or fallback to the date in fileName
    // Or fallback to the `file.birthtime`
    page.attributes.createdAt = new Date(
      page.attributes.createdAt ||
        page.attributes.date ||
        parsedFileName[2] ||
        file.birthtime
    )

    // Read updatedAt from page attribute
    // Or fallback to `page.attributes.updated` (Hexo compatibility)
    // Or fallback to `file.mtime`
    page.attributes.updatedAt = new Date(
      page.attributes.updatedAt || page.attributes.updated || file.mtime
    )

    page.attributes.type = page.attributes.type || getPageType(relativePath)

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
