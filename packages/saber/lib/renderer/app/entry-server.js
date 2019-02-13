import createApp from './create-app'

export default context =>
  new Promise((resolve, reject) => {
    const { app, router } = createApp()
    router.push(context.url)
    router.onReady(() => {
      if (context.res && router.currentRoute.name === 404) {
        context.res.statusCode = 404
      }
      let head
      context.head = new Proxy({}, {
        get(obj, prop) {
          if (!head) {
            head = app.$meta().inject()
          }
          return prop in head ? head[prop].text() : undefined
        }
      })
      resolve(app)
    }, reject)
  })
