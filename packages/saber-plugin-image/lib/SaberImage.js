import VueLazyload from 'vue-lazyload'
import styles from './styles.module.css'

const optionPriority = (general, specific, key) =>
  specific[key] || (specific[key] !== false && general[key])

export default function(Vue) {
  const options = Object.assign(
    (process.browser && __SABER_IMAGE_OPTIONS__) || {}, // eslint-disable-line no-undef
    {
      lazyComponent: true
    }
  )

  Vue.use(VueLazyload, options)

  Vue.component('saber-image', {
    props: ['src', 'lazy'],
    render(h) {
      const {
        src: { width, height, src, srcSet: srcset, placeholder },
        $attrs
      } = this

      const lazy = Object.assign(options, this.lazy)

      if (optionPriority(options, lazy, 'lazyLoad')) {
        const loading =
          (optionPriority(options, lazy, 'placeholder') && placeholder) ||
          lazy.placeholder ||
          options.placeholder

        return h('img', {
          attrs: {
            ...$attrs,
            'data-srcset': srcset,
            width,
            height
          },
          class:
            optionPriority(options, lazy, 'blendIn') && loading
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
