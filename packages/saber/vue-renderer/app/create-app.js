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

export default (context) => {
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
    data() {
      return {
        transition: null
      }
    },
    render(h) {
      const transition = Object.assign({}, this.transition)
      const listeners = {}
      Object.keys(transition).forEach(key => {
        if (typeof transition[key] === 'function') {
          const kebabKey = key.replace(/([a-z])([A-Z])/, (_, p1, p2) => `${p1}-${p2.toLowerCase()}`)
          listeners[kebabKey] = transition[key]
          delete transition[key]
        }
      })
      return h('div', { attrs: { id: '_saber' } }, [
        h(
          'transition',
          {
            props: transition,
            on: listeners
          },
          [h('router-view')]
        )
      ])
    },
    methods: {
      setTransition(name) {
        this.transition = name
      },

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
        // Not a page, return the link directly
        return relativePath
      }
    }
  }

  if (process.browser) {
    router.beforeEach(async (to, from, next) => {
      const matched = router.getMatchedComponents(to)[0]
      if (!matched) {
        return next()
      }

      let component = await (typeof matched === 'function'
        ? matched()
        : matched)
      component = component.default || component

      let transition
      if (typeof component.transition === 'function') {
        transition = component.transition(to, from)
      } else {
        transition = component.transition
      }
      if (!transition || typeof transition === 'string') {
        transition = { name: component.transition }
      }
      transition.name = transition.name || 'page'
      transition.mode = transition.mode || 'out-in'

      app.$saber.setTransition(transition)
      next()
    })
  }
  
  const addRedirect = (routes)=>{
    if(!Array.isArray(routes)){
      routes = [routes]
    }

    if (process.env.NODE_ENV !== 'production') {
      router.addRoutes(routes.map((rt)=> (
        { path: `${rt.from}` , redirect: `${rt.to}.html` }
        )
      ))
    }else{
      routes.map(({from, to}) => {
        context.addRedirect(from, to)
      })
    }
  }

  const browserApiContext = { Vue, router, rootOptions, addRedirect }

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
