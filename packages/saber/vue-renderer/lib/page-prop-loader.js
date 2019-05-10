const serialize = require('serialize-javascript')
const { requireAssets } = require('../../lib/utils/assetsAttribute')

module.exports = function(source, map) {
  const pageId = source.trim()
  const { api } = this.query
  const page = requireAssets(
    serialize(api.nodes.by('id', pageId).fields, {
      isJSON: true,
      space: process.env.NODE_ENV === 'production' ? 0 : 2
    })
  )
  this.callback(
    null,
    `
    export default function(Component) {
      var page = ${page}
      var beforeCreate = Component.options.beforeCreate || []
      Component.options.beforeCreate = [function() {
        this.$page = page
      }].concat(beforeCreate)

      // These options can be defined as Vue component option or page field
      // They are also available in layout component except for the 'layout' option
      var pageComponentOptions = ['layout', 'transition']

      pageComponentOptions.forEach(function(name) {
        var PageComponent = Component.options.PageComponent
        if (PageComponent) {
          // .vue or .js page, set route transition from PageComponent
          Component.options[name] = PageComponent[name]
        }

        // Fallback to page field
        if (Component.options[name] === undefined) {
          Component.options[name] = page[name]
        }
      })

      Component.options.name = 'page-wrapper-' + page.slug.replace(/[^0-9a-z\\-]/i, '-')
      if (module.hot) {
        var Vue = require('vue').default
        Component.options._Ctor = Vue.extend(Component)
      }
  }
  `,
    map
  )
}
