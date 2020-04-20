import urlJoin from 'url-join'

export function getPaginationLink(pageIndex: number, permalink: string) {
  if (pageIndex === 1) {
    return permalink
  }

  if (pageIndex === 0) {
    return
  }

  return urlJoin(permalink, `page/${pageIndex}`)
}

export function orderBy<T = any>(
  arr: T[],
  orderBy: keyof T,
  order: 'ASC' | 'DESC' = 'DESC'
) {
  return arr.sort((a, b) => {
    const aKey = a[orderBy]
    const bKey = b[orderBy]
    if (order === 'ASC') {
      return aKey > bKey ? 1 : -1
    }
    return aKey > bKey ? -1 : 1
  })
}

type PaginationOptions = {
  perPage?: number
  first?: number
}

export function paginateArray<T = any>(
  arr: T[],
  options: PaginationOptions
): T[][] {
  const { perPage = 30, first } = options

  if (first) {
    return [arr.slice(0, first)]
  }

  const totalPages = Math.ceil(arr.length / perPage)
  const result = []
  for (let i = 0; i < totalPages; i++) {
    result[i] = arr.slice(i * perPage, (i + 1) * perPage)
  }

  return result
}
