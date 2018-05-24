const path = require('path')
const req = require('require-from-string')
const toPath = require('path-to-regexp')
const pathToRoute = require('../utils/pathToRoute')

function getAsyncValue(fn) {
  return typeof fn === 'function' ? fn() : fn
}

module.exports = async (source, { resourcePath, issuerPath }, api) => {
  let prepare = req(source, resourcePath)
  prepare = prepare.default || prepare

  const res = await Promise.all([
    prepare.data && getAsyncValue(prepare.data),
    prepare.params && getAsyncValue(prepare.params)
  ])

  // Get the route path of the component
  const route = pathToRoute(path.relative(api.resolvePagesDir(), issuerPath))

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

  return res[0]
}
