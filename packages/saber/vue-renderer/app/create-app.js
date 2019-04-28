import './polyfills'
import './css/saber-highlight.css'
import { join, dirname } from 'path'
import Vue from 'vue'
import layouts from '#cache/layouts'
import createRouter from './router'
import Meta from './vendor/vue-meta'
import Layout from './Layout.vue'
import extendBrowserApi from '#cache/extend-browser-api'
import injectConfig from './helpers/inject-config'
import setTransition from './helpers/set-transition'

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

export default context => {
  const router = createRouter()

  const rootOptions = {
    head: {},
    provide: {
      layouts
    },
    layouts,
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
          const kebabKey = key.replace(
            /([a-z])([A-Z])/,
            (_, p1, p2) => `${p1}-${p2.toLowerCase()}`
          )
          listeners[kebabKey] = transition[key]
          delete transition[key]
        }
      })
      const { beforeEnter } = listeners
      listeners.beforeEnter = el => {
        this.$emit('trigger-scroll')
        beforeEnter && beforeEnter(el)
      }
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

  const browserApiContext = { Vue, router, rootOptions }

  injectConfig(browserApiContext)
  extendBrowserApi(browserApiContext)
  // Set transition after calling `extendBrowserApi`
  // Because user might use `beforeEach` hook to add progress bar
  setTransition(browserApiContext)

  const app = new Vue(rootOptions)

  return {
    app,
    router
  }
}

// Reloading browser when layouts change
if (module.hot) {
  module.hot.accept(['#cache/layouts'], () => {
    location.reload()
  })
}
