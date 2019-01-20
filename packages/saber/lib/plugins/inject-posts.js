/**
 * Inject posts to `index` `categories` `tags` pages
 * NEEDS REFACTOR ASAP! WELP WELP WELP!
 */

const path = require('path')

const ID = 'builtin:inject-posts'

exports.name = ID

exports.apply = api => {
  // We just rebuild extra pages whenever the pages collection gets updated for now
  api.hooks.afterPages.tap(ID, () => {
    const indexPages = new Set()
    const allPosts = new Set()
    const postsByAttribute = {
      categories: new Map(),
      tags: new Map()
    }
    for (const page of api.source.pages.values()) {
      if (page.attributes.published === false) {
        continue
      }
      if (page.attributes.type === 'index') {
        indexPages.add(page)
      } else if (page.attributes.type === 'post') {
        allPosts.add(page)
        for (const attr of Object.keys(postsByAttribute)) {
          if (Array.isArray(page.attributes[attr])) {
            for (const value of page.attributes[attr]) {
              let posts = postsByAttribute[attr].get(value)
              if (!posts) {
                posts = new Set()
                postsByAttribute[attr].set(value, posts)
              }
              posts.add(page)
            }
          }
        }
      }
    }

    const getPrevLink = (current, permalink) => {
      const prev = current - 1
      if (prev < 1) return
      if (prev === 1) return permalink
      return path.join(permalink, `page/${prev}`)
    }

    const getNextLink = (current, permalink) => {
      const prev = current + 1
      if (prev < 1) return
      return path.join(permalink, `page/${prev}`)
    }

    const sortedPosts = [...allPosts].sort((a, b) => {
      const aDate = new Date(a.attributes.date || a.attributes.createdAt)
      const bDate = new Date(b.attributes.date || b.attributes.createdAt)
      return aDate > bDate ? -1 : 1
    })
    for (const page of indexPages) {
      const [firstPosts, ...rest] = paginate(sortedPosts)
      const totalPages = rest.length + 1
      page.posts = firstPosts
      page.pagination = {
        hasPrev: false,
        hasNext: rest.length > 0,
        totalPages: totalPages,
        current: 1,
        prevLink: getPrevLink(1, page.attributes.permalink),
        nextLink: getNextLink(1, page.attributes.permalink)
      }
      api.source.pages.createPage(page)
      for (const [index, posts] of rest.entries()) {
        const permalink = path.join(page.attributes.permalink, `page/${index + 2}`)
        const subPage = Object.assign({}, page, {
          posts,
          pagination: {
            hasPrev: true,
            hasNext: index !== rest.length - 1,
            totalPages: totalPages,
            current: index + 2,
            prevLink: getPrevLink(index + 2, page.attributes.permalink),
            nextLink: getNextLink(index + 2, page.attributes.permalink)
          },
          attributes: Object.assign({}, page.attributes, {
            permalink
          }),
          internal: {
            id: `${page.internal.id}__${index}`,
            parent: page.internal.id,
          }
        })
        api.source.pages.createPage(subPage)
      }
    }
  })
}

function paginate(arr, opts) {
  opts = Object.assign({ perPage: 30 }, opts)
  const totalPages = Math.ceil(arr.length / opts.perPage)
  const result = []
  for (let i = 0; i < totalPages; i++) {
    result[i] = arr.slice(i * opts.perPage, (i + 1) * opts.perPage)
  }
  return result
}
