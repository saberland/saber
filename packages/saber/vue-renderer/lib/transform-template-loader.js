const posthtml = require('posthtml')

module.exports = async function(source) {
  const done = this.async()
  try {
    const { plugins, transformTemplate } = this.query
    const context = { filename: this.resourcePath }
    const { html } = await posthtml(
      [
        require('./template-plugins/link')(),
        tree => transformTemplate(tree, context)
      ].concat(plugins)
    ).process(source, {
      recognizeSelfClosing: true
    })
    done(null, html)
  } catch (error) {
    done(error)
  }
}
