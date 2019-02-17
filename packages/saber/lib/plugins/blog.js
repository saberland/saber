const path = require('path')

const ID = 'builtin:blog'

exports.name = ID

exports.apply = (api, options = {}) => {
  api.hooks.afterPlugins.tap(ID, () => {
    api.hooks.afterPages.tap(ID, () => {
      if (options.injectPostsTo !== false) {
        injectPosts(options.injectPostsTo || ['/'])
      }
    })
  })

  function injectPosts(routes) {
    const allPosts = new Set()
    const injectPostsTo = new Set()

    for (const page of api.source.pages.values()) {
      if (page.attributes.draft) {
        continue
      }
      if (routes.includes(page.attributes.permalink)) {
        injectPostsTo.add(page)
        continue
      }
      if (page.attributes.type === 'post') {
        allPosts.add(page)
      }
    }

    const paginatedPosts = paginate(
      [...allPosts].sort((a, b) => {
        const aDate = new Date(a.attributes.date || a.attributes.createdAt)
        const bDate = new Date(b.attributes.date || b.attributes.createdAt)
        return aDate > bDate ? -1 : 1
      })
    )
    const totalPages = paginatedPosts.length

    for (const page of injectPostsTo) {
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
            parent: index === 0 ? undefined : page.internal.id
          }),
          attributes: Object.assign({}, page.attributes, {
            permalink
          })
        })
        api.source.pages.createPage(newPage)
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
}
