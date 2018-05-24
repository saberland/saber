function formatRoute(route) {
  return `
  {
    path: '${
      typeof route.childPath === 'string' ? route.childPath : route.path
    }',${formatChildren(route.children)}
    component: () => import(/* webpackChunkName: "${route.name}" */ '${
    route.component
  }')
  }
  `
}

function formatChildren(children) {
  if (!children) {
    return ''
  }

  return (
    '\n    children: [' +
    children.map(route => formatRoute(route)).join(',') +
    '],\n'
  )
}

module.exports = routes => {
  return `
export default [${routes.map(route => formatRoute(route)).join(',')}]
  `
}
