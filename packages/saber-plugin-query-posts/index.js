const path = require('path')

const ID = 'query-posts'

exports.name = ID

exports.apply = (api, options = {}) => {
  api.hooks.onCreatePages.tap(ID, () => {
    injectPosts({
      injectPostsTo:
        options.injectPostsTo === undefined ? ['/'] : options.injectPostsTo,
      tagsMap: options.tagsMap || {}
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
        const pagePublicFields = api.source.pages.getPagePublicFields(page)
        allPosts.add(pagePublicFields)
        const tags = [].concat(page.attributes.tags || [])
        if (tags.length > 0) {
          for (const tag of tags) {
            const tagId = tagsMap[tag] || tag
            const posts = allTagPosts.get(tagId) || new Set()
            posts.add(pagePublicFields)
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
                  // So that this page will be removed before next `onCreatePages` hook in watch mode
                  parent: true
                }
              }
            ]),
        tagPosts,
        {
          tag: getTagName(tag, tagsMap)
        }
      )
    }

    function injectToPages(pages, posts, pageProp) {
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
            api.source.pages.extendPageProp(
              newPage.internal.id,
              Object.assign(
                {
                  posts,
                  pagination: {
                    hasPrev: index !== totalPages - 1,
                    hasNext: index !== 0,
                    total: totalPages,
                    current: index + 1,
                    prevLink: getPaginationLink(
                      index + 2,
                      page.attributes.permalink
                    ),
                    nextLink: getPaginationLink(
                      index,
                      page.attributes.permalink
                    )
                  }
                },
                pageProp
              )
            )
          }
        }
      }
    }
  }

  function paginate(arr) {
    const opts = { perPage: options.perPage || 30 }
    const totalPages = Math.ceil(arr.length / opts.perPage)
    const result = []
    for (let i = 0; i < totalPages; i++) {
      result[i] = arr.slice(i * opts.perPage, (i + 1) * opts.perPage)
    }
    return result
  }

  function getPaginationLink(pageIndex, permalink) {
    if (pageIndex === 1) {
      return permalink
    }
    if (pageIndex === 0) {
      return
    }
    return path.join(permalink, `page/${pageIndex}`)
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
