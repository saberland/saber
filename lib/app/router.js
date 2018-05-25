/* globals __PUBLIC_PATH__ */
import Vue from 'vue'
import Router from 'vue-router'
import routes from '#out/templates/routes'

Vue.use(Router)

export default context => {
  const router = new Router({
    mode: 'history',
    routes,
    base: __PUBLIC_PATH__,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      return { x: 0, y: 0 }
    }
  })

  const addRoutes = router.addRoutes.bind(router)

  const addGenerateRoutes = (routesConfig, prefix = '') => {
    if (process.server) {
      for (const route of routesConfig) {
        const r = prefix + route.path
        context.addRoute(r)
        if (route.children) {
          addGenerateRoutes(route.children, r + '/')
        }
      }
    }
  }

  router.addRoutes = routesConfig => {
    addGenerateRoutes(routesConfig)
    addRoutes(routesConfig)
  }

  return router
}
