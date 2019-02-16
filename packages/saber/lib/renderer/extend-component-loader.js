const DATA_ID = '__extend_component_data__'

module.exports = function(source, map) {
  this.callback(
    null,
    `
    ${source.replace('export default', `var ${DATA_ID} =`)}
    export default function (Component) {
      Component.options.PageComponent = ${DATA_ID}.PageComponent

      Component.options.computed = Component.options.computed || {}
      Component.options.computed.$page = function () {
        return ${DATA_ID}.pageData
      }
      Component.options.name = 'page-wrapper-' + ${DATA_ID}.pageData.attributes.slug.replace(/[^0-9a-z\\-]/i, '-')
    }
    `,
    map
  )
}
