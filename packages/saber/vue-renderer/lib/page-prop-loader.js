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

      // These options can be defined as Vue component option or page attribute
      // They are also available in layout component except for the 'layout' option
      var pageComponentOptions = ['layout', 'transition']

      pageComponentOptions.forEach(function(name) {
        var PageComponent = Component.options.PageComponent
        if (PageComponent) {
          // .vue or .js page, set route transition from PageComponent
          Component.options[name] = PageComponent[name]
        }

        // Fallback to page attribute
        if (Component.options[name] === undefined) {
          Component.options[name] = page.attributes[name]
        }
      })

      Component.options.isPageWrapper = true
      Component.options.isVueSFC = ${['vue', 'js'].includes(page.contentType)}
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
