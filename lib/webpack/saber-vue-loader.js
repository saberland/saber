const prepareData = require('./prepare-data')

module.exports = async function(source) {
  this.cacheable()

  const done = this.async()
  const { api } = this.query

  let data
  try {
    data = await prepareData(
      source,
      { resourcePath: this.resourcePath, issuerPath: this.resourcePath },
      api
    )
  } catch (err) {
    return done(err)
  }

  const hasData = Boolean(data)

  const res = `export default function (Component) {
    if (!${hasData}) {
      return Component
    }

    delete Component.options._Ctor
    var dataFn = Component.options.data
    Component.options.data = function () {
      return Object.assign(dataFn ? dataFn.call(this) : {}, ${JSON.stringify(
        data
      )})
    }
  }`

  done(null, res)
}
