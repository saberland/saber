const posthtml = require('posthtml')

module.exports = async function(source) {
  const done = this.async()
  try {
    const { plugins } = this.query
    const context = { filename: this.resourcePath }
    const { html } = await posthtml(
      plugins.map(plugin => tree => plugin(tree, context))
    ).process(source, {
      recognizeSelfClosing: true
    })
    done(null, html)
  } catch (error) {
    done(error)
  }
}
