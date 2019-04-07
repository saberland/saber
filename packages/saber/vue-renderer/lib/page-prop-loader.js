module.exports = function(source, map) {
  this.callback(
    null,
    `
  export default function(Component) {
    var page = ${source}
    var beforeCreate = Component.options.beforeCreate || []
    Component.options.beforeCreate = [function() {
      this.$page = page
    }].concat(beforeCreate)
    Component.options.name = 'page-wrapper-' + page.attributes.slug.replace(/[^0-9a-z\\-]/i, '-')
  }
  `,
    map
  )
}
