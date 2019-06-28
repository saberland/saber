import 'nprogress/nprogress.css'
import '../../packages/saber-highlight-css/default.css'
import './css/global.css'
import './css/prism.css'
import './css/page.css'

export default ({ router, setHead }) => {
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

      document.body.classList.remove('show-leftbar')
    })
  }

  setHead(vm => ({
    meta: [
      {
        name: 'description',
        content: vm.$siteConfig.description
      }
    ]
  }))
}
