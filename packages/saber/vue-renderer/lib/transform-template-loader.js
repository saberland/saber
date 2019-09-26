const posthtml = require('posthtml')

module.exports = async function(source) {
  const done = this.async()
  try {
    const { html } = await posthtml(
      [require('./template-plugins/link')()].concat(this.query.plugins)
    ).process(source, {
      recognizeSelfClosing: true
    })
    done(null, html)
  } catch (error) {
    done(error)
  }
}
