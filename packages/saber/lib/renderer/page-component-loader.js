module.exports = function(source, map) {
  this.callback(
    null,
    `
    ${source}
    export default function (Component) {
      Component.options.PageComponent = PageComponent
    }`,
    map
  )
}
