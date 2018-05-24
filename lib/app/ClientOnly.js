export default {
  functional: true,
  name: 'ClientOnly',
  render(h, { parent, children }) {
    if (parent._isMounted) {
      return children
    }
    parent.$once('hook:mounted', () => {
      parent.$forceUpdate()
    })
  }
}
