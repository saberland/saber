import _app from '#out/templates/app'

export default async context => {
  const { app, router } = _app

  const { fullPath } = router.resolve(context.url).route

  if (fullPath !== context.url) {
    throw new Error(`404 not found: ${context.url}`)
  }

  router.push(context.url)

  const onReady = () =>
    new Promise(resolve => {
      router.onReady(() => resolve())
    })

  await onReady()

  let metaInfo

  context.renderStart = () => {
    metaInfo = app.$meta().inject()
    return ''
  }

  context.renderMeta = () => {
    const { title, link, style, script, noscript, meta } = metaInfo

    return `${meta.text()}
    ${title.text()}
    ${link.text()}
    ${style.text()}
    ${script.text()}
    ${noscript.text()}`
  }

  context.renderHtmlAttrs = () => {
    const { htmlAttrs } = metaInfo

    return htmlAttrs.text()
  }

  context.renderBodyAttrs = () => {
    const { bodyAttrs } = metaInfo

    return bodyAttrs.text()
  }

  return app
}
