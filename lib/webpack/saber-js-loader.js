const url = require('url')
const prepareData = require('./prepare-data')

module.exports = async function(source) {
  this.cacheable()

  if (!this.resourcePath.endsWith('.saber.js')) {
    return source
  }

  const done = this.async()
  let data
  try {
    data = await prepareData(
      source,
      url.parse(this._module.issuer.resource).pathname,
      this.query.api
    )
  } catch (err) {
    return done(err)
  }

  done(null, `export default ${JSON.stringify(data)}`)
}
