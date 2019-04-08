module.exports = () => {
  const page = { attributes: {}, internal: {} }
  return {
    page,
    env: {
      getAttribute(name) {
        return page.attributes[name]
      },
      getInternal(name) {
        return page.internal[name]
      },
      setAttribute(name, value) {
        page.attributes[name] = value
      },
      setInternal(name, value) {
        page.internal[name] = value
      }
    }
  }
}
