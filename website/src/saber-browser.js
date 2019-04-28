import 'nprogress/nprogress.css'
import 'prismjs/themes/prism.css'
import '../../packages/saber-highlight-css/default.css'
import './css/global.css'
import './css/page.css'

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

  rootOptions.head = function() {
    return {
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        {
          name: 'description',
          content: this.$siteConfig.description
        }
      ],
      link: [
        {
          href:
            'https://fonts.googleapis.com/css?family=Roboto',
          rel: 'stylesheet'
        }
      ]
    }
  }
}
