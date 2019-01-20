import createApp from './create-app'

export default context =>
  new Promise((resolve, reject) => {
    const { app, router } = createApp()
    router.push(context.url)
    router.onReady(() => {
      context.head = app.$meta()
      resolve(app)
    }, reject)
  })
