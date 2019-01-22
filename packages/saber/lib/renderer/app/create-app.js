import './polyfills'
import Vue from 'vue'
import routes from '#cache/routes'
import Router from './vendor/vue-router'
import Meta from './vendor/vue-meta'
import Layout from './LayoutManager.vue'
import extendBrowserApi from '#cache/extend-browser-api'
import SaberLink from './saber-link'

Vue.use(Router)
Vue.use(SaberLink)

Vue.component(Layout.name, Layout)

Vue.use(Meta, {
  keyName: 'head',
  attribute: 'data-saber-head',
  ssrAttribute: 'data-saber-ssr',
  tagIDKeyName: 'vmid'
})

export default () => {
  const router = new Router({
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    }
  })

  const rootOptions = {
    head: {
      title: 'Saber App'
    },
    router,
    render: h => h('div', { attrs: { id: '_saber' } }, [h('router-view')])
  }

  extendBrowserApi({ router, rootOptions })

  const app = new Vue(rootOptions)

  return {
    app,
    router
  }
}
