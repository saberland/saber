import createApp from './create-app'

export default context =>
  new Promise((resolve, reject) => {
    const { app, router } = createApp()
    router.push(context.url)
    router.onReady(() => {
      if (context.res && router.currentRoute.name === 404) {
        context.res.statusCode = 404
      }
      context.head = app.$meta()
      resolve(app)
    }, reject)
  })
