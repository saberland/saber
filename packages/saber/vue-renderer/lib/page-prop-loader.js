module.exports = function(source, map) {
  const pageId = source.trim()
  const { api } = this.query
  const page = JSON.stringify(api.pages.getPageProp(pageId))
  this.callback(
    null,
    `
    export default function(Component) {
      var page = ${page}
      var beforeCreate = Component.options.beforeCreate || []
      Component.options.beforeCreate = [function() {
        this.$page = page
      }].concat(beforeCreate)
      Component.options.name = 'page-wrapper-' + page.attributes.slug.replace(/[^0-9a-z\\-]/i, '-')
      if (module.hot) {
        var Vue = require('vue').default
        Component.options._Ctor = Vue.extend(Component)
      }
  }
  `,
    map
  )
}
