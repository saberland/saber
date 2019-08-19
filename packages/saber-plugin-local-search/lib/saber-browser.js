import FuzzySearch from 'fuzzy-search'
import debounce from 'lodash.debounce'

let searchData
let fuzzySearch

export default ({ Vue }) => {
  Vue.prototype.$searchPages = debounce(performSearch, 50, {
    leading: true,
    trailing: true
  })
}

async function performSearch(query) {
  if (!searchData) {
    let publicUrl = __PUBLIC_URL__ // eslint-disable-line no-undef
    publicUrl += publicUrl.endsWith('/') ? '' : '/'
    const locale = this.$localePath === '/' ? 'default' : this.$localePath

    // eslint-disable-next-line no-undef
    const data = await fetch(`${publicUrl}_saber/search/${locale}.json`).then(
      res => res.json()
    )

    const indexes = []
    searchData = data
      .map(item => {
        if (item.excerpt) item.excerpt = stripTags(item.excerpt)
        if (item.content) item.content = stripTags(item.content)

        Object.keys(item).forEach(
          index => indexes.includes(index) || indexes.push(index)
        )

        return item
      })
      .map(item => {
        indexes.forEach(index => {
          item[index] = item[index] || ''
        })

        return item
      })

    fuzzySearch = new FuzzySearch(searchData, indexes, { sort: true })
  }

  return fuzzySearch.search(query)
}

const stripTags = html => {
  const template = document.createElement('template') // eslint-disable-line no-undef
  template.innerHTML = html
  return template.content.textContent.trim()
}
