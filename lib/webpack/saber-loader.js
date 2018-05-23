const path = require('path')
const req = require('require-from-string')
const toPath = require('path-to-regexp')
const pathToRoute = require('../utils/pathToRoute')

function getAsyncValue(fn) {
  return typeof fn === 'function' ? fn() : fn
}

module.exports = async function(source) {
  this.cacheable()
  const done = this.async()
  const { api } = this.query

  let data
  try {
    let prepare = req(source, this.resourcePath)
    prepare = prepare.default || prepare
    const res = await Promise.all([
      prepare.data && getAsyncValue(prepare.data),
      prepare.params && getAsyncValue(prepare.params)
    ])
    data = res[0]
    const route = pathToRoute(
      path.relative(api.resolvePagesDir(), this.resourcePath)
    )

    const params = res[1] ? [].concat(res[1]) : null
    if (params) {
      params.forEach(param => {
        const compiled = toPath.compile(route)(param)
        api.routes.delete(route)
        api.routes.add(compiled)
      })
    } else if (route.includes(':')) {
      throw new Error(
        `"${route}" is a dynamic path so you must export "params" in <saber> block.`
      )
    }
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
