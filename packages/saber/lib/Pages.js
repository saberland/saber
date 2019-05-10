const path = require('path')
const hash = require('hash-sum')
const { slash } = require('saber-utils')
const { log } = require('saber-log')
const merge = require('lodash.merge')
const getPermalink = require('./utils/getPermalink')
const getPageType = require('./utils/getPageType')
const { prefixAssets } = require('./utils/assetsAttribute')

module.exports = class Database {
  constructor(api) {
    this.api = api
    this.redirectRoutes = new Map()

    api.nodes.addTransform('allPages', [
      {
        type: 'find',
        value: {
          isPage: true
        }
      }
    ])
  }

  normalizePage(page, file) {
    const { api } = this

    page = merge(
      {
        fields: {},
        isPage: true,
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
        fields: {
          slug
        },
        id: hash(file.absolute),
        absolute: absolutePath,
        relative: relativePath,
        isFile: true,
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

    // Get page fields from the page content
    if (transformer.parse) {
      transformer.parse(page)
    }

    // Transform page content
    if (page.content && transformer.transform) {
      transformer.transform(page)
    }

    // These fields depend on other fields
    // And transformers can update the fields
    // So we set them after the transformers

    if (file && parsedFileName) {
      // Read createdAt from page attribute
      // Or fallback to `page.fields.date` (Hexo compatibility)
      // Or fallback to the date in fileName
      // Or fallback to the `file.birthtime`
      page.fields.createdAt = new Date(
        page.fields.createdAt ||
          page.fields.date ||
          parsedFileName[2] ||
          file.birthtime
      )

      // Read updatedAt from page attribute
      // Or fallback to `page.fields.updated` (Hexo compatibility)
      // Or fallback to `file.mtime`
      page.fields.updatedAt = new Date(
        page.fields.updatedAt || page.fields.updated || file.mtime
      )

      page.fields.type = page.fields.type || getPageType(slash(file.relative))
    }

    page.fields.permalink =
      page.fields.permalink ||
      getPermalink(
        Object.keys(api.config.locales || {})
          .map(p => p.slice(1))
          .filter(Boolean),
        page.fields,
        typeof api.config.permalinks === 'function'
          ? api.config.permalinks(page)
          : api.config.permalinks
      )

    if (!page.id) {
      throw new Error(`A node must have an id.`)
    }

    page.fields.assets = page.fields.assets
      ? prefixAssets(page.fields.assets)
      : {}

    // Ensure this page is not saved
    // So that it will be emitted to disk later in `emitPages` hook
    page.saved = false
    return page
  }

  createPage(page, { file, normalize } = {}) {
    if (normalize !== false) {
      page = this.normalizePage(page, file)
    }

    if (page.$loki === undefined) {
      this.api.nodes.insert(page)
    } else {
      this.api.nodes.update(page)
    }
  }

  getMatchedLocalePath(permalink) {
    const localePaths = Object.keys(this.config.locales || {}).filter(
      p => p !== '/'
    )

    for (const localePath of localePaths) {
      if (localePath === permalink || permalink.startsWith(localePath)) {
        return localePath
      }
    }

    return '/'
  }

  createRedirect(_configs) {
    if (_configs) {
      const configs = [].concat(_configs)

      for (const config of configs) {
        this.redirectRoutes.set(config.fromPath, config)
      }
    }
  }
}
