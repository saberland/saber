import { siteConfig, themeConfig, locales } from 'saber/config'

export default ({ Vue }) => {
  const store = Vue.observable({ siteConfig, themeConfig, locales })

  const getMatchedConfig = (localePath, key) => {
    const matchedLocale = store.locales[localePath]
    return Object.assign({}, store[key], matchedLocale && matchedLocale[key])
  }

  Vue.mixin({
    computed: {
      $localePath() {
        const allLocalePaths = Object.keys(store.locales)
        let localePath = '/'
        for (const path of allLocalePaths) {
          if (path !== '/') {
            if (this.$route.path === path || this.$route.path.indexOf(`${path}/`) === 0){
              localePath = path
            }
          }
        }
        return localePath
      },
      $locales() {
        return store.locales
      },
      $siteConfig() {
        return getMatchedConfig(this.$localePath, 'siteConfig')
      },
      $themeConfig() {
        return getMatchedConfig(this.$localePath, 'themeConfig')
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
