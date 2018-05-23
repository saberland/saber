const pathToRoute = p => {
  const route = '/' + p.replace(/\.vue$/, '').replace(/\[(.*?)\]/g, ':$1')
  if (route === '/index') {
    return '/'
  }
  return route.replace(/\/index$/, '')
}

module.exports = pathToRoute
