const devalue = require('devalue')

module.exports = function(source, map) {
  const pageId = source.trim()
  const { api } = this.query
  const page = devalue(api.pages.getPageProp(pageId))
  this.callback(
    null,
    `
    export default function(Component) {
      var page = ${page}
      var beforeCreate = Component.options.beforeCreate || []
      Component.options.beforeCreate = [function() {
        this.$page = page
      }].concat(beforeCreate)

      var PageComponent = Component.options.PageComponent
      if (PageComponent) {
        // .vue or .js page, set route transition from PageComponent.transition
        Component.options.transition = PageComponent.transition
      }

      // Fallback to page attribute
      if (Component.options.transition === undefined) {
        Component.options.transition = page.attributes.transition
      }


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
