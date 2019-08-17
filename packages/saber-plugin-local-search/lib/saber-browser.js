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
    let publicUrl = this.$siteConfig.publicUrl || '/'
    publicUrl += publicUrl.endsWith('/') ? '' : '/'
    const locale = this.$localePath === '/' ? 'default' : this.$localePath
    const request = await fetch(`${publicUrl}_saber/search/${locale}.json`) // eslint-disable-line no-undef
    const data = await request.json()
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
