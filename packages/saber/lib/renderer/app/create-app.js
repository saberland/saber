import './polyfills'
import { join, dirname } from 'path'
import Vue from 'vue'
import routes from '#cache/routes'
import layouts from '#cache/layouts'
import Router from './vendor/vue-router'
import RoutePrefetch from './vendor/vue-router-prefetch'
import Meta from './vendor/vue-meta'
import Layout from './LayoutManager.vue'
import extendBrowserApi from '#cache/extend-browser-api'

Vue.use(Router)

// Make `<RouterLink>` prefetch-able
Vue.use(RoutePrefetch, {
  componentName: 'SaberLink'
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
  const router = new Router({
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
  })

  const rootOptions = {
    head: {},
    provide: {
      layouts
    },
    router,
    render: h => h('div', { attrs: { id: '_saber' } }, [h('router-view')]),
    methods: {
      getPageLink(relativePath, extraParams) {
        relativePath = join((dirname(this.$route.meta.__relative)), relativePath)
        for (const route of this.$router.options.routes) {
          if (route.meta && route.meta.__relative && relativePath === route.meta.__relative) {
            return `${route.path}${extraParams || ''}`
          }
        }
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`Cannot resolve page ${relativePath} from ${this.$route.meta.__relative}`)
        }
      }
    }
  }

  extendBrowserApi({ router, rootOptions })

  const app = new Vue(rootOptions)

  return {
    app,
    router
  }
}
