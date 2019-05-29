import Vue from 'vue'
import Router from './vendor/vue-router'
import RoutePrefetch from './vendor/vue-router-prefetch'
import routes from '#cache/routes'

Vue.use(Router)

// Make `<RouterLink>` prefetch-able
Vue.use(RoutePrefetch, {
  componentName: 'SaberLink',
  // Only enable prefetching in production mode
  prefetch: process.env.NODE_ENV === 'production'
})

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}

export default () => {
  const createRouter = routes =>
    new Router({
      mode: 'history',
      routes,
      scrollBehavior(to, from, savedPosition) {
        // if the returned position is falsy or an empty object,
        // will retain current scroll position.
        let position = false

        // if no children detected and scrollToTop is not explicitly disabled
        if (
          to.matched.length < 2 &&
          to.matched.every(r => r.components.default.scrollToTop !== false)
        ) {
          // scroll to the top of the page
          position = { x: 0, y: 0 }
        } else if (to.matched.some(r => r.components.default.scrollToTop)) {
          // if one of the children has scrollToTop option set to true
          position = { x: 0, y: 0 }
        }

        // savedPosition is only available for popstate navigations (back button)
        if (savedPosition) {
          position = savedPosition
        }

        return new Promise(resolve => {
          const fulfill = () => {
            // coords will be used if no selector is provided,
            // or if the selector didn't match any element.
            if (to.hash) {
              const hash = decodeURIComponent(to.hash)
              if (document.getElementById(hash.substr(1))) {
                // scroll to anchor by returning the selector
                position = { selector: hash }
              } else {
                // scroll to top if anchor does not exist and position is not already set
                position = position || { x: 0, y: 0 }
              }
            }
            resolve(position)
          }

          // wait for the out transition to complete (if necessary)
          if (to.path === from.path) {
            fulfill()
          } else {
            router.app.$once('trigger-scroll', fulfill)
          }
        })
      }
    })

  const router = createRouter(routes)

  if (__LAZY__) {
    let hasPrevPage = false
    const visitedRoutes = {}

    router.beforeEach((to, from, next) => {
      if (!hasPrevPage || visitedRoutes[to.path]) return next()

      next(false)

      visitedRoutes[to.path] = true
      fetch('/_saber/visit-page?route=' + to.path)
    })

    router.afterEach(() => {
      hasPrevPage = true
    })
  }

  if (module.hot) {
    module.hot.accept('#cache/routes', () => {
      router.options.routes = routes
      router.matcher = createRouter(require('#cache/routes').default).matcher
    })
  }

  return router
}
