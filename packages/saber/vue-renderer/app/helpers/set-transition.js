export default ({ router }) => {
  if (process.browser) {
    router.beforeEach(async (to, from, next) => {
      // The default router component
      let component = to.matched[0].components.default

      // Resolve async component
      if (typeof component === 'function') {
        component = await component()
      }

      // ES compat
      component = component.default || component

      let transition
      if (typeof component.transition === 'function') {
        transition = component.transition(to, from)
      } else {
        transition = component.transition
      }
      if (!transition || typeof transition === 'string') {
        transition = { name: component.transition }
      }
      transition.name = transition.name || 'page'
      transition.mode = transition.mode || 'out-in'

      router.app.setTransition(transition)
      next()
    })
  }
}
