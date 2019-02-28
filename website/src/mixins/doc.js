import jump from 'jump.js'

export default {
  watch: {
    '$route.hash': {
      handler(hash) {
        this.$nextTick(() => {
          if (hash) {
          const el = document.getElementById(hash.slice(1))
          if (el) {
            jump(el, {
              duration: 0,
              offset: -(document.querySelector('.header').clientHeight + 20)
            })
          }
        }
        })
      },
      immediate: true
    }
  },

  mounted() {
    // Make footnotes focusable
    const items = this.$el.querySelectorAll('.footnote-item,.footnote-ref a')
    Array.prototype.forEach.call(items, el => {
      el.tabIndex = 1
    })
  }
}
