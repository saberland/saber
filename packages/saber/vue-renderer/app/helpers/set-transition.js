export default ({ router }) => {
  if (process.browser) {
    router.beforeEach(async (to, from, next) => {
      const matched = router.getMatchedComponents(to)[0]
      if (!matched) {
        return next()
      }

      let component = await (typeof matched === 'function'
        ? matched()
        : matched)
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
