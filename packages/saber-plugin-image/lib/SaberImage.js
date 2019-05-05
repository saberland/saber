import VueLazyload from 'vue-lazyload'
import styles from './styles.module.css'

export default function(Vue) {
  const options = Object.assign(
    (process.browser && __SABER_IMAGE_OPTIONS__) || {}, // eslint-disable-line no-undef
    {
      lazyComponent: true
    }
  )

  console.log(options)

  Vue.use(VueLazyload, options)

  Vue.component('saber-image', {
    props: ['src', 'lazy'],
    data() {
      return { loaded: false }
    },
    render(h) {
      const {
        src: { width, height, src, srcSet: srcset, placeholder },
        $attrs
      } = this

      const lazy = Object.assign(options, this.lazy)

      if (lazy.lazyLoad || (lazy.lazyLoad !== false && options.lazyLoad)) {
        const loading =
          ((lazy.placeholder ||
            (lazy.placeholder !== false && options.placeholder)) &&
            placeholder) ||
          lazy.placeholder ||
          options.loading

        return h('img', {
          attrs: {
            ...$attrs,
            'data-srcset': srcset,
            width,
            height
          },
          class:
            (lazy.blendIn || (lazy.blendIn !== false && options.blendIn)) &&
            loading
              ? { [styles.blendIn]: true }
              : {},
          directives: [
            {
              name: 'lazy',
              value: {
                src,
                loading
              }
            }
          ]
        })
      }

      return h('img', {
        attrs: { ...$attrs, src, srcset }
      })
    }
  })
}
