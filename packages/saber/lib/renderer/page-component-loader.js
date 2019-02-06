module.exports = function(source, map) {
  this.callback(
    null,
    `
    ${source}
    export default function (Component) {
      Component.options.components = Component.options.components || {}
      Component.options.components['page-component'] = PageComponent
    }`,
    map
  )
}
