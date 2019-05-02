import createApp from './create-app'

export default async context => {
  const { app, router } = createApp(context)
  router.push(context.url)

  await new Promise((resolve, reject) => {
    router.onReady(resolve, reject)
  })

  if (context.res && router.currentRoute.name === 404) {
    context.res.statusCode = 404
  }

  let head
  context.head = new Proxy(
    {},
    {
      get(obj, prop) {
        if (!head) {
          head = app.$meta().inject()
        }
        if (prop === 'htmlAttrs') {
          return ` data-saber-ssr ${head.htmlAttrs.text()}`
        }
        const text = prop in head ? head[prop].text() : ''
        return text && prop.endsWith('Attrs') ? ` ${text}` : text
      }
    }
  )

  return app
}
