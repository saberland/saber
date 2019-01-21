const path = require('path')
const hash = require('hash-sum')
const getPermalink = require('./utils/getPermalink')
const getPageType = require('./utils/getPageType')

class Pages extends Map {
  createPage(page) {
    if (!page.internal || !page.internal.id) {
      throw new Error(`Page must have an internal id.`)
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
}

module.exports = class Source {
  constructor(api) {
    this.api = api
    this.pages = new Pages()
  }

  getPageFromFile(file) {
    const { api } = this
    const page = {
      attributes: {
        slug: file.relative
          // Remove leading _posts/
          .replace(/^_posts\//, '')
          // Remove extension
          .replace(/\.[a-z]+$/i, ''),
        createdAt: file.birthtime,
        updatedAt: file.mtime
      },
      internal: {
        id: hash(file.absolute),
        type: path.extname(file.relative).slice(1),
        file: file.absolute
      }
    }

    const transform = api.getTransformer(file)
    transform(page, file)

    page.attributes.type = getPageType(file, page)
    page.attributes.permalink = getPermalink(page, api.config.permalinks)

    return page
  }
}
