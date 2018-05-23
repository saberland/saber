const pathToComponentName = require('../../utils/pathToComponentName')

module.exports = routes => {
  return `
export default [${routes
    .map(
      route => `
{
  path: '${route.path}',
  component: () => import(/* webpackChunkName: "${pathToComponentName(
    route.path
  )}" */ '${route.component}')
}
`
    )
    .join(',')}]
  `
}
