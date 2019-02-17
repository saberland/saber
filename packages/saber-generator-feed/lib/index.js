/* eslint-disable camelcase */
const url = require('url')

const ID = 'generator-feed'

exports.name = ID

exports.apply = (api, { limit = 30 } = {}) => {
  api.hooks.afterGenerate.tapPromise(ID, async () => {
    const { siteConfig } = api.config
    const posts = []

    if (!siteConfig.url) {
      throw new Error(`siteConfig.url is required for saber-generator-feed`)
    }

    for (const page of api.source.pages.values()) {
      if (page.attributes.type === 'post' && !page.attributes.draft) {
        posts.push({
          title: page.attributes.title,
          id: page.attributes.permalink,
          url: url.resolve(siteConfig.url, page.attributes.permalink),
          content_html: page.content,
          date_published: new Date(page.attributes.createdAt),
          date_modified: page.attributes.updatedAt
        })
      }
    }
    const items = posts
      .sort((a, b) => {
        return a.date_published > b.date_published ? -1 : 1
      })
      .slice(0, limit)
    if (items.length > 0) {
      const feed = {
        version: 'https://jsonfeed.org/version/1',
        title: siteConfig.title,
        description: siteConfig.description,
        author:
          typeof siteConfig.author === 'string'
            ? {
                name: siteConfig.author
              }
            : siteConfig.author,
        home_page_url: siteConfig.url,
        feed_url: url.resolve(siteConfig.url, 'feed.json'),
        items
      }
      const { log } = api
      const { fs } = api.utils
      log.info(`Generating feed.json`)
      await fs.outputFile(
        api.resolveCwd('.saber/public/feed.json'),
        JSON.stringify(feed),
        'utf8'
      )
    }
  })
}
