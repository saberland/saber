module.exports = function(source, map) {
  this.callback(
    null,
    `
    import __pageComponent from "${source.trim()}"
    export default function (Component) {
      Component.options.PageComponent = __pageComponent
    }
    `,
    map
  )
}
