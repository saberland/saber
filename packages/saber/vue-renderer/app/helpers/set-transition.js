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

      let transition = routeTransition || layoutTransition || {}
      const leaveProperties = ['beforeLeave','leave', 'afterLeave', 'leaveClass', 'leaveCancelled', 'leaveToClass', 'leaveActiveClass']

      for (const property of leaveProperties) {
        const next = `nextTransition_${property}`
        transition[next] = transition[property] // use current leave property for next route transition
        
        if (router.app.transition) {
          transition[property] = router.app.transition[next] // apply the current route's leave properties
        }
        else {
          transition[property] = undefined
        }
      }

      router.app.setTransition(
        Object.assign(
          {
            name: 'page',
            mode: 'out-in'
          },
          transition
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
