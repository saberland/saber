const urlJoin = require('url-join')
const { paginate, getIdFromMap, getNameFromMap } = require('./utils')

const ID = 'query-posts'

exports.name = ID

exports.apply = (api, options = {}) => {
  api.hooks.onCreatePages.tap(ID, () => {
    injectPosts({
      tagsMap: options.tagsMap,
      categoriesMap: options.categoriesMap,
      paginationOptions: {
        perPage: options.perPage || 30
      },
      permalinks: Object.assign(
        {
          category: '/categories/:name',
          tag: '/tags/:name'
        },
        options.permalinks
      )
    })
  })

  function injectPosts({
    tagsMap,
    paginationOptions,
    categoriesMap,
    permalinks
  }) {
    const allPosts = new Set()
    const injectPostsToPages = new Set()
    const allTagPosts = new Map()
    const allCategoryPosts = new Map()

    tagsMap = Object.assign({}, tagsMap)
    categoriesMap = Object.assign({}, categoriesMap)

    for (const page of api.pages.values()) {
      if (page.attributes.draft) {
        continue
      }
      if (page.attributes.injectAllPosts) {
        injectPostsToPages.add(page)
        continue
      }
      if (page.attributes.type === 'post') {
        const pagePublicFields = api.pages.getPagePublicFields(page)
        allPosts.add(pagePublicFields)

        // Group posts for tag pages
        const tags = [].concat(page.attributes.tags || [])
        if (tags.length > 0) {
          for (const tag of tags) {
            const tagId = getIdFromMap(tagsMap, tag)
            const posts = allTagPosts.get(tagId) || new Set()
            posts.add(pagePublicFields)
            allTagPosts.set(tagId, posts)
          }
        }

        // Group posts for category pages
        const categories = []
          .concat(page.attributes.categories || [])
          .map(v => (Array.isArray(v) ? v : v.split('/')))

        if (categories.length > 0) {
          for (const category of categories) {
            for (const index of category.keys()) {
              const id = category
                .slice(0, index + 1)
                .map(name => getIdFromMap(categoriesMap, name))
                .join('/')
              const posts = allCategoryPosts.get(id) || new Set()
              posts.add(pagePublicFields)
              allCategoryPosts.set(id, posts)
            }
          }
        }
      }
    }

    // Add all posts to those pages
    if (injectPostsToPages.size > 0) {
      injectToPages(injectPostsToPages, allPosts)
    }

    // Add tag pages
    for (const [tag, tagPosts] of allTagPosts.entries()) {
      injectToPages(
        new Set([
          {
            attributes: {
              isTagPage: true,
              layout: 'tag',
              permalink: permalinks.tag.replace(/:name/, tag),
              slug: tag
            },
            internal: {
              id: `internal_blog__tag__${tag}`,
              // So that this page will be removed before next `onCreatePages` hook in watch mode
              parent: true
            }
          }
        ]),
        tagPosts,
        {
          tag: getNameFromMap(tagsMap, tag)
        }
      )
    }

    // Add category pages
    for (const [category, categoryPosts] of allCategoryPosts.entries()) {
      injectToPages(
        new Set([
          {
            attributes: {
              isCategoryPage: true,
              layout: 'category',
              permalink: permalinks.category.replace(/:name/, category),
              slug: category
            },
            internal: {
              id: `internal_blog__category__${category}`,
              // So that this page will be removed before next `onCreatePages` hook in watch mode
              parent: true
            }
          }
        ]),
        categoryPosts,
        {
          category: category
            .split('/')
            .map(v => getNameFromMap(categoriesMap, v))
            .join('/')
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
          }),
          paginationOptions
        )
        const totalPages = paginatedPosts.length

        for (const page of pages) {
          for (const [index, posts] of paginatedPosts.entries()) {
            const permalink =
              index === 0
                ? page.attributes.permalink
                : urlJoin(page.attributes.permalink, `page/${index + 1}`)
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
            api.pages.createPage(newPage)
            api.pages.extendPageProp(
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

  function getPaginationLink(pageIndex, permalink) {
    if (pageIndex === 1) {
      return permalink
    }
    if (pageIndex === 0) {
      return
    }
    return urlJoin(permalink, `page/${pageIndex}`)
  }
}
