module.exports = function (source, map) {
  this.callback(
    null,
    `export default function (Component) {
      var __pageData = ${source}
      Component.options.computed = Component.options.computed || {}
      Component.options.computed.$page = function () {
        return __pageData
      }
      Component.options.name = 'page-' + __pageData.attributes.slug.replace(/[^0-9a-z\\-]/i, '-')
    }`,
    map
  )
}
