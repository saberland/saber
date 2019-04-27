export default ({ router }) => {
  if (process.browser) {
    function normalizeTransition(transition, to, from) {
      if (typeof transition === 'function') {
        transition = transition(to, from)
      } else if (typeof transition === 'string') {
        transition = { name: transition }
      }
      return transition
    }

    async function getTransition(route, args) {
      if (
        !route ||
        !route.matched.length ||
        !route.matched[0].components.default
      ) {
        return
      }
      // The default router component
      let RouteComponent = route.matched[0].components.default
      // Resolve async component
      if (typeof RouteComponent === 'function') {
        RouteComponent = await RouteComponent()
      }
      // ES compat
      RouteComponent = RouteComponent.default || RouteComponent

      const routeTransition = normalizeTransition(
        RouteComponent.transition,
        ...args
      )

      let layoutTransition
      if (RouteComponent.layout) {
        const { layouts } = router.app.$options
        const LayoutComponent =
          layouts[RouteComponent.layout] || layouts.default
        if (LayoutComponent) {
          layoutTransition = normalizeTransition(
            LayoutComponent.transition,
            ...args
          )
        }
      }

      return Object.assign(
        {
          name: 'page',
          mode: 'out-in'
        },
        routeTransition || layoutTransition
      )
    }

    router.beforeEach(async (to, from, next) => {
      const [toTransition, fromTransition] = await Promise.all([
        getTransition(to, [to, from]),
        getTransition(from, [to, from])
      ])

      if (fromTransition) {
        for (const key of Object.keys(fromTransition)) {
          // prefer `leave` transitions of 'from' route
          if (/leave/i.test(key)) {
            toTransition[key] = fromTransition[key]
          }
        }
      }

      router.app.setTransition(toTransition)

      next()
    })
  }
}
