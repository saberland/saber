import urlJoin from 'url-join'
import { SaberPlugin } from '../../types'
import { getPaginationLink, orderBy, paginateArray } from './utils'

const ID = 'builtin:paginate'

const plugin: SaberPlugin = {
  name: ID,

  apply(api) {
    const date = new Date()

    api.hooks.afterPlugins.tap(ID, () => {
      api.hooks.onCreatePages.tap(ID, () => {
        for (const page of api.pages.values()) {
          if (!page.paginate || page.internal.parent) {
            continue
          }
          const data = page[page.paginate.dataKey]
          const paginatedData = paginateArray(
            orderBy(data, page.paginate.orderBy, page.paginate.order),
            {
              perPage: page.paginate.perPage,
              first: page.paginate.first
            }
          )
          const totalPages = paginatedData.length

          for (const [index, items] of paginatedData.entries()) {
            const permalink =
              index === 0
                ? page.permalink
                : urlJoin(page.permalink, `page/${index + 1}`)
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
              permalink,
              createdAt: page.createdAt || date,
              updatedAt: page.updatedAt || date,
              [page.paginate.dataKey]: items,
              paginator: {
                hasPrev: index !== totalPages - 1,
                hasNext: index !== 0,
                total: totalPages,
                current: index + 1,
                prevLink: getPaginationLink(index + 2, page.permalink),
                nextLink: getPaginationLink(index, page.permalink)
              }
            })
            api.pages.createPage(newPage)
          }
        }
      })
    })
  }
}

export default plugin
