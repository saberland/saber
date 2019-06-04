import './polyfills'
import '#cache/runtime-polyfills'
import { join, dirname } from 'path'
import Vue from 'vue'
import layouts from '#cache/layouts'
import createRouter from './router'
import Meta from './vendor/vue-meta'
import Layout from './components/LayoutManager.vue'
import ClientOnly from './components/ClientOnly'
import extendBrowserApi from '#cache/extend-browser-api'
import injectConfig from './helpers/inject-config'
import setTransition from './helpers/set-transition'
import scrollHandler from './helpers/scroll-handler'

Vue.config.productionTip = false

Vue.component(ClientOnly.name, ClientOnly)
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

  let customHead
  let customRootComponent

  const rootOptions = {
    mixins: [],
    head() {
      const head =
        typeof customHead === 'function'
          ? customHead.call(this, this)
          : customHead || {}

      const htmlAttrs = {
        lang: this.$siteConfig.lang,
        ...head.htmlAttrs
      }

      if (!htmlAttrs.lang) {
        delete htmlAttrs.lang
      }

      return {
        ...head,
        htmlAttrs,
        meta: [
          {
            name: 'generator',
            content: `Saber v${__SABER_VERSION__}`
          },
          ...(head.meta || [])
        ]
      }
    },
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
    mounted() {
      scrollHandler(
        this.$router,
        this.$router.currentRoute,
        this.$router.currentRoute
      )
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
      const beforeEnter = listeners['before-enter']
      listeners['before-enter'] = el => {
        this.$nextTick(() => {
          this.$emit('trigger-scroll')
        })
        beforeEnter && beforeEnter(el)
      }
      const children = [
        h(
          'transition',
          {
            props: transition,
            on: listeners
          },
          [h('router-view')]
        )
      ]
      return h('div', { attrs: { id: '_saber' } }, [
        customRootComponent ? h(customRootComponent, {}, children) : children
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

  const setHead = input => (customHead = input)
  const setRootComponent = input => (customRootComponent = input)

  const browserApiContext = {
    Vue,
    router,
    rootOptions,
    setHead,
    setRootComponent
  }

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

// Reloading browser when following files change
if (module.hot) {
  module.hot.accept(['#cache/layouts', '#cache/runtime-polyfills'], () => {
    location.reload()
  })
}
