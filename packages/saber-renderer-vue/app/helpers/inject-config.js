import { siteConfig, themeConfig } from 'saber/config'

export default ({ Vue }) => {
  const configStore = Vue.observable({ siteConfig, themeConfig })

  Vue.mixin({
    computed: {
      $siteConfig() {
        return configStore.siteConfig
      },
      $themeConfig() {
        return configStore.themeConfig
      }
    }
  })

  if (module.hot) {
    module.hot.accept('saber/config', () => {
      const config = require('saber/config')
      configStore.siteConfig = config.siteConfig
      configStore.themeConfig = config.themeConfig
    })
  }
}
