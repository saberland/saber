import './polyfills'
import './css/saber-highlight.css'
import { join, dirname } from 'path'
import Vue from 'vue'
import routes from '#cache/routes'
import layouts from '#cache/layouts'
import Router from './vendor/vue-router'
import RoutePrefetch from './vendor/vue-router-prefetch'
import Meta from './vendor/vue-meta'
import Layout from './LayoutManager.vue'
import extendBrowserApi from '#cache/extend-browser-api'
import injectConfig from './helpers/inject-config'

Vue.use(Router)

// Make `<RouterLink>` prefetch-able
Vue.use(RoutePrefetch, {
  componentName: 'SaberLink',
  // Only enable prefetching in production mode
  prefetch: process.env.NODE_ENV === 'production'
})

Vue.component(Layout.name, Layout)

Vue.use(Meta, {
  keyName: 'head',
  attribute: 'data-saber-head',
  ssrAttribute: 'data-saber-ssr',
  tagIDKeyName: 'vmid'
})

Vue.mixin({
  beforeCreate() {
    this.$saber = this.$root
  }
})

export default () => {
  const routerOptions = {
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      if (to.hash) {
        return {
          selector: to.hash
        }
      }
      return { x: 0, y: 0 }
    }
  }
  const router = new Router(routerOptions)

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
      router.matcher.clearRoutes()
      const routes = require('#cache/routes').default
      router.options.routes = routes
      router.addRoutes(routes)
    })
  }

  const rootOptions = {
    head: {},
    provide: {
      layouts
    },
    router,
    render: h => h('div', { attrs: { id: '_saber' } }, [h('router-view')]),
    methods: {
      getPageLink(relativePath, extraParams) {
        relativePath = join(dirname(this.$route.meta.__relative), relativePath)
        for (const route of this.$router.options.routes) {
          if (
            route.meta &&
            route.meta.__relative &&
            relativePath === route.meta.__relative
          ) {
            return `${route.path}${extraParams || ''}`
          }
        }
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            `Cannot resolve page ${relativePath} from ${
              this.$route.meta.__relative
            }, are you sure ${relativePath} exists?`
          )
          return '/404.html'
        }
      }
    }
  }

  const browserApiContext = { Vue, router, rootOptions }
  injectConfig(browserApiContext)
  extendBrowserApi(browserApiContext)

  const app = new Vue(rootOptions)

  return {
    app,
    router
  }
}

// Reloading browser when routes or layouts change
if (module.hot) {
  module.hot.accept(['#cache/layouts'], () => {
    location.reload()
  })
}
