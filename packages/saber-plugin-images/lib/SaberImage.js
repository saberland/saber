import VueLazyload from 'vue-lazyload'

export default function(Vue, options = {}) {
  options = Object.assign({ lazyLoad: true, placeholder: true }, options, {
    lazyComponent: true
  })

  Vue.use(VueLazyload, options)

  Vue.component('s-image', {
    props: ['src', 'lazy'],
    render(h) {
      const {
        src: { width, height, src, srcSet: srcset, placeholder },
        lazy = { lazyLoad: undefined, placeholder: true },
        $attrs
      } = this

      if (lazy.lazyLoad || (lazy.lazyLoad !== false && options.lazyLoad)) {
        const data = {
          attrs: {
            ...$attrs,
            'data-src': src,
            'data-srcset': srcset,
            width,
            height
          },
          directives: [
            {
              name: 'lazy',
              value: {
                src,
                loading:
                  ((lazy.placeholder ||
                    (lazy.placeholder !== false && options.placeholder)) &&
                    placeholder) ||
                  lazy.placeholder ||
                  options.loading
              }
            }
          ]
        }

        return h('img', data)
      }

      const data = {
        attrs: { ...$attrs, src, srcset }
      }

      return h('img', data)
    }
  })
}
