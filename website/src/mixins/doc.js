export default {
  mounted() {
    // Make footnotes focusable
    const items = this.$el.querySelectorAll('.footnote-item,.footnote-ref a')
    Array.prototype.forEach.call(items, el => {
      el.tabIndex = 1
    })
  }
}
