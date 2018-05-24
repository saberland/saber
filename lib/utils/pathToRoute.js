const pathToRoute = (p, stripIndex = true) => {
  const route = '/' + p.replace(/\.vue$/, '').replace(/\[(.*?)\]/g, ':$1')
  if (!stripIndex) {
    return route
  }
  if (route === '/index') {
    return '/'
  }
  return route.replace(/\/index$/, '')
}

module.exports = pathToRoute
