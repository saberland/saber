const path = require('path')
const hash = require('hash-sum')
const { slash } = require('saber-utils')
const { log } = require('saber-log')
const merge = require('lodash.merge')
const getPermalink = require('./utils/getPermalink')
const getPageType = require('./utils/getPageType')
const { prefixAssets } = require('./utils/assetsAttribute')

module.exports = class Pages extends Map {
  constructor(api) {
    super()
    this.api = api
    this.redirectRoutes = new Map()
  }

  normalizePage(page, file) {
    const { api } = this

    page = merge(
      {
        internal: {},
        contentType: 'default'
      },
      page
    )

    let parsedFileName
    if (file) {
      const relativePath = slash(file.relative)
      const absolutePath = slash(file.absolute)
      // A regex parsing RFC3339 date followed by {_,-}, and ended by some characters
      const fileNameRegex = /^(((\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(T([01]\d|2[0-3]):([0-5]\d):([0-5]\d|60)(\.\d+)?(Z|(\+|-)([01]\d|2[0-3]):([0-5]\d)))?)(_|-))?(.+$)/
      parsedFileName = fileNameRegex.exec(
        relativePath
          // Remove leading _posts/
          .replace(/^_posts\//, '')
          // Remove extension
          .replace(/\.[a-z]+$/i, '')
      )
      const slug = parsedFileName[16]
      page = merge({}, page, {
        slug,
        internal: {
          id: hash(file.absolute),
          absolute: absolutePath,
          relative: relativePath,
          isFile: true
        },
        contentType: api.transformers.getContentTypeByExtension(
          path.extname(relativePath).slice(1)
        ),
        content: file.content
      })
    }

    let transformer = api.transformers.get(page.contentType)

    if (!transformer) {
      log.warn(`No transformer was found for content type: ${page.contentType}`)
      transformer = api.transformers.get('default')
    }

    // Get page attributes from the page content
    if (transformer.parse) {
      transformer.parse(page)
    }

    // Transform page content
    if (page.content && transformer.transform) {
      transformer.transform(page)
    }

    // These fields are computed from other fields
    // And transformers can update the `page`
    // So we set them after applying the transformer

    if (file && parsedFileName) {
      // Read createdAt from page attribute
      // Or fallback to `page.date` (Hexo compatibility)
      // Or fallback to the date in fileName
      // Or fallback to the `file.birthtime`
      page.createdAt = new Date(
        page.createdAt || page.date || parsedFileName[2] || file.birthtime
      )

      // Read updatedAt from page attribute
      // Or fallback to `page.updated` (Hexo compatibility)
      // Or fallback to `file.mtime`
      page.updatedAt = new Date(page.updatedAt || page.updated || file.mtime)

      page.type = page.type || getPageType(slash(file.relative))
    }

    page.permalink =
      page.permalink ||
      getPermalink(
        Object.keys(api.config.locales || {})
          .map(p => p.slice(1))
          .filter(Boolean),
        page,
        typeof api.config.permalinks === 'function'
          ? api.config.permalinks(page)
          : api.config.permalinks
      )

    if (!page.internal || !page.internal.id) {
      throw new Error(`Page must have an internal id.`)
    }

    page.assets = page.assets
      ? prefixAssets(
          page.assets,
          page.internal.absolute
            ? path.dirname(page.internal.absolute)
            : api.opts.cwd
        )
      : {}

    // Ensure this page is not saved
    // So that it will be emitted to disk later in `emitPages` hook
    page.internal.saved = false

    // Backward compatible
    // TODO: remove in 1.0
    page.attributes = page

    return page
  }

  createPage(page, { file, normalize } = {}) {
    if (normalize !== false) {
      page = this.normalizePage(page, file)
    }

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

  getPagePublicFields(page) {
    page = typeof page === 'string' ? this.get(page) : page
    if (!page) {
      return page
    }

    const res = Object.assign({}, page, {
      content: undefined,
      internal: undefined
    })
    // TODO: remove in 1.0
    res.attributes = res
    return res
  }

  createRedirect(_configs) {
    if (_configs) {
      const configs = [].concat(_configs)

      for (const config of configs) {
        this.redirectRoutes.set(config.fromPath, config)
      }
    }
  }

  getMatchedLocalePath(permalink) {
    const localePaths = Object.keys(this.api.config.locales || {}).filter(
      p => p !== '/'
    )

    for (const localePath of localePaths) {
      if (localePath === permalink || permalink.startsWith(localePath)) {
        return localePath
      }
    }

    return '/'
  }
}
