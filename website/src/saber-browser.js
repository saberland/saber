// eslint-disable-next-line import/no-unresolved
import { siteConfig } from 'saber-config'
import 'nprogress/nprogress.css'
import './css/global.css'

export default ({ router, rootOptions }) => {
  if (process.browser) {
    const nprogress = require('nprogress')

    const loaded = Object.create(null)

    nprogress.configure({ showSpinner: false })

    router.beforeEach((to, from, next) => {
      if (!loaded[to.path]) {
        nprogress.start()
      }
      next()
    })

    router.afterEach(to => {
      loaded[to.path] = true
      nprogress.done()
    })
  }

  rootOptions.head.htmlAttrs = {
    lang: 'en'
  }
  rootOptions.head.meta = [
    {
      name: 'description',
      content: siteConfig.description
    }
  ]
  rootOptions.head.link = [
    {
      href:
        'https://fonts.proxy.ustclug.org/css?family=Josefin+Sans|Source+Sans+Pro',
      rel: 'stylesheet'
    }
  ]
}
