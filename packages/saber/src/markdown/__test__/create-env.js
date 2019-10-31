module.exports = _page => {
  const page = { ..._page, internal: { ...(_page && _page.internal) } }
  return {
    page,
    env: {
      page
    }
  }
}
