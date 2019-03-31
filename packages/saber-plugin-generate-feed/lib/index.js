/* eslint-disable camelcase */
const urljoin = require('url-join')
const Feed = require('feed').Feed

const ID = 'generate-feed'

exports.name = ID

exports.apply = (api, options = {}) => {
  // Plugin options
  options = Object.assign({
    limit: 30,
    generator: 'Feed for Saberjs',
    copyright: 'All rights reserved'
  }, options)

  const { siteConfig } = api.config
  if (!siteConfig.url) {
    throw new Error(`siteConfig.url is required for saber-plugin-generate-feed`)
  }

  // All type of feed links
  const feedLinks = options.feeds
    ? options.feeds
    : {
      json: urljoin(siteConfig.url, 'feed.json'),
      atom: urljoin(siteConfig.url, 'atom.xml')
    }

  api.hooks.afterGenerate.tapPromise(ID, async () => {
    // Prepare posts
    const posts = []
    for (const page of api.pages.values()) {
      if (page.attributes.type === 'post' && !page.attributes.draft) {
        posts.push({
          title: page.attributes.title,
          id: page.attributes.permalink,
          link: urljoin(siteConfig.url, page.attributes.permalink),
          description: page.attributes.description,
          content: page.content,
          date: page.attributes.updatedAt,
          published: page.attributes.createdAt
        })
      }
    }
    // Order by published
    const items = posts
      .sort((a, b) => {
        return b.published - a.published
      })
      .slice(0, options.limit)

    // Feed instance
    const feed = new Feed({
      title: siteConfig.title,
      description: siteConfig.description,
      id: siteConfig.url,
      link: siteConfig.url,
      copyright: options.copyright,
      generator: options.generator,
      author:
        typeof siteConfig.author === 'string'
          ? {
            name: siteConfig.author
          }
          : siteConfig.author,
      feedLinks: feedLinks
    })

    // Add posts to feed
    items.forEach(post => {
      feed.addItem(post)
    })

    const { log } = api
    const { fs } = api.utils

    // JSON
    if (feedLinks.json) {
      log.info('Generating json feed')
      await fs.outputFile(
        api.resolveCwd(`.saber/public/${feedLinks.json.replace(siteConfig.url, '')}`),
        feed.json1(),
        'utf8'
      )
    }

    // Atom and RSS2 (Note: rss2 also uses atom to generate)
    if (feedLinks.atom || feedLinks.rss2) {
      log.info('Generating xml feed')
      await fs.outputFile(
        api.resolveCwd(`.saber/public/${feedLinks.atom.replace(siteConfig.url, '')}`),
        feed.atom1(),
        'utf8'
      )
    }
  })

  api.hooks.defineVariables.tap(ID, variables => {
    return Object.assign(variables, {
      feed: true,
      feedLinks: feedLinks
    })
  })
}
