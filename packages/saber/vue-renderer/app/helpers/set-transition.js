export default ({ router }) => {
  if (process.browser) {
    router.beforeEach(async (to, from, next) => {
      // The default router component
      let RouteComponent = to.matched[0].components.default
      // Resolve async component
      if (typeof RouteComponent === 'function') {
        RouteComponent = await RouteComponent()
      }
      // ES compat
      RouteComponent = RouteComponent.default || RouteComponent

      const routeTransition = normalizeTransition(
        RouteComponent.transition,
        to,
        from
      )

      let layoutTransition
      if (RouteComponent.layout) {
        const { layouts } = router.app.$options
        const LayoutComponent =
          layouts[RouteComponent.layout] || layouts.default
        if (LayoutComponent) {
          layoutTransition = normalizeTransition(
            LayoutComponent.transition,
            to,
            from
          )
        }
      }

      router.app.setTransition(
        Object.assign(
          {
            name: 'page',
            mode: 'out-in'
          },
          routeTransition || layoutTransition
        )
      )
      next()
    })
  }
}

function normalizeTransition(transition, to, from) {
  if (typeof transition === 'function') {
    transition = transition(to, from)
  } else if (typeof transition === 'string') {
    transition = { name: transition }
  }
  return transition
}
