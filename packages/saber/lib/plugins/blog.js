const path = require('path')

const ID = 'builtin:blog'

exports.name = ID

exports.apply = (api, options = {}) => {
  api.hooks.afterPlugins.tap(ID, () => {
    api.hooks.afterPages.tap(ID, () => {
      injectPosts({
        injectPostsTo:
          options.injectPostsTo === undefined ? ['/'] : options.injectPostsTo,
        tagsMap: options.tagsMap || {}
      })
    })
  })

  function injectPosts({ injectPostsTo, tagsMap }) {
    const allPosts = new Set()
    const injectPostsToPages = new Set()
    const tagsPages = new Set()
    const allTagPosts = new Map()

    for (const page of api.source.pages.values()) {
      if (page.attributes.draft) {
        continue
      }
      if (
        page.attributes.type === 'index' ||
        (injectPostsTo && injectPostsTo.includes(page.attributes.permalink))
      ) {
        injectPostsToPages.add(page)
        continue
      }
      if (page.attributes.type === 'tags') {
        tagsPages.add(page)
      } else if (page.attributes.type === 'post') {
        allPosts.add(page)
        const tags = [].concat(page.attributes.tags || [])
        if (tags.length > 0) {
          for (const tag of tags) {
            const tagId = tagsMap[tag] || tag
            const posts = allTagPosts.get(tagId) || new Set()
            posts.add(page)
            allTagPosts.set(tagId, posts)
          }
        }
      }
    }

    // Add index pages
    injectToPages(
      injectPostsToPages.size > 0
        ? injectPostsToPages
        : new Set([
            {
              attributes: {
                type: 'index',
                layout: 'index',
                permalink: '/',
                slug: 'index'
              },
              internal: {
                id: 'internal_blog__index',
                parent: true
              }
            }
          ]),
      allPosts
    )

    // Add tags pages
    for (const [tag, tagPosts] of allTagPosts.entries()) {
      injectToPages(
        tagsPages.size > 0
          ? tagsPages
          : new Set([
              {
                attributes: {
                  type: 'tags',
                  layout: 'tags',
                  permalink: `/tags/${tag}`,
                  slug: tag
                },
                internal: {
                  id: `internal_blog__tags__${tag}`,
                  // So that this page will be removed before next `afterPages` hook in watch mode
                  parent: true
                },
                tag: getTagName(tag, tagsMap)
              }
            ]),
        tagPosts
      )
    }

    function injectToPages(pages, posts) {
      if (pages.size > 0) {
        const paginatedPosts = paginate(
          [...posts].sort((a, b) => {
            const aDate = new Date(a.attributes.date || a.attributes.createdAt)
            const bDate = new Date(b.attributes.date || b.attributes.createdAt)
            return aDate > bDate ? -1 : 1
          })
        )
        const totalPages = paginatedPosts.length

        for (const page of pages) {
          for (const [index, posts] of paginatedPosts.entries()) {
            const permalink =
              index === 0
                ? page.attributes.permalink
                : path.join(page.attributes.permalink, `page/${index + 1}`)
            const newPage = Object.assign({}, page, {
              posts,
              pagination: {
                hasPrev: index !== 0,
                hasNext: index !== totalPages - 1,
                total: totalPages,
                current: index + 1,
                prevLink: getPrevLink(index + 1, page.attributes.permalink),
                nextLink: getNextLink(index + 1, page.attributes.permalink)
              },
              internal: Object.assign({}, page.internal, {
                id:
                  index === 0
                    ? page.internal.id
                    : `${page.internal.id}__page__${index}`,
                parent:
                  page.internal.parent ||
                  (index === 0 ? undefined : page.internal.id)
              }),
              attributes: Object.assign({}, page.attributes, {
                permalink
              })
            })
            api.source.pages.createPage(newPage)
          }
        }
      }
    }
  }

  function paginate(arr, opts) {
    opts = Object.assign({ perPage: 30 }, opts)
    const totalPages = Math.ceil(arr.length / opts.perPage)
    const result = []
    for (let i = 0; i < totalPages; i++) {
      result[i] = arr
        .slice(i * opts.perPage, (i + 1) * opts.perPage)
        .map(page =>
          Object.assign({}, page, { content: undefined, internal: undefined })
        )
    }
    return result
  }

  function getPrevLink(current, permalink) {
    const prev = current - 1
    if (prev < 1) return
    if (prev === 1) return permalink
    return path.join(permalink, `page/${prev}`)
  }

  function getNextLink(current, permalink) {
    const prev = current + 1
    if (prev < 1) return
    return path.join(permalink, `page/${prev}`)
  }

  function getTagName(tag, tagsMap) {
    for (const tagName of Object.keys(tagsMap)) {
      if (tagsMap[tagName] === tag) {
        return tagName
      }
    }
    return tag
  }
}
