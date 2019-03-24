/* eslint-disable camelcase */
const url = require('url')

const ID = 'generate-feed'

exports.name = ID

exports.apply = (api, { limit = 30 } = {}) => {
  const { siteConfig } = api.config
  if (!siteConfig.url) {
    throw new Error(`siteConfig.url is required for saber-plugin-generate-feed`)
  }
  const feedUrl = url.resolve(siteConfig.url, 'feed.json')

  api.hooks.afterGenerate.tapPromise(ID, async () => {
    const posts = []

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
        feed_url: feedUrl,
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

  api.hooks.defineVariables.tap(ID, variables => {
    return Object.assign(variables, {
      feed: true,
      feedURL: feedUrl
    })
  })
}
