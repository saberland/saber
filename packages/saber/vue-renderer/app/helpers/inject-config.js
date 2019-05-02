import { siteConfig, themeConfig, locales } from 'saber/config'

export default ({ Vue }) => {
  const store = Vue.observable({ siteConfig, themeConfig, locales })

  const getMatchedConfig = (currentRoute, key) => {
    const routes = Object.keys(store.locales)
    let matchedRoute = '/'
    for (const route of routes) {
      if (route !== '/') {
        if (currentRoute === route || currentRoute.indexOf(`${route}/`) === 0){
          matchedRoute = route
        }
      }
    }
    const matchedLocale = store.locales[matchedRoute]
    return Object.assign({}, store[key], matchedLocale && matchedLocale[key])
  }

  Vue.mixin({
    computed: {
      $siteConfig() {
        return getMatchedConfig(this.$route.path, 'siteConfig')
      },
      $themeConfig() {
        return getMatchedConfig(this.$route.path, 'themeConfig')
      }
    }
  })

  if (module.hot) {
    module.hot.accept('saber/config', () => {
      const config = require('saber/config')
      store.siteConfig = config.siteConfig
      store.themeConfig = config.themeConfig
      store.locales = config.locales
    })
  }
}
