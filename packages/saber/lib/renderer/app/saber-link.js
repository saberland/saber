export default Vue => {
  const observer =
    process.browser &&
    window.IntersectionObserver &&
    new window.IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target._linkPrefetch()
        }
      })
    })

  const SaberLink = {
    name: 'SaberLink',
    extends: Vue.component('RouterLink'),
    props: {
      prefetch: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      const canPrefetch =
        !navigator.connection ||
        !navigator.connection.effectiveType.includes('2g')
      if (this.prefetch && observer && canPrefetch) {
        setTimeout(() => {
          this.observe()
        }, 1000)
      }
    },
    beforeDestory() {
      this.unobserve()
    },
    methods: {
      observe() {
        observer.observe(this.$el)
        this.$el._linkPrefetch = this.linkPrefetch
        this._linkObserved = true
      },
      unobserve() {
        if (this._linkObserved) {
          observer.unobserve(this.$el)
        }
      },
      getComponents() {
        return this.$router.getMatchedComponents(this.to).filter(Component => {
          return typeof Component === 'function' && !Component._prefetched
        })
      },
      linkPrefetch() {
        const components = this.getComponents()
        for (const Component of components) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`[saber] prefetching link ${this.to}`)
          }
          Component()
          Component._prefetched = true
          this.unobserve()
        }
      }
    }
  }

  Vue.component(SaberLink.name, SaberLink)
}
