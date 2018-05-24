const prepareData = require('./prepare-data')

module.exports = async function(source) {
  this.cacheable()

  const done = this.async()
  let data
  try {
    data = await prepareData(
      source,
      {
        issuerPath: this._module.issuer.resource.replace(/\?.+$/, ''),
        resourcePath: this.resourcePath
      },
      this.query.api
    )
  } catch (err) {
    return done(err)
  }

  done(null, `export default ${JSON.stringify(data)}`)
}
